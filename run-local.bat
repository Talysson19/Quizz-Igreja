@echo off
echo ===================================================
echo   Iniciando Servidores do Quizizz Igreja Localmente
echo ===================================================
echo.
echo [1/2] Iniciando o Backend (Laravel)...
start "Backend - Laravel" cmd /k "cd quizizz-igreja && php artisan serve"
echo.
echo [2/2] Iniciando o Frontend (React/Vite)...
start "Frontend - Vite" cmd /k "cd quiz-front && npm run dev"
echo.
echo ===================================================
echo  Pronto! Os servidores estao iniciando em background.
echo  - Backend: http://127.0.0.1:8000
echo  - Frontend: http://localhost:5173 (ou veja no console)
echo ===================================================
pause
