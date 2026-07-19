#!/bin/bash
# Watchdog for Bento — checks every 10 seconds, restarts if server is down
while true; do
  if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
    echo "[$(date)] Server down, restarting..."
    kill $(lsof -t -i:3000) 2>/dev/null
    cd /home/team/shared/bento
    nohup npm run start -- -p 3000 > /tmp/bento-server.log 2>&1 &
    echo "[$(date)] Server restarted with PID $!"
  fi
  sleep 10
done
