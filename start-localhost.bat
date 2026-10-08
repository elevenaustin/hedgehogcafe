@echo off
title The Hedgehog Cafe (Localhost Dev Server)
echo ====================================================
echo   Starting The Hedgehog Cafe (Localhost)
echo ====================================================
echo.

if not exist node_modules (
    echo Installing dependencies first...
    call npm install
)

echo.
echo Starting Vite server and launching browser...
echo.
echo Website:     http://localhost:3000
echo Admin Panel: http://localhost:3000/admin55555
echo.

call npm run dev -- --open
pause
