@echo off
echo.
echo ================================================
echo   ShipsMind Project - Quick Start Setup
echo ================================================
echo.
echo This script will:
echo 1. Install dependencies
echo 2. Start development server
echo 3. Open the interactive workflow checklist
echo.
pause

echo.
echo [1/4] Installing dependencies...
call pnpm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Copying environment template...
if not exist .env.local (
    copy .env.example .env.local >nul 2>&1
    echo Environment file created - please configure your API keys
) else (
    echo Environment file already exists
)

echo.
echo [3/4] Starting development server...
echo NOTE: Keep this window open - the server must run continuously
echo.
start "ShipsMind Dev Server" cmd /k "pnpm dev"

echo.
echo [4/4] Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo Opening interactive workflow checklist...
echo.
start "" "http://localhost:3000/dev/workflow"

echo.
echo ================================================
echo   Setup Complete!
echo ================================================
echo.
echo Your workflow checklist is now open in your browser.
echo Follow the step-by-step instructions to complete setup.
echo.
echo IMPORTANT:
echo - Keep the development server window open
echo - Bookmark: http://localhost:3000/dev/workflow
echo - See TEAM_SETUP.md for detailed documentation
echo.
pause