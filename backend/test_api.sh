#!/bin/bash

echo "=== Testing Multi-Service Offerte API ==="
echo ""

echo "1. Health Check:"
curl -s http://localhost:8001/api/ | python -m json.tool
echo ""

echo "2. Get Company Settings (Public):"
curl -s http://localhost:8001/api/settings/company | python -m json.tool | head -20
echo ""

echo "3. Login as Admin:"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123")
echo "$LOGIN_RESPONSE" | python -m json.tool
TOKEN=$(echo "$LOGIN_RESPONSE" | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)
echo ""

echo "4. Get Service Categories:"
curl -s http://localhost:8001/api/categories | python -m json.tool | head -30
echo ""

echo "5. Get Additional Services:"
curl -s "http://localhost:8001/api/services?category_id=umzug" | python -m json.tool | head -30
echo ""

echo "✅ API Tests Complete!"
