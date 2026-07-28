#!/bin/bash
set -e

echo "=== Starting MidVox ==="

# Start bot with API on internal port 5001
cd bot
export API_ENABLED=true
export API_PORT=5001
export TUNNEL_ENABLED=false
echo "Starting bot (API on port 5001)..."
python CodeX.py &
BOT_PID=$!

# Wait for bot API to be ready
sleep 10

# Start Next.js dashboard on Render's public PORT
cd ../dashboard
echo "Starting dashboard on port $PORT..."
npx next start -p $PORT &
DASHBOARD_PID=$!

echo "=== MidVox running ==="
echo "Bot PID: $BOT_PID"
echo "Dashboard PID: $DASHBOARD_PID"

wait