#!/bin/bash

# Script to run all tests for the project

echo "=================================="
echo "Running All Tests"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED=0

# Server Tests
echo -e "\n${YELLOW}[1/3] Running Server Tests...${NC}"
cd server_app
if npm test -- --runInBand --coverage; then
    echo -e "${GREEN}✓ Server tests passed${NC}"
else
    echo -e "${RED}✗ Server tests failed${NC}"
    FAILED=$((FAILED + 1))
fi
cd ..

# Client Tests
echo -e "\n${YELLOW}[2/3] Running Client Tests...${NC}"
cd client_app
if CI=true npm test -- --coverage --watchAll=false; then
    echo -e "${GREEN}✓ Client tests passed${NC}"
else
    echo -e "${RED}✗ Client tests failed${NC}"
    FAILED=$((FAILED + 1))
fi
cd ..

# Admin Tests
echo -e "\n${YELLOW}[3/3] Running Admin Tests...${NC}"
cd admin_app
if CI=true npm test -- --coverage --watchAll=false; then
    echo -e "${GREEN}✓ Admin tests passed${NC}"
else
    echo -e "${RED}✗ Admin tests failed${NC}"
    FAILED=$((FAILED + 1))
fi
cd ..

# Summary
echo -e "\n=================================="
echo "Test Summary"
echo "=================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}$FAILED test suite(s) failed ✗${NC}"
    exit 1
fi
