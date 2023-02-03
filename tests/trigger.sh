#! /bin/bash

# trigger ciccd service on port 8080 (save data into builds collection)
curl -d "@pub-sub-message.json" -X POST \
  -H "Ce-Type: true" \
  -H "Ce-Specversion: true" \
  -H "Ce-Source: true" \
  -H "Ce-Id: true" \
  -H "Content-Type: application/json" \
  http://localhost:8080

# trigger notification service on port 8081 (send chat messages)
curl -d "@pub-sub-message.json" -X POST \
  -H "Ce-Type: true" \
  -H "Ce-Specversion: true" \
  -H "Ce-Source: true" \
  -H "Ce-Id: true" \
  -H "Content-Type: application/json" \
  http://localhost:8081