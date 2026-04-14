@echo off
setlocal EnableDelayedExpansion
title Chatbot Medico - Frontend

echo =============================================
echo   Chatbot Medico - Iniciando Frontend
echo =============================================
echo.

cd /d "%~dp0frontend"

if not exist ".env" (
    echo [*] Creando .env del frontend...
    echo VITE_BACKEND_URL=http://localhost:3001 > .env
    echo [OK] .env del frontend creado.
) else (
    echo [OK] .env del frontend encontrado.
)

echo.
echo [*] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo [ERROR] Fallo al instalar dependencias.
    pause
    exit /b 1
)

echo.
echo [*] Iniciando servidor frontend en http://localhost:5173
echo.
call npm run dev

pause
