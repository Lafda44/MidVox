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

from fastapi import APIRouter, Depends, HTTPException
from api.dependencies import get_bot
from api.schemas import AdminStats, AdminNodeStatus, AdminConfig, AdminConfigUpdate
from typing import TYPE_CHECKING, List
from pydantic import BaseModel
import os, re, aiosqlite, asyncio, sys

if TYPE_CHECKING:
    from core.zyrox import zyrox

router = APIRouter()

CONFIG_DB = "db/admin_config.db"

async def init_db():
    async with aiosqlite.connect(CONFIG_DB) as db:
        await db.execute("CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)")
        # Default values
        await db.execute("INSERT OR IGNORE INTO config (key, value) VALUES ('maintenance_mode', 'false')")
        await db.execute("INSERT OR IGNORE INTO config (key, value) VALUES ('global_notification', '')")
        await db.commit()

import psutil
import time

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(bot: "zyrox" = Depends(get_bot)):
    # Calculate DB size and shard info
    total_size: float = 0.0
    db_count = 0
    db_dir = "db"
    if os.path.exists(db_dir):
        for f in os.listdir(db_dir):
            if f.endswith(".db"):
                total_size += float(os.path.getsize(os.path.join(db_dir, f)))
                db_count += 1
    
    mb_size = total_size / (1024 * 1024)
    db_size_str = f"{mb_size:.2f} MB"
    if mb_size > 1024:
        db_size_str = f"{(mb_size / 1024):.2f} GB"

    # System Metrics
    process = psutil.Process(os.getpid())
    # Use a non-blocking interval check or global state for CPU
    cpu_usage = psutil.cpu_percent() 
    ram_raw = process.memory_info().rss
    ram_mb = ram_raw / (1024 * 1024)
    
    total_commands = len(bot.commands)
    loaded_cogs = len(bot.cogs or {})

    # Node Healths
    nodes = [
        AdminNodeStatus(
            name="Primary API Cluster", 
            status="Healthy", 
            load=f"CPU: {cpu_usage}% | RAM: {ram_mb:.1f}MB", 
            icon="Globe"
        ),
        AdminNodeStatus(
            name="Database Shards", 
            status="Healthy" if db_count > 0 else "Warning", 
            load=f"{db_count} SQLite DBs | {db_size_str}", 
            icon="Database"
        ),
        AdminNodeStatus(
            name="Bot Microservices", 
            status="Healthy" if bot.is_ready() else "Booting", 
            load=f"{loaded_cogs} Modules", 
            icon="Cpu"
        ),
        AdminNodeStatus(
            name="Auth Sockets", 
            status="Healthy", 
            load=f"Shard: {bot.shard_count} | Latency: {round(bot.latency * 1000)}ms", 
            icon="Lock"
        )
    ]

    total_members = sum(g.member_count or 0 for g in bot.guilds)

    return AdminStats(
        total_users=str(total_members),
        active_servers=str(len(bot.guilds)),
        api_latency=f"{round(bot.latency * 1000, 2)}ms",
        db_size=db_size_str,
        nodes=nodes
    )

@router.get("/config", response_model=AdminConfig)
async def get_admin_config():
    await init_db()
    async with aiosqlite.connect(CONFIG_DB) as db:
        async with db.execute("SELECT value FROM config WHERE key = 'maintenance_mode'") as cursor:
            mm = await cursor.fetchone()
        async with db.execute("SELECT value FROM config WHERE key = 'global_notification'") as cursor:
            gn = await cursor.fetchone()
            
    return AdminConfig(
        maintenance_mode=mm[0].lower() == 'true' if mm else False,
        global_notification=gn[0] if gn else None
    )

@router.patch("/config")
async def patch_admin_config(data: AdminConfigUpdate):
    await init_db()
    async with aiosqlite.connect(CONFIG_DB) as db:
        if data.maintenance_mode is not None:
            await db.execute("UPDATE config SET value = ? WHERE key = 'maintenance_mode'", (str(data.maintenance_mode).lower(),))
        if data.global_notification is not None:
            await db.execute("UPDATE config SET value = ? WHERE key = 'global_notification'", (data.global_notification,))
        await db.commit()
    return {"status": "success"}

