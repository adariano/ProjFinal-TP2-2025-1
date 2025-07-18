#!/bin/bash

# Test script for Google Maps crawler
echo "Testing Google Maps crawler..."

# Start the development server in the background
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test the crawler API
echo "Testing crawler API..."
curl -X POST http://localhost:3000/api/route/crawl \
  -H "Content-Type: application/json" \
  -d '{
    "userLat": -15.7942,
    "userLng": -47.8822,
    "marketId": 1,
    "marketName": "Supermercado Teste",
    "marketLat": -15.7801,
    "marketLng": -47.9292
  }'

# Stop the server
kill $SERVER_PID

echo "Test completed!"
