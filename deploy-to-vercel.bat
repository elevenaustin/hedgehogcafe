@echo off
title Deploy The Hedgehog Cafe to Vercel
echo ====================================================
echo   Deploying The Hedgehog Cafe to Vercel (Live)
echo ====================================================
echo.
echo 1. Building production bundle...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Please check errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo 2. Pushing changes to Vercel Production...
call npx vercel --prod
echo.
pause
