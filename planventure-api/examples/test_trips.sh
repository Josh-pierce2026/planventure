#!/bin/bash

# PlanVenture API - Trip Routes Testing Script
# Usage: ./test_trips.sh YOUR_ACCESS_TOKEN

if [ -z "$1" ]; then
    echo "Usage: ./test_trips.sh YOUR_ACCESS_TOKEN"
    echo "Get your access token by logging in first:"
    echo "curl -X POST http://localhost:5000/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"your@email.com\",\"password\":\"yourpassword\"}'"
    exit 1
fi

TOKEN=$1
BASE_URL="http://localhost:5000/trips"

echo "=== Testing PlanVenture Trip Routes ==="
echo ""

# 1. Create a new trip
echo "1. Creating a new trip..."
RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris, France",
    "start_date": "2025-06-15",
    "end_date": "2025-06-22",
    "latitude": 48.8566,
    "longitude": 2.3522,
    "itinerary": "Day 1: Eiffel Tower\nDay 2: Louvre Museum\nDay 3: Versailles"
  }')
echo $RESPONSE | python3 -m json.tool
TRIP_ID=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['trip']['id'])" 2>/dev/null)
echo ""

# 2. Get all trips
echo "2. Getting all trips..."
curl -s -X GET $BASE_URL \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 3. Get specific trip
if [ ! -z "$TRIP_ID" ]; then
    echo "3. Getting trip with ID $TRIP_ID..."
    curl -s -X GET $BASE_URL/$TRIP_ID \
      -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
    echo ""
    
    # 4. Update trip
    echo "4. Updating trip $TRIP_ID..."
    curl -s -X PUT $BASE_URL/$TRIP_ID \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "destination": "Paris & Nice, France",
        "itinerary": "Extended trip with Nice added!"
      }' | python3 -m json.tool
    echo ""
    
    # 5. Delete trip
    echo "5. Deleting trip $TRIP_ID..."
    curl -s -X DELETE $BASE_URL/$TRIP_ID \
      -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
    echo ""
fi

echo "=== Testing Complete ==="
