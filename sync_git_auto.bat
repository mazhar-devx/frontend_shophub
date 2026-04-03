@echo off
echo Initializing Git repository...
git init

echo Adding remote origin...
git remote add origin https://github.com/mazhar-devx/frontend_shophub
git remote set-url origin https://github.com/mazhar-devx/frontend_shophub

echo Fetching history from GitHub...
git fetch origin
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Could not fetch from GitHub.
    exit /b 1
)

echo Resetting local repository to match remote history (keeping your changes)...
git reset --soft origin/main

echo Staging all local files...
git add .

echo Committing changes...
git commit -m "Fix: Auth 401 loop, AdminLayout race condition, Prod URL"

echo Pushing to remote...
git push origin main
