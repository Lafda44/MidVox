# ╔══════════════════════════════════════════════════════════════════╗
# ║                                                                  ║
# ║   ░█▀▀░█▀█░█▀▄░█▀▀░█░█   ░█▀▄░█▀▀░█░█░█▀▀                     ║
# ║   ░█░░░█░█░█░█░█▀▀░▄▀▄   ░█░█░█▀▀░▀▄▀░▀▀█                     ║
# ║   ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀   ░▀▀░░▀▀▀░░▀░░▀▀▀                     ║
# ║                                                                  ║
# ║            © 2026 CodeX Devs — All Rights Reserved              ║
# ║                                                                  ║
# ║   discord  ──  https://discord.gg/codexdev                      ║
# ║   youtube  ──  https://youtube.com/@CodeXDevs                   ║
# ║   github   ──  https://github.com/RayExo                        ║
# ║                                                                  ║
# ╚══════════════════════════════════════════════════════════════════╝

"""
Media Downloader — when an Instagram link or a YouTube Short is posted in
a configured channel, download the media and repost it to Discord so it
plays inline. Instagram embeds don't render in Discord, hence the bot.

Storage mirrors the AntiSpamPlus pattern: SQLite is always written (a
crash/restart-safe mirror), MongoDB is the durable store when reachable.
"""

import discord
from discord.ext import commands
import aiosqlite
import asyncio
import os
import re
import time
import tempfile
import urllib.request
from collections import defaultdict

INSTA_URL_RE = re.compile(
    r"(?:https?://)?(?:www\.|m\.|dl\.)?(?:instagram\.com|instagr\.am)/"
    r"(?:reel|reels|p|tv|stories|share)/[\w\-]+",
    re.IGNORECASE,
)

YT_SHORTS_URL_RE = re.compile(
    r"(?:https?://)?(?:www\.|m\.)?youtube\.com/shorts/([\w\-]{6,20})",
    re.IGNORECASE,
)

CONFIG_DEFAULTS = {
    "enabled": False,
    "delete_original": False,
}


