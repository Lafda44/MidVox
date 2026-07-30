"""
Insert blocked music commands into antispamplus.db.
Run this once: python seed_blocked_commands.py
"""
import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "bot", "db", "antispamplus.db")
GUILD_ID = 1435022005312163980

PREFIXES = ["+", ";", ",", "!", "f", "=", ">", "$", "&"]
COMMANDS = ["loop", "pause", "play", "skip", "stop", "vol", "volume"]

async def main():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""CREATE TABLE IF NOT EXISTS blocked_commands (
            guild_id INTEGER, command TEXT, PRIMARY KEY (guild_id, command)
        )""")
        count = 0
        for cmd in COMMANDS:
            for prefix in PREFIXES:
                full = f"{prefix}{cmd}"
                try:
                    await db.execute(
                        "INSERT OR IGNORE INTO blocked_commands (guild_id, command) VALUES (?, ?)",
                        (GUILD_ID, full)
                    )
                    count += 1
                except Exception as e:
                    print(f"  Failed: {full} — {e}")
        await db.commit()
    print(f"Inserted {count} blocked commands for guild {GUILD_ID}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