@router.post("/sync-emojis")
async def sync_emojis(bot: "zyrox" = Depends(get_bot)):
    token = os.getenv("TOKEN") or os.getenv("BOT_TOKEN")
    if not token:
        raise HTTPException(status_code=500, detail="No bot token available")
    try:
        from utils.sync_emojis import run_sync
        await run_sync(token)
        return {"status": "synced", "detail": "Emoji IDs updated. Restart bot to apply."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emoji sync failed: {e}")

EMOJI_PY_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "utils", "emoji.py")

class EmojiEntry(BaseModel):
    name: str
    var_name: str
    emoji_id: str
    animated: bool
    raw: str

def _parse_emoji_file() -> List[EmojiEntry]:
    with open(EMOJI_PY_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    entries = []
    for m in re.finditer(r'^(\w+)\s*=\s*"<((a?):(\w+):(\d+))>"', content, re.MULTILINE):
        var_name, full, animated_str, name, eid = m.groups()
        entries.append(EmojiEntry(
            name=name,
            var_name=var_name,
            emoji_id=eid,
            animated=bool(animated_str),
            raw=f"<{animated_str}:{name}:{eid}>",
        ))
    return entries

def _write_emoji_file(entries: List[EmojiEntry]):
    lines = []
    with open(EMOJI_PY_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    for e in entries:
        a = "a" if e.animated else ""
        old = re.search(rf'^{e.var_name}\s*=\s*".*?"', content, re.MULTILINE)
        new_val = f'{e.var_name} = "<{a}:{e.name}:{e.emoji_id}>"'
        if old:
            content = content[:old.start()] + new_val + content[old.end():]
    with open(EMOJI_PY_PATH, "w", encoding="utf-8") as f:
        f.write(content)

@router.get("/emojis")
async def list_emojis():
    entries = _parse_emoji_file()
    return {"emojis": [e.dict() for e in entries], "total": len(entries)}

@router.post("/emojis")
async def add_emoji(var_name: str, name: str, emoji_id: str, animated: bool = False):
    entries = _parse_emoji_file()
    if any(e.var_name == var_name for e in entries):
        raise HTTPException(400, f"Emoji '{var_name}' already exists")
    a = "a" if animated else ""
    line = f'{var_name} = "<{a}:{name}:{emoji_id}>"\n'
    with open(EMOJI_PY_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    footer = "\n# ============================================================================\n"
    if footer in content:
        content = content.replace(footer, line + footer)
    else:
        content += "\n" + line
    with open(EMOJI_PY_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    return {"status": "added", "var_name": var_name}

@router.delete("/emojis/{var_name}")
async def delete_emoji(var_name: str):
    with open(EMOJI_PY_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    new_content = re.sub(
        rf'^{re.escape(var_name)}\s*=\s*".*?"\n?', "", content, flags=re.MULTILINE
    )
    if new_content == content:
        raise HTTPException(404, f"Emoji '{var_name}' not found")
    with open(EMOJI_PY_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)
    return {"status": "deleted", "var_name": var_name}

@router.patch("/emojis/{var_name}")
async def update_emoji(var_name: str, name: str = None, emoji_id: str = None, animated: bool = None):
    with open(EMOJI_PY_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(rf'^({re.escape(var_name)}\s*=\s*"<)(a?)(:(\w+):(\d+))(>"\s*)$', content, re.MULTILINE)
    if not match:
        raise HTTPException(404, f"Emoji '{var_name}' not found")
    prefix, old_animated, _, old_name, old_id, suffix = match.groups()
    new_animated = ("a" if animated else "") if animated is not None else old_animated
    new_name = name or old_name
    new_id = emoji_id or old_id
    new_line = f'{prefix}{new_animated}:{new_name}:{new_id}{suffix}'
    content = content[:match.start()] + new_line + content[match.end():]
    with open(EMOJI_PY_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    return {"status": "updated", "var_name": var_name}
