"""
One-time migration: copy AntiSpamPlus data from SQLite → MongoDB.

Usage:
    python migrate.py

Requires MONGO_URI env var or edit the URI below.
"""
import asyncio
import os
import sys

import aiosqlite
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("MONGO_URI env var is required. Set it to your MongoDB connection string.")
    sys.exit(1)
DB_PATH = "db/antispamplus.db"


async def migrate():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["midvox"]
    col = db["antispamplus_config"]
    print(f"Connected to MongoDB — {await client.admin.command('ping')}")

    # Read SQLite
    async with aiosqlite.connect(DB_PATH) as sql:
        cursor = await sql.execute("SELECT * FROM config")
        rows = await cursor.fetchall()

    if not rows:
        print("No config rows found.")
        return

    for row in rows:
        guild_id = row[0]
        doc = {
            "_id": str(guild_id),
            "guild_id": guild_id,
            "delete_messages": bool(row[1]),
            "delete_delay": row[2],
            "re_limit": row[3],
            "re_window": row[4],
            "re_cooldown": row[5],
            "re_delay": row[6],
            "timeout_duration": row[7],
        }

        # Read array tables
        for table, field in [
            ("target_users", "target_users"),
            ("blocked_commands", "blocked_commands"),
            ("excluded_channels", "excluded_channels"),
            ("target_channels", "target_channels"),
        ]:
            async with aiosqlite.connect(DB_PATH) as sql2:
                c = await sql2.execute(
                    f"SELECT * FROM {table} WHERE guild_id = ?", (guild_id,)
                )
                items = await c.fetchall()
                if table == "blocked_commands":
                    doc[field] = [r[1] for r in items]
                else:
                    doc[field] = [r[1] for r in items]

        await col.replace_one({"_id": str(guild_id)}, doc, upsert=True)
        print(f"  Migrated guild {guild_id}")

    print(f"\nDone — {len(rows)} guild(s) migrated.")
    client.close()


if __name__ == "__main__":
    asyncio.run(migrate())