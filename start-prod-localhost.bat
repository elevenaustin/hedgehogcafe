@echo off
title The Hedgehog Cafe (Production Localhost)
echo ====================================================
echo   Building and Starting The Hedgehog Cafe (Prod)
echo ====================================================
echo.

if not exist node_modules (
    echo Installing dependencies first...
    call npm install
)

if not exist dist (
    echo Building production bundle...
    call npm run build
)

echo.
echo Launching Production Server...
echo Website:     http://localhost:3000
echo Admin Panel: http://localhost:3000/admin55555
echo.

set OPEN_BROWSER=true
call npm run serve
pause
