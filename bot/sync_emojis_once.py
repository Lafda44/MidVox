"""
Standalone emoji sync — runs before the bot starts, patches emoji.py directly.
Uses only stdlib (urllib, re, base64) — no aiohttp, no dotenv needed.
"""
import os, re, sys, json, base64, urllib.request, urllib.error, time

EMOJI_PY = os.path.join(os.path.dirname(__file__), "utils", "emoji.py")

def log(msg):
    print(f"[EmojiSync] {msg}")

# Read bot token
token = os.environ.get("BOT_TOKEN") or os.environ.get("TOKEN")
if not token:
    log("No BOT_TOKEN/TOKEN found, skipping.")
    sys.exit(0)

# Read emoji.py
try:
    with open(EMOJI_PY, "r", encoding="utf-8") as f:
        content = f.read()
except Exception as e:
    log(f"Failed to read emoji.py: {e}")
    sys.exit(1)

matches = set(re.findall(r"<(a?):(\w+):(\d+)>", content))
log(f"Found {len(matches)} emoji references in emoji.py")
if not matches:
    sys.exit(0)

headers = {
    "Authorization": f"Bot {token}",
    "Content-Type": "application/json",
    "User-Agent": "MidVoxBot/1.0",
}

def api(method, url, data=None):
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        log(f"HTTP {e.code}: {e.read().decode()[:200]}")
        return None

# Get bot user info to find app ID
bot_info = api("GET", "https://discord.com/api/v10/users/@me")
if not bot_info:
    log("Failed to fetch bot info — aborting.")
    sys.exit(1)
app_id = bot_info.get("id")
log(f"Bot user ID: {app_id}")

# Fetch existing application emojis
data = api("GET", f"https://discord.com/api/v10/applications/{app_id}/emojis")
app_emojis = data.get("items", []) if isinstance(data, dict) else data or []
log(f"Application has {len(app_emojis)} emojis")

updated = False
uploaded = fixed = skipped = failed = 0

for animated_str, name, old_id in matches:
    animated = animated_str == "a"

    existing = next(
        (e for e in app_emojis if e["id"] == old_id),
        None
    ) or next(
        (e for e in app_emojis if e["name"] == name),
        None
    )

    if existing:
        new_id = existing["id"]
        if old_id != new_id:
            old_str = f"<{animated_str}:{name}:{old_id}>"
            new_str = f"<{animated_str}:{existing['name']}:{new_id}>"
            content = content.replace(old_str, new_str)
            updated = True
            fixed += 1
            log(f"Fixed ID: {name} {old_id} -> {new_id}")
        else:
            skipped += 1
        continue

    # Not found — download and upload
    log(f"Uploading: {name}")
    ext = "gif" if animated else "webp"
    img_url = f"https://cdn.discordapp.com/emojis/{old_id}.{ext}"
    try:
        req = urllib.request.Request(img_url)
        with urllib.request.urlopen(req, timeout=15) as r:
            img_data = r.read()
    except Exception as e:
        log(f"Failed to download {name}: {e}")
        failed += 1
        continue

    mime = "image/gif" if animated else "image/webp"
    b64 = base64.b64encode(img_data).decode("utf-8")
    body = json.dumps({"name": name, "image": f"data:{mime};base64,{b64}"}).encode()

    result = api("POST", f"https://discord.com/api/v10/applications/{app_id}/emojis", body)
    if result and result.get("id"):
        new_id = result["id"]
        old_str = f"<{animated_str}:{name}:{old_id}>"
        new_str = f"<{animated_str}:{result['name']}:{new_id}>"
        content = content.replace(old_str, new_str)
        app_emojis.append(result)
        updated = True
        uploaded += 1
        log(f"Uploaded {name} -> ID {new_id}")
    else:
        log(f"Upload failed for {name}")
        failed += 1

    time.sleep(0.5)

# Write patched file
if updated:
    try:
        with open(EMOJI_PY, "w", encoding="utf-8") as f:
            f.write(content)
        log(f"emoji.py patched: {uploaded} uploaded, {fixed} fixed, {failed} failed")
    except Exception as e:
        log(f"Failed to write emoji.py: {e}")
else:
    log(f"No changes needed ({skipped} already correct, {failed} failed)")

log("Emoji sync complete.")