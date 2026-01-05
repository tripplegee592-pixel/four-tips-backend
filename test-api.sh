#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api"

echo -e "${BLUE}=== Four Tips Backend API Test ===${NC}\n"

# Test 1: Health Check
echo -e "${BLUE}1. Testing Health Check${NC}"
curl -s http://localhost:5000/health | jq .
echo -e ""

# Test 2: Register User
echo -e "${BLUE}2. Registering User 1 (Regular User)${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }')
echo "$REGISTER_RESPONSE" | jq .
USER1_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
USER1_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id')
echo -e ""

# Test 3: Register Tipster
echo -e "${BLUE}3. Registering User 2 (Tipster)${NC}"
TIPSTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tipster1@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith"
  }')
echo "$TIPSTER_RESPONSE" | jq .
TIPSTER_TOKEN=$(echo "$TIPSTER_RESPONSE" | jq -r '.token')
TIPSTER_ID=$(echo "$TIPSTER_RESPONSE" | jq -r '.user.id')
echo -e ""

# Test 4: Register Admin
echo -e "${BLUE}4. Registering Admin${NC}"
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "firstName": "Admin",
    "lastName": "User"
  }')
echo "$ADMIN_RESPONSE" | jq .
ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | jq -r '.token')
ADMIN_ID=$(echo "$ADMIN_RESPONSE" | jq -r '.user.id')
echo -e ""

# Test 5: Login User
echo -e "${BLUE}5. Testing Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123"
  }')
echo "$LOGIN_RESPONSE" | jq .
echo -e ""

# Test 6: Get User Profile
echo -e "${BLUE}6. Getting User Profile${NC}"
curl -s -X GET $BASE_URL/users/profile \
  -H "Authorization: Bearer $USER1_TOKEN" | jq .
echo -e ""

# Test 7: Update User Profile
echo -e "${BLUE}7. Updating User Profile${NC}"
curl -s -X PUT $BASE_URL/users/profile \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "lastName": "Doe-Updated"
  }' | jq .
echo -e ""

# Note: We need to use UPDATE query to set the tipster role for tipster user
# For now, we'll create tips with the current user role

# Test 8: Create Tip (by Tipster)
echo -e "${BLUE}8. Creating a Tip (Will fail without TIPSTER role - testing error handling)${NC}"
TIP_RESPONSE=$(curl -s -X POST $BASE_URL/tips \
  -H "Authorization: Bearer $TIPSTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Manchester United vs Liverpool",
    "description": "Exciting match between two top teams",
    "sport": "FOOTBALL",
    "matchDate": "2026-01-15T15:00:00Z",
    "odds": 1.95,
    "prediction": "Manchester United to win",
    "isPremium": false
  }')
echo "$TIP_RESPONSE" | jq .
TIP_ID=$(echo "$TIP_RESPONSE" | jq -r '.data.id // empty')
echo -e ""

# Test 9: Get All Tips
echo -e "${BLUE}9. Getting All Tips${NC}"
curl -s -X GET "$BASE_URL/tips" | jq .
echo -e ""

# Test 10: Get Tip by ID
if [ ! -z "$TIP_ID" ] && [ "$TIP_ID" != "null" ]; then
  echo -e "${BLUE}10. Getting Single Tip${NC}"
  curl -s -X GET "$BASE_URL/tips/$TIP_ID" | jq .
  echo -e ""
  
  # Test 11: Add Review to Tip
  echo -e "${BLUE}11. Adding Review to Tip${NC}"
  curl -s -X POST "$BASE_URL/tips/$TIP_ID/reviews" \
    -H "Authorization: Bearer $USER1_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "rating": 4,
      "comment": "Great tip! Very accurate prediction"
    }' | jq .
  echo -e ""
fi

# Test 12: Subscribe to Tipster
echo -e "${BLUE}12. Subscribing to Tipster${NC}"
SUBSCRIBE_RESPONSE=$(curl -s -X POST $BASE_URL/subscriptions/subscribe \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"tipsterId\": \"$TIPSTER_ID\",
    \"plan\": \"FREE\"
  }")
echo "$SUBSCRIBE_RESPONSE" | jq .
echo -e ""

# Test 13: Get My Subscriptions
echo -e "${BLUE}13. Getting My Subscriptions${NC}"
curl -s -X GET $BASE_URL/subscriptions/my-subscriptions \
  -H "Authorization: Bearer $USER1_TOKEN" | jq .
echo -e ""

# Test 14: Get My Subscribers
echo -e "${BLUE}14. Getting My Subscribers (as Tipster)${NC}"
curl -s -X GET $BASE_URL/subscriptions/my-subscribers \
  -H "Authorization: Bearer $TIPSTER_TOKEN" | jq .
echo -e ""

# Test 15: Check Subscription Status
echo -e "${BLUE}15. Checking Subscription Status${NC}"
curl -s -X GET "$BASE_URL/subscriptions/status/$TIPSTER_ID" \
  -H "Authorization: Bearer $USER1_TOKEN" | jq .
echo -e ""

# Test 16: Update Admin Role (requires manual DB update or admin endpoint)
echo -e "${BLUE}16. Testing Admin Dashboard (will fail without ADMIN role)${NC}"
curl -s -X GET $BASE_URL/admin/dashboard \
  -H "Authorization: Bearer $USER1_TOKEN" | jq .
echo -e ""

# Test 17: Admin Get All Users (will fail without ADMIN role)
echo -e "${BLUE}17. Testing Admin Get Users (will fail without ADMIN role)${NC}"
curl -s -X GET $BASE_URL/admin/users \
  -H "Authorization: Bearer $USER1_TOKEN" | jq .
echo -e ""

echo -e "${GREEN}=== Test Complete ===${NC}"
echo -e "\n${BLUE}Summary:${NC}"
echo "User 1 ID: $USER1_ID"
echo "Tipster ID: $TIPSTER_ID"
echo "Admin ID: $ADMIN_ID"
echo "Tip ID: $TIP_ID"
