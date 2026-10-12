@echo off
title Push The Hedgehog Cafe to GitHub
echo ====================================================
echo   Pushing to GitHub (https://github.com/elevenaustin/hedgehogcafe)
echo ====================================================
echo.
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================
    echo   [SUCCESS] All changes successfully pushed to GitHub!
    echo ====================================================
) else (
    echo ====================================================
    echo   [ERROR] Push failed. 
    echo   If prompted, please sign in with your GitHub account.
    echo ====================================================
)
echo.
pause
