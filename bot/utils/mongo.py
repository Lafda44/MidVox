import os, re
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

    @property
    def emoji_overrides(self):
        return self._db["emoji_overrides"]

    async def save_emoji_override(self, var_name: str, name: str, emoji_id: str, animated: bool = False):
        await self.emoji_overrides.replace_one(
            {"_id": var_name},
            {"_id": var_name, "name": name, "emoji_id": emoji_id, "animated": animated, "manual": True},
            upsert=True,
        )

    async def delete_emoji_override(self, var_name: str):
        await self.emoji_overrides.delete_one({"_id": var_name})

    async def get_all_emoji_overrides(self):
        docs = await self.emoji_overrides.find({"manual": True}).to_list(None)
        return docs

    async def apply_emoji_overrides_to_file(self, emoji_py_path: str):
        """Apply MongoDB overrides to emoji.py (overwriting synced/default values)."""
        docs = await self.get_all_emoji_overrides()
        if not docs:
            return False
        with open(emoji_py_path, "r", encoding="utf-8") as f:
            content = f.read()
        changed = False
        for doc in docs:
            var_name = doc["_id"]
            name = doc["name"]
            eid = doc["emoji_id"]
            animated = doc.get("animated", False)
            a = "a" if animated else ""
            new_line = f'{var_name} = "<{a}:{name}:{eid}>"'
            match = re.search(rf'^{re.escape(var_name)}\s*=\s*".*?"', content, re.MULTILINE)
            if match:
                content = content[:match.start()] + new_line + content[match.end():]
                changed = True
        if changed:
            with open(emoji_py_path, "w", encoding="utf-8") as f:
                f.write(content)
        return changed

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