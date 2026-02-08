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
    echo If this is a private repository, you may need to sign in.
    echo.
    pause
    exit /b 1
)

echo Resetting local repository to match remote history (keeping your changes)...
git reset --soft origin/main

echo Staging all local files...
git add .

echo Committing changes...
git commit -m "Fix: Prod API URL + Remove SW no-op listener + build error"

echo.
echo ==========================================
echo SUCCEEDED! Your local changes are committed.
echo.
echo Now, please run this command to push them to Render:
echo    git push origin main
echo.
echo (You may be asked for your GitHub credentials)
echo ==========================================
pause
