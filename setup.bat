@echo off
REM Quick setup script for AI Character Creator (Windows)

echo.
echo ==================================================
echo  AI Character Creator - Setup Script (Windows)
echo ==================================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo + Node.js detected: 
node --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo - .env.local not found
    echo.
    echo Next steps:
    echo 1. Go to https://huggingface.co/settings/tokens
    echo 2. Create a new token with 'read' access
    echo 3. Copy the token and open .env.local file
    echo 4. Replace YOUR_HUGGING_FACE_API_KEY_HERE with your token
    echo.
) else (
    echo + .env.local found
)

echo.
echo To start development server:
echo     npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause
