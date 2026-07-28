"""
Standalone emoji sync — runs once before the bot starts, no restart.
"""
import os, sys, asyncio
sys.path.insert(0, os.path.dirname(__file__))

# Prevent _restart() from doing anything
import utils.sync_emojis as se
se._restart = lambda: se.system("Would restart here (skipped in standalone mode)")

os.environ["EMOJI_SYNC"] = "true"
token = os.environ.get("BOT_TOKEN")
if not token:
    print("[EmojiSync] No BOT_TOKEN found, skipping.")
    sys.exit(0)

asyncio.run(se.run_sync(token))
print("[EmojiSync] Standalone sync complete.")