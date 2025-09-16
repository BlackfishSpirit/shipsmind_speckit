#!/bin/bash

echo ""
echo "================================================"
echo "   ShipsMind Project - Quick Start Setup"
echo "================================================"
echo ""
echo "This script will:"
echo "1. Install dependencies"
echo "2. Start development server"
echo "3. Open the interactive workflow checklist"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "[1/4] Installing dependencies..."
pnpm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "[2/4] Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "Environment file created - please configure your API keys"
else
    echo "Environment file already exists"
fi

echo ""
echo "[3/4] Starting development server..."
echo "NOTE: Keep this terminal open - the server must run continuously"
echo ""

# Start development server in background
pnpm dev &
DEV_PID=$!

echo ""
echo "[4/4] Waiting for server to start..."
sleep 5

echo ""
echo "Opening interactive workflow checklist..."
echo ""

# Try to open browser (different commands for different systems)
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:3000/dev/workflow"
elif command -v open > /dev/null; then
    open "http://localhost:3000/dev/workflow"
elif command -v start > /dev/null; then
    start "http://localhost:3000/dev/workflow"
else
    echo "Please manually open: http://localhost:3000/dev/workflow"
fi

echo ""
echo "================================================"
echo "   Setup Complete!"
echo "================================================"
echo ""
echo "Your workflow checklist is now open in your browser."
echo "Follow the step-by-step instructions to complete setup."
echo ""
echo "IMPORTANT:"
echo "- Keep this terminal open (development server running)"
echo "- Bookmark: http://localhost:3000/dev/workflow"
echo "- See TEAM_SETUP.md for detailed documentation"
echo ""
echo "Development server PID: $DEV_PID"
echo "To stop the server later: kill $DEV_PID"
echo ""

# Wait for the development server
wait $DEV_PID