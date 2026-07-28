import os
import aiosqlite
from motor.motor_asyncio import AsyncIOMotorClient


SQLITE_DBS = [
    "db/automod.db",
    "db/anti.db",
    "db/admin_config.db",
    "db/antispamplus.db",
]


class MongoManager:
    def __init__(self):
        self._client = None
        self._db = None

    async def connect(self, uri: str = None, db_name: str = "midvox"):
        uri = uri or os.getenv("MONGO_URI")
        if not uri:
            raise ValueError("MONGO_URI is not set")
        self._client = AsyncIOMotorClient(uri)
        self._db = self._client[db_name]
        await self._client.admin.command("ping")
        return self

    @property
    def antispamplus_config(self):
        return self._db["antispamplus_config"]

    async def close(self):
        if self._client:
            self._client.close()

    @property
    def _sqlite_backup(self):
        return self._db["sqlite_backup"]

    async def backup_sqlite(self, db_path: str = None):
        """Upload a SQLite db file to MongoDB as a backup."""
        paths = [db_path] if db_path else SQLITE_DBS
        for p in paths:
            if not os.path.exists(p):
                continue
            with open(p, "rb") as f:
                data = f.read()
            name = os.path.basename(p)
            await self._sqlite_backup.replace_one(
                {"_id": name},
                {"_id": name, "data": data, "updated_at": __import__("datetime").datetime.utcnow()},
                upsert=True,
            )

    async def restore_sqlite(self, db_path: str = None):
        """Download a SQLite db file from MongoDB backup and write it to disk."""
        paths = [db_path] if db_path else SQLITE_DBS
        for p in paths:
            name = os.path.basename(p)
            doc = await self._sqlite_backup.find_one({"_id": name})
            if not doc:
                continue
            os.makedirs(os.path.dirname(p) or ".", exist_ok=True)
            with open(p, "wb") as f:
                f.write(doc["data"])