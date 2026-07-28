import discord
from discord.ext import commands
import aiosqlite
import asyncio
import os
import time
from datetime import timedelta
from collections import defaultdict, deque
from utils.Tools import *


CONFIG_DEFAULTS = {
    "delete_messages": False,
    "delete_delay": 8,
    "re_limit": 5,
    "re_window": 30,
    "re_cooldown": 20,
    "re_delay": 0.35,
    "timeout_duration": 1,
}


def _doc_to_config(doc):
    return {
        "guild_id": doc["guild_id"],
        "delete_messages": doc.get("delete_messages", False),
        "delete_delay": doc.get("delete_delay", 8),
        "re_limit": doc.get("re_limit", 5),
        "re_window": doc.get("re_window", 30),
        "re_cooldown": doc.get("re_cooldown", 20),
        "re_delay": doc.get("re_delay", 0.35),
        "timeout_duration": doc.get("timeout_duration", 1),
        "target_users": doc.get("target_users", []),
        "blocked_commands": doc.get("blocked_commands", []),
        "excluded_channels": doc.get("excluded_channels", []),
        "target_channels": doc.get("target_channels", []),
    }


class AntiSpamPlus(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.user_data = defaultdict(deque)
        self.message_reactions = defaultdict(lambda: defaultdict(int))
        self.cooldown = {}
        self.mongo = getattr(bot, "mongo", None)

    # ── MongoDB helpers (single document per guild) ──────────────────────

    async def _get_doc(self, guild_id):
        doc = await self.mongo.antispamplus_config.find_one({"_id": str(guild_id)})
        if doc:
            return doc
        default = {
            "_id": str(guild_id),
            "guild_id": guild_id,
            **CONFIG_DEFAULTS,
            "target_users": [],
            "blocked_commands": [],
            "excluded_channels": [],
            "target_channels": [],
        }
        await self.mongo.antispamplus_config.insert_one(default)
        return default

    async def _set_fields(self, guild_id, data):
        doc = await self.mongo.antispamplus_config.find_one({"_id": str(guild_id)})
        if not doc:
            await self.mongo.antispamplus_config.insert_one({
                "_id": str(guild_id),
                "guild_id": guild_id,
                **CONFIG_DEFAULTS,
                "target_users": [],
                "blocked_commands": [],
                "excluded_channels": [],
                "target_channels": [],
            })
        update = {"$set": {}}
        for k in CONFIG_DEFAULTS:
            if k in data:
                update["$set"][k] = data[k]
        if update["$set"]:
            update["$set"]["guild_id"] = guild_id
            await self.mongo.antispamplus_config.update_one(
                {"_id": str(guild_id)}, update
            )

    async def _push_array(self, guild_id, field, value):
        doc = await self.mongo.antispamplus_config.find_one({"_id": str(guild_id)})
        if not doc:
            await self.mongo.antispamplus_config.insert_one({
                "_id": str(guild_id),
                "guild_id": guild_id,
                **CONFIG_DEFAULTS,
                "target_users": [],
                "blocked_commands": [],
                "excluded_channels": [],
                "target_channels": [],
            })
        await self.mongo.antispamplus_config.update_one(
            {"_id": str(guild_id)},
            {"$addToSet": {field: value}}
        )

    async def _pull_array(self, guild_id, field, value):
        await self.mongo.antispamplus_config.update_one(
            {"_id": str(guild_id)}, {"$pull": {field: value}}
        )

    # ── SQLite helpers (fallback) ────────────────────────────────────────

    def _sqlite_conn(self):
        os.makedirs("db", exist_ok=True)
        return aiosqlite.connect("db/antispamplus.db")

    async def _ensure_sqlite_tables(self, db):
        tables = [
            """CREATE TABLE IF NOT EXISTS config (
                guild_id INTEGER PRIMARY KEY, delete_messages INTEGER DEFAULT 0,
                delete_delay INTEGER DEFAULT 8, re_limit INTEGER DEFAULT 5,
                re_window INTEGER DEFAULT 30, re_cooldown INTEGER DEFAULT 20,
                re_delay REAL DEFAULT 0.35, timeout_duration INTEGER DEFAULT 1
            )""",
            """CREATE TABLE IF NOT EXISTS target_users (
                guild_id INTEGER, user_id INTEGER, PRIMARY KEY (guild_id, user_id)
            )""",
            """CREATE TABLE IF NOT EXISTS blocked_commands (
                guild_id INTEGER, command TEXT, PRIMARY KEY (guild_id, command)
            )""",
            """CREATE TABLE IF NOT EXISTS excluded_channels (
                guild_id INTEGER, channel_id INTEGER, PRIMARY KEY (guild_id, channel_id)
            )""",
            """CREATE TABLE IF NOT EXISTS target_channels (
                guild_id INTEGER, channel_id INTEGER, PRIMARY KEY (guild_id, channel_id)
            )""",
        ]
        for t in tables:
            await db.execute(t)
        await db.commit()

    # ── Public API ───────────────────────────────────────────────────────

    async def get_config(self, guild_id):
        if self.mongo:
            doc = await self._get_doc(guild_id)
            return _doc_to_config(doc)

        async with self._sqlite_conn() as db:
            await self._ensure_sqlite_tables(db)

            cursor = await db.execute(
                "SELECT * FROM config WHERE guild_id = ?", (guild_id,)
            )
            row = await cursor.fetchone()

            if not row:
                await db.execute(
                    "INSERT INTO config (guild_id) VALUES (?)", (guild_id,)
                )
                await db.commit()
                return {
                    "guild_id": guild_id,
                    **CONFIG_DEFAULTS,
                    "target_users": [],
                    "blocked_commands": [],
                    "excluded_channels": [],
                    "target_channels": [],
                }

            cursor = await db.execute(
                "SELECT user_id FROM target_users WHERE guild_id = ?", (guild_id,)
            )
            target_users = [r[0] for r in await cursor.fetchall()]
            cursor = await db.execute(
                "SELECT command FROM blocked_commands WHERE guild_id = ?", (guild_id,)
            )
            blocked_commands = [r[0] for r in await cursor.fetchall()]
            cursor = await db.execute(
                "SELECT channel_id FROM excluded_channels WHERE guild_id = ?",
                (guild_id,),
            )
            excluded_channels = [r[0] for r in await cursor.fetchall()]
            cursor = await db.execute(
                "SELECT channel_id FROM target_channels WHERE guild_id = ?",
                (guild_id,),
            )
            target_channels = [r[0] for r in await cursor.fetchall()]

            return {
                "guild_id": guild_id,
                "delete_messages": bool(row[1]),
                "delete_delay": row[2],
                "re_limit": row[3],
                "re_window": row[4],
                "re_cooldown": row[5],
                "re_delay": row[6],
                "timeout_duration": row[7],
                "target_users": target_users,
                "blocked_commands": blocked_commands,
                "excluded_channels": excluded_channels,
                "target_channels": target_channels,
            }

    async def update_config(self, guild_id, data):
        if self.mongo:
            await self._set_fields(guild_id, data)
            doc = await self._get_doc(guild_id)
            return _doc_to_config(doc)

        async with self._sqlite_conn() as db:
            await self._ensure_sqlite_tables(db)
            await db.execute(
                """INSERT OR REPLACE INTO config
                   (guild_id, delete_messages, delete_delay, re_limit,
                    re_window, re_cooldown, re_delay, timeout_duration)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    guild_id,
                    1 if data.get("delete_messages") else 0,
                    data.get("delete_delay", 8),
                    data.get("re_limit", 5),
                    data.get("re_window", 30),
                    data.get("re_cooldown", 20),
                    data.get("re_delay", 0.35),
                    data.get("timeout_duration", 1),
                ),
            )
            await db.commit()
        return await self.get_config(guild_id)

    async def add_target_user(self, guild_id, user_id):
        if self.mongo:
            return await self._push_array(guild_id, "target_users", user_id)
        async with self._sqlite_conn() as db:
            await self._ensure_sqlite_tables(db)
            await db.execute(
                "INSERT OR IGNORE INTO target_users (guild_id, user_id) VALUES (?, ?)",
                (guild_id, user_id),
            )
            await db.commit()

    async def remove_target_user(self, guild_id, user_id):
        if self.mongo:
            return await self._pull_array(guild_id, "target_users", user_id)
        async with self._sqlite_conn() as db:
            await db.execute(
                "DELETE FROM target_users WHERE guild_id = ? AND user_id = ?",
                (guild_id, user_id),
            )
            await db.commit()

    async def add_blocked_command(self, guild_id, command):
        if self.mongo:
            return await self._push_array(
                guild_id, "blocked_commands", command.lower()
            )
        async with self._sqlite_conn() as db:
            await db.execute(
                "INSERT OR IGNORE INTO blocked_commands (guild_id, command) VALUES (?, ?)",
                (guild_id, command.lower()),
            )
            await db.commit()

    async def remove_blocked_command(self, guild_id, command):
        if self.mongo:
            return await self._pull_array(
                guild_id, "blocked_commands", command.lower()
            )
        async with self._sqlite_conn() as db:
            await db.execute(
                "DELETE FROM blocked_commands WHERE guild_id = ? AND command = ?",
                (guild_id, command.lower()),
            )
            await db.commit()

    async def add_excluded_channel(self, guild_id, channel_id):
        if self.mongo:
            return await self._push_array(
                guild_id, "excluded_channels", channel_id
            )
        async with self._sqlite_conn() as db:
            await db.execute(
                "INSERT OR IGNORE INTO excluded_channels (guild_id, channel_id) VALUES (?, ?)",
                (guild_id, channel_id),
            )
            await db.commit()

    async def remove_excluded_channel(self, guild_id, channel_id):
        if self.mongo:
            return await self._pull_array(
                guild_id, "excluded_channels", channel_id
            )
        async with self._sqlite_conn() as db:
            await db.execute(
                "DELETE FROM excluded_channels WHERE guild_id = ? AND channel_id = ?",
                (guild_id, channel_id),
            )
            await db.commit()

    async def add_target_channel(self, guild_id, channel_id):
        if self.mongo:
            return await self._push_array(
                guild_id, "target_channels", channel_id
            )
        async with self._sqlite_conn() as db:
            await db.execute(
                "INSERT OR IGNORE INTO target_channels (guild_id, channel_id) VALUES (?, ?)",
                (guild_id, channel_id),
            )
            await db.commit()

    async def remove_target_channel(self, guild_id, channel_id):
        if self.mongo:
            return await self._pull_array(
                guild_id, "target_channels", channel_id
            )
        async with self._sqlite_conn() as db:
            await db.execute(
                "DELETE FROM target_channels WHERE guild_id = ? AND channel_id = ?",
                (guild_id, channel_id),
            )
            await db.commit()

    # ── Listeners ────────────────────────────────────────────────────────

    @commands.Cog.listener()
    async def on_message(self, message):
        try:
            if message.author.id == self.bot.user.id or not message.guild:
                return

            config = await self.get_config(message.guild.id)
            if not config["delete_messages"]:
                return

            if message.channel.id in config["excluded_channels"]:
                return

            content = (message.content or "").lower().strip()
            should_delete = False

            if message.author.id in config["target_users"]:
                should_delete = True

            if any(
                content == cmd or content.startswith(cmd + " ")
                for cmd in config["blocked_commands"]
            ):
                should_delete = True

            if not should_delete:
                return

            print(f"[AntiSpamPlus] Deleting msg from {message.author.id} in {message.guild.id} (tu={config['target_users']}, bc={config['blocked_commands']})")
            await asyncio.sleep(config["delete_delay"])
            perms = message.channel.permissions_for(message.guild.me)
            if not perms.manage_messages:
                return

            try:
                await message.delete()
            except (discord.Forbidden, discord.NotFound, discord.HTTPException):
                pass

        except Exception as e:
            print(f"AntiSpamPlus on_message error: {e}")

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload):
        try:
            if payload.user_id == self.bot.user.id:
                return

            config = await self.get_config(payload.guild_id)
            if payload.channel_id not in config["target_channels"]:
                return

            now = time.time()
            if payload.user_id in self.cooldown:
                if now - self.cooldown[payload.user_id] < config["re_cooldown"]:
                    return

            data = self.user_data[payload.user_id]
            data.append((now, payload.message_id))
            while data and now - data[0][0] > config["re_window"]:
                data.popleft()

            unique_msgs = {msg_id for _, msg_id in data}
            self.message_reactions[payload.user_id][payload.message_id] += 1
            same_msg_trigger = (
                self.message_reactions[payload.user_id][payload.message_id] > 4
            )
            multi_msg_trigger = len(unique_msgs) >= config["re_limit"]

            if not (same_msg_trigger or multi_msg_trigger):
                return

            self.cooldown[payload.user_id] = now
            self.user_data[payload.user_id].clear()
            self.message_reactions[payload.user_id].clear()

            guild = self.bot.get_guild(payload.guild_id)
            if not guild:
                return

            member = guild.get_member(payload.user_id)
            try:
                user = member or await self.bot.fetch_user(payload.user_id)
                await user.send(
                    "⚠️ Stop spamming reactions.\nYou are timed out for 1 minute."
                )
            except Exception:
                pass

            try:
                if member:
                    await member.timeout(
                        discord.utils.utcnow()
                        + timedelta(minutes=config["timeout_duration"])
                    )
            except Exception as e:
                print(f"Timeout failed: {e}")

            for ch_id in config["target_channels"]:
                channel = self.bot.get_channel(ch_id)
                if not channel:
                    continue
                try:
                    async for msg in channel.history(limit=150):
                        for reaction in msg.reactions:
                            try:
                                target_user = member or await self.bot.fetch_user(
                                    payload.user_id
                                )
                                await msg.remove_reaction(
                                    reaction.emoji, target_user
                                )
                                await asyncio.sleep(config["re_delay"])
                            except (discord.Forbidden, discord.NotFound):
                                pass
                            except Exception as e:
                                print(f"Reaction remove failed: {e}")
                except Exception as e:
                    print(f"Channel history failed: {e}")

        except Exception as e:
            print(f"AntiSpamPlus reaction handler error: {e}")


def setup(bot):
    bot.add_cog(AntiSpamPlus(bot))