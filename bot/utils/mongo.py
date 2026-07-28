import os
from motor.motor_asyncio import AsyncIOMotorClient


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