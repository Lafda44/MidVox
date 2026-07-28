import discord
from discord.ext import commands
import aiosqlite
import asyncio
import time
from datetime import timedelta
from collections import defaultdict, deque
from utils.Tools import *

class AntiSpamPlus(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.user_data = defaultdict(deque)
        self.message_reactions = defaultdict(lambda: defaultdict(int))
        self.cooldown = {}

    async def get_config(self, guild_id):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS config (
                    guild_id INTEGER PRIMARY KEY,
                    delete_messages INTEGER DEFAULT 0,
                    delete_delay INTEGER DEFAULT 8,
                    re_limit INTEGER DEFAULT 5,
                    re_window INTEGER DEFAULT 30,
                    re_cooldown INTEGER DEFAULT 20,
                    re_delay REAL DEFAULT 0.35,
                    timeout_duration INTEGER DEFAULT 1
                )
            """)
            await db.execute("""
                CREATE TABLE IF NOT EXISTS target_users (
                    guild_id INTEGER,
                    user_id INTEGER,
                    PRIMARY KEY (guild_id, user_id)
                )
            """)
            await db.execute("""
                CREATE TABLE IF NOT EXISTS blocked_commands (
                    guild_id INTEGER,
                    command TEXT,
                    PRIMARY KEY (guild_id, command)
                )
            """)
            await db.execute("""
                CREATE TABLE IF NOT EXISTS excluded_channels (
                    guild_id INTEGER,
                    channel_id INTEGER,
                    PRIMARY KEY (guild_id, channel_id)
                )
            """)
            await db.execute("""
                CREATE TABLE IF NOT EXISTS target_channels (
                    guild_id INTEGER,
                    channel_id INTEGER,
                    PRIMARY KEY (guild_id, channel_id)
                )
            """)
            await db.commit()

            cursor = await db.execute("SELECT * FROM config WHERE guild_id = ?", (guild_id,))
            row = await cursor.fetchone()
            if not row:
                await db.execute("INSERT INTO config (guild_id) VALUES (?)", (guild_id,))
                await db.commit()
                return {
                    "guild_id": guild_id, "delete_messages": False, "delete_delay": 8,
                    "re_limit": 5, "re_window": 30, "re_cooldown": 20,
                    "re_delay": 0.35, "timeout_duration": 1,
                    "target_users": [], "blocked_commands": [],
                    "excluded_channels": [], "target_channels": []
                }

            cursor = await db.execute("SELECT user_id FROM target_users WHERE guild_id = ?", (guild_id,))
            target_users = [r[0] for r in await cursor.fetchall()]
            cursor = await db.execute("SELECT command FROM blocked_commands WHERE guild_id = ?", (guild_id,))
            blocked_commands = [r[0] for r in await cursor.fetchall()]
            cursor = await db.execute("SELECT channel_id FROM excluded_channels WHERE guild_id = ?", (guild_id,))
            excluded_channels = [r[0] for r in await cursor.fetchall()]
            cursor = await db.execute("SELECT channel_id FROM target_channels WHERE guild_id = ?", (guild_id,))
            target_channels = [r[0] for r in await cursor.fetchall()]

            return {
                "guild_id": guild_id, "delete_messages": bool(row[1]), "delete_delay": row[2],
                "re_limit": row[3], "re_window": row[4], "re_cooldown": row[5],
                "re_delay": row[6], "timeout_duration": row[7],
                "target_users": target_users, "blocked_commands": blocked_commands,
                "excluded_channels": excluded_channels, "target_channels": target_channels
            }

    async def update_config(self, guild_id, data):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("""
                INSERT OR REPLACE INTO config (guild_id, delete_messages, delete_delay, re_limit, re_window, re_cooldown, re_delay, timeout_duration)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                guild_id,
                1 if data.get("delete_messages") else 0,
                data.get("delete_delay", 8),
                data.get("re_limit", 5),
                data.get("re_window", 30),
                data.get("re_cooldown", 20),
                data.get("re_delay", 0.35),
                data.get("timeout_duration", 1)
            ))
            await db.commit()
        return await self.get_config(guild_id)

    async def add_target_user(self, guild_id, user_id):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("INSERT OR IGNORE INTO target_users (guild_id, user_id) VALUES (?, ?)", (guild_id, user_id))
            await db.commit()

    async def remove_target_user(self, guild_id, user_id):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("DELETE FROM target_users WHERE guild_id = ? AND user_id = ?", (guild_id, user_id))
            await db.commit()

    async def add_blocked_command(self, guild_id, command):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("INSERT OR IGNORE INTO blocked_commands (guild_id, command) VALUES (?, ?)", (guild_id, command.lower()))
            await db.commit()

    async def remove_blocked_command(self, guild_id, command):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("DELETE FROM blocked_commands WHERE guild_id = ? AND command = ?", (guild_id, command.lower()))
            await db.commit()

    async def add_excluded_channel(self, guild_id, channel_id):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("INSERT OR IGNORE INTO excluded_channels (guild_id, channel_id) VALUES (?, ?)", (guild_id, channel_id))
            await db.commit()

    async def remove_excluded_channel(self, guild_id, channel_id):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("DELETE FROM excluded_channels WHERE guild_id = ? AND channel_id = ?", (guild_id, channel_id))
            await db.commit()

    async def add_target_channel(self, guild_id, channel_id):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("INSERT OR IGNORE INTO target_channels (guild_id, channel_id) VALUES (?, ?)", (guild_id, channel_id))
            await db.commit()

    async def remove_target_channel(self, guild_id, channel_id):
        async with aiosqlite.connect("db/antispamplus.db") as db:
            await db.execute("DELETE FROM target_channels WHERE guild_id = ? AND channel_id = ?", (guild_id, channel_id))
            await db.commit()

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
            same_msg_trigger = self.message_reactions[payload.user_id][payload.message_id] > 4
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
                await user.send("⚠️ Stop spamming reactions.\nYou are timed out for 1 minute.")
            except Exception:
                pass

            try:
                if member:
                    await member.timeout(discord.utils.utcnow() + timedelta(minutes=config["timeout_duration"]))
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
                                target_user = member or await self.bot.fetch_user(payload.user_id)
                                await msg.remove_reaction(reaction.emoji, target_user)
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