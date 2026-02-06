@echo off
echo ========================================
echo  Professional Identity App - Mobile Setup
echo ========================================
echo.
echo आपका Server पहले से चल रहा है!
echo Your Server is already running!
echo.
echo ========================================
echo  STEP 1: अपने Phone में यह URL खोलें
echo ========================================
echo.
echo    http://192.168.63.236:8000
echo.
echo ========================================
echo  STEP 2: Install करें
echo ========================================
echo.
echo Android:
echo   1. Chrome में खोलें
echo   2. Menu (⋮) → "Add to Home Screen"
echo   3. "Install" दबाएं
echo.
echo iPhone:
echo   1. Safari में खोलें
echo   2. Share (📤) → "Add to Home Screen"
echo   3. "Add" दबाएं
echo.
echo ========================================
echo  APK बनाने के लिए:
echo ========================================
echo.
echo Option 1 - PWA Builder (Recommended):
echo   npm install -g @bubblewrap/cli
echo   bubblewrap init --manifest=./manifest.json
echo   bubblewrap build
echo.
echo Option 2 - Capacitor:
echo   npm install -g @capacitor/cli
echo   npx cap init
echo   npx cap add android
echo   npx cap open android
echo.
echo For detailed guide, see: MOBILE-SETUP-GUIDE.md
echo ========================================
echo.
pause
