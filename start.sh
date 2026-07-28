#!/bin/bash

echo "=== Starting MidVox ==="

# Add Node.js binary to PATH (extracted during build into .node/)
export PATH="$(dirname "$0")/.node/bin:$PATH"

export API_ENABLED=true
export API_PORT=5001
export TUNNEL_ENABLED=false
export EMOJI_SYNC=false

# Run bot in a restart loop so if it crashes the API stays up
(
  while true; do
    cd bot
    echo "Starting bot (API on port 5001)..."
    python CodeX.py > ../bot.log 2>&1
    echo "WARNING: Bot exited (code $?). Restarting in 2s..." >&2
    sleep 2
  done
) &
BOT_PID=$!

# Wait for bot API to be ready (health check)
echo "Waiting for bot API on port 5001..."
for i in $(seq 1 30); do
  if python -c "
import urllib.request, json
resp = urllib.request.urlopen('http://localhost:5001/health')
data = json.loads(resp.read())
if data.get('status') == 'ok':
    exit(0)
exit(1)
" > /dev/null 2>&1; then
    echo "Bot API is ready!"
    break
  fi
  echo "  Attempt $i/30..."
  sleep 2
done

# Start Next.js dashboard on Render's public PORT
cd dashboard
echo "Starting dashboard on port $PORT..."
npx next start -p $PORT &
DASHBOARD_PID=$!

echo "=== MidVox running ==="
echo "Bot PID: $BOT_PID"
echo "Dashboard PID: $DASHBOARD_PID"

wait