class InstaDownloader(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self._channel_cooldown = defaultdict(float)
        self._download_lock = asyncio.Lock()

    @property
    def mongo(self):
        return getattr(self.bot, "mongo", None)

    async def _ensure_mongo(self):
        """Lazy-connect Mongo on demand so reads never fall back to an
        empty SQLite mirror right after a redeploy."""
        if self.mongo:
            return True
        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            return False
        try:
            from utils.mongo import MongoManager
            mongo = MongoManager()
            await mongo.connect(mongo_uri, server_selection_timeout=5000)
            self.bot.mongo = mongo
            print("\033[32m◈ MongoDB: Connected (lazy, InstaDL)\033[0m")
            return True
        except Exception as e:
            print(f"\033[33m◈ MongoDB: lazy connect failed (InstaDL) — {e}\033[0m")
            return False

    # ── SQLite mirror ──────────────────────────────────────────────────

    def _sqlite_conn(self):
        os.makedirs("db", exist_ok=True)
        return aiosqlite.connect("db/instadl.db")

    async def _ensure_tables(self, db):
        tables = [
            """CREATE TABLE IF NOT EXISTS config (
                guild_id INTEGER PRIMARY KEY,
                enabled INTEGER DEFAULT 0,
                delete_original INTEGER DEFAULT 0
            )""",
            """CREATE TABLE IF NOT EXISTS channels (
                guild_id INTEGER, channel_id INTEGER, PRIMARY KEY (guild_id, channel_id)
            )""",
        ]
        for t in tables:
            await db.execute(t)
        await db.commit()

    async def _sqlite_get_config(self, guild_id):
        async with self._sqlite_conn() as db:
            await self._ensure_tables(db)
            cursor = await db.execute(
                "SELECT enabled, delete_original FROM config WHERE guild_id = ?",
                (guild_id,),
            )
            row = await cursor.fetchone()
            if not row:
                await db.execute(
                    "INSERT INTO config (guild_id) VALUES (?)", (guild_id,)
                )
                await db.commit()
                row = (0, 0)
            cursor = await db.execute(
                "SELECT channel_id FROM channels WHERE guild_id = ?", (guild_id,)
            )
            channels = [r[0] for r in await cursor.fetchall()]
            return {
                "guild_id": guild_id,
                "enabled": bool(row[0]),
                "delete_original": bool(row[1]),
                "channels": [str(c) for c in channels],
            }

    # ── Mongo (durable) ────────────────────────────────────────────────

    def _default_doc(self, guild_id):
        return {
            "_id": str(guild_id),
            "guild_id": guild_id,
            **CONFIG_DEFAULTS,
            "channels": [],
        }

    async def _flush_to_mongo(self, guild_id, sqlite_cfg):
        """Push the SQLite mirror state into Mongo (lazy flush on read)."""
        if not self.mongo:
            return
        try:
            doc = self._default_doc(guild_id)
            doc.update(sqlite_cfg)
            doc["guild_id"] = int(guild_id)
            doc["_id"] = str(guild_id)
            doc.pop("_doc_id", None)
            await self.mongo.instadl_config.replace_one(
                {"_id": str(guild_id)}, doc, upsert=True
            )
        except Exception as e:
            print(f"[InstaDL] Mongo flush failed for {guild_id}: {e}")

    async def _mongo_get(self, guild_id):
        if not self.mongo:
            return None
        try:
            return await self.mongo.instadl_config.find_one({"_id": str(guild_id)})
        except Exception as e:
            print(f"[InstaDL] Mongo read failed: {e}")
            return None

    # ── Public API (used by bot/api routes) ────────────────────────────

    async def get_config(self, guild_id):
        await self._ensure_mongo()
        doc = await self._mongo_get(guild_id)
        if doc:
            return {
                "guild_id": guild_id,
                "enabled": bool(doc.get("enabled", False)),
                "delete_original": bool(doc.get("delete_original", False)),
                "channels": [str(c) for c in doc.get("channels", [])],
            }
        cfg = await self._sqlite_get_config(guild_id)
        # Lazy flush: if Mongo is reachable but the doc is missing, push
        # the mirror state so nothing saved during an outage is lost.
        if self.mongo and (cfg["enabled"] or cfg["channels"] or cfg["delete_original"]):
            await self._flush_to_mongo(guild_id, cfg)
        return cfg

    async def update_config(self, guild_id, data):
        async with self._sqlite_conn() as db:
            await self._ensure_tables(db)
            row = await (await db.execute(
                "SELECT enabled, delete_original FROM config WHERE guild_id = ?",
                (guild_id,),
            )).fetchone()
            enabled = row[0] if row else 0
            delete_original = row[1] if row else 0
            if "enabled" in data:
                enabled = 1 if data["enabled"] else 0
            if "delete_original" in data:
                delete_original = 1 if data["delete_original"] else 0
            await db.execute(
                """INSERT OR REPLACE INTO config (guild_id, enabled, delete_original)
                   VALUES (?, ?, ?)""",
                (guild_id, enabled, delete_original),
            )
            await db.commit()

        await self._ensure_mongo()
        if self.mongo:
            doc = await self._mongo_get(guild_id)
            if doc:
                doc["enabled"] = bool(enabled)
                doc["delete_original"] = bool(delete_original)
                try:
                    await self.mongo.instadl_config.replace_one(
                        {"_id": str(guild_id)}, doc, upsert=True
                    )
                except Exception as e:
                    print(f"[InstaDL] Mongo update failed (mirror kept): {e}")
            else:
                await self._flush_to_mongo(guild_id, await self._sqlite_get_config(guild_id))
        return await self.get_config(guild_id)

    async def add_channel(self, guild_id, channel_id):
        try:
            async with self._sqlite_conn() as db:
                await self._ensure_tables(db)
                await db.execute(
                    "INSERT OR IGNORE INTO channels (guild_id, channel_id) VALUES (?, ?)",
                    (guild_id, channel_id),
                )
                await db.commit()
        except Exception as e:
            print(f"[InstaDL] SQLite mirror write failed: {e}")
        await self._ensure_mongo()
        if self.mongo:
            try:
                await self.mongo.instadl_config.update_one(
                    {"_id": str(guild_id)},
                    {"$addToSet": {"channels": str(channel_id)}},
                    upsert=True,
                )
            except Exception as e:
                print(f"[InstaDL] Mongo channel add failed (mirror kept): {e}")
        return await self.get_config(guild_id)

    async def remove_channel(self, guild_id, channel_id):
        try:
            async with self._sqlite_conn() as db:
                await self._ensure_tables(db)
                await db.execute(
                    "DELETE FROM channels WHERE guild_id = ? AND channel_id = ?",
                    (guild_id, channel_id),
                )
                await db.commit()
        except Exception as e:
            print(f"[InstaDL] SQLite mirror delete failed: {e}")
        await self._ensure_mongo()
        if self.mongo:
            try:
                await self.mongo.instadl_config.update_one(
                    {"_id": str(guild_id)},
                    {"$pull": {"channels": str(channel_id)}},
                )
            except Exception as e:
                print(f"[InstaDL] Mongo channel remove failed (mirror kept): {e}")
        return await self.get_config(guild_id)

    # ── Downloader ─────────────────────────────────────────────────────

    async def _auto_delete(self, msg, delay=60):
        """Delete a bot status message after `delay` seconds (media posts
        are never auto-deleted — only status/error messages use this)."""

        async def _delete_later():
            try:
                await asyncio.sleep(delay)
                await msg.delete()
            except Exception:
                pass

        try:
            asyncio.get_running_loop().create_task(_delete_later())
        except Exception:
            pass

    async def _send_status(self, channel, text, reference=None, auto_delete=60):
        try:
            msg = await channel.send(text, reference=reference)
        except Exception:
            return None
        if auto_delete:
            await self._auto_delete(msg, auto_delete)
        return msg

    @commands.Cog.listener()
    async def on_message(self, message):
        try:
            if message.author.bot or not message.guild:
                return
            if not isinstance(message.channel, discord.TextChannel):
                return

            config = await self.get_config(message.guild.id)
            if not config.get("enabled"):
                return
            if str(message.channel.id) not in config.get("channels", []):
                return

            content = message.content or ""
            insta_match = INSTA_URL_RE.search(content)
            yt_match = YT_SHORTS_URL_RE.search(content)
            if not insta_match and not yt_match:
                return

            if insta_match:
                url = insta_match.group(0)
                source = "instagram"
            else:
                url = yt_match.group(0)
                source = "youtube"

            if not url.startswith("http"):
                url = "https://" + url

            # Per-channel cooldown so a spam of links can't hammer the sites
            now = time.time()
            key = str(message.channel.id)
            if now - self._channel_cooldown.get(key, 0) < 8:
                return
            self._channel_cooldown[key] = now

            print(f"[InstaDL] downloading {source} url {url} for guild {message.guild.id}")
            await self._download_and_send(message, url, config, source)
        except Exception as e:
            print(f"[InstaDL] on_message error: {e}")

    async def _download_and_send(self, message, url, config, source="instagram"):
        """Download the media with yt-dlp and repost it in the channel."""
        try:
            import yt_dlp
        except ImportError:
            await self._send_status(
                message.channel,
                "Insta Downloader is missing the `yt-dlp` dependency.",
                reference=message,
            )
            return

        file_path = None
        try:
            tmp = os.path.join(tempfile.gettempdir(), "instadl_%(id)s.%(ext)s")
            opts = {
                "format": "b[ext=mp4]/b",
                "outtmpl": tmp,
                "quiet": True,
                "no_warnings": True,
                "noplaylist": True,
                "max_filesize": 24 * 1024 * 1024,
                "socket_timeout": 25,
                "retries": 3,
                "fragment_retries": 3,
                "geo_bypass": True,
                "http_headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
                },
                # YouTube blocks the `web` player client on datacenter IPs
                # with a "confirm you're not a bot" wall, which yt-dlp turns
                # into DownloadError. Try the mobile clients first.
                "extractor_args": {
                    "youtube": {"player_client": ["android", "ios", "tv"]},
                },
            }
            loop = asyncio.get_running_loop()

            def _download():
                with yt_dlp.YoutubeDL(opts) as ydl:
                    info = ydl.extract_info(url, download=True)
                    path = ydl.prepare_filename(info)
                    return path if os.path.exists(path) else None

            file_path = await loop.run_in_executor(None, _download)

            if not file_path or not os.path.exists(file_path):
                await self._send_status(
                    message.channel,
                    f"Couldn't download that link — the platform likely blocked it or it's not downloadable.\n{url}",
                    reference=message,
                )
                return

            size = os.path.getsize(file_path)
            if size > 25 * 1024 * 1024:
                await self._send_status(
                    message.channel,
                    f"That media is {size // 1024 // 1024}MB — Discord's upload limit is 25MB.",
                    reference=message,
                )
                return

            ext = os.path.splitext(file_path)[1] or ".mp4"
            await message.channel.send(
                file=discord.File(file_path, filename=f"{source}_{int(time.time())}{ext}")
            )

            if config.get("delete_original"):
                try:
                    await message.delete()
                except Exception:
                    pass
        except Exception as e:
            reason = str(e).strip()[:300]
            print(f"[InstaDL] download failed for {url}: {e}")
            # yt-dlp can't do image-only posts — fall back to Instagram's
            # /media endpoint which serves the post image directly.
            try:
                if await self._send_image_fallback(message, url):
                    if config.get("delete_original"):
                        try:
                            await message.delete()
                        except Exception:
                            pass
                    return
            except Exception as fb:
                print(f"[InstaDL] image fallback failed for {url}: {fb}")
            if reason and "not a bot" in reason.lower():
                await self._send_status(
                    message.channel,
                    "YouTube is rate-limiting/download-blocking from our server (\"not a bot\" check). Try again in a minute.",
                    reference=message,
                )
            elif reason:
                await self._send_status(
                    message.channel,
                    f"Couldn't download that link: `{reason}`",
                    reference=message,
                )
            else:
                await self._send_status(
                    message.channel,
                    f"Couldn't download that link: `{type(e).__name__}`",
                    reference=message,
                )
        finally:
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception:
                    pass

    async def _send_image_fallback(self, message, url):
        """Image-only posts (no video) — fetch the post image via the
        /media endpoint and repost it. Returns True if an image was sent."""
        m = re.search(r"/(?:reel|reels|p|tv|stories|share)/([\w\-]+)", url)
        if not m:
            return False
        code = m.group(1)
        media_url = f"https://www.instagram.com/p/{code}/media/?size=l"

        def _fetch():
            req = urllib.request.Request(media_url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
            })
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                ctype = resp.headers.get("Content-Type", "")
                if not ctype.startswith("image/") or not data:
                    return None
                return data

        loop = asyncio.get_running_loop()
        data = await loop.run_in_executor(None, _fetch)
        if not data:
            return False
        if len(data) > 25 * 1024 * 1024:
            return False

        path = os.path.join(tempfile.gettempdir(), f"instadl_{code}.jpg")
        with open(path, "wb") as f:
            f.write(data)
        try:
            await message.channel.send(
                file=discord.File(path, filename=f"instagram_{code}.jpg")
            )
            return True
        finally:
            if os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass


def setup(bot):
    bot.add_cog(InstaDownloader(bot))
