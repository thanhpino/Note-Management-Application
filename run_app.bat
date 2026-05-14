@echo off
title Start Note Management App
echo ---------------------------------------------------
echo STARTING ALL SERVICES...
echo ---------------------------------------------------

:: 1. Start Frontend (Vite)
start cmd /k "echo Starting Frontend... && cd frontend && npm run dev"

:: 2. Start Backend API
start cmd /k "echo Starting Backend API... && cd backend-php && php artisan serve"

:: 3. Start Websocket (Reverb)
start cmd /k "echo Starting Reverb... && cd backend-php && php artisan reverb:start"

:: 4. Start Queue Worker
start cmd /k "echo Starting Queue Worker... && cd backend-php && php artisan queue:work"

echo ---------------------------------------------------
echo ALL SERVICES ARE STARTING IN SEPARATE WINDOWS!
echo ---------------------------------------------------
pause
