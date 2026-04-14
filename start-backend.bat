@echo off
setlocal EnableDelayedExpansion
title Chatbot Medico - Backend

echo =============================================
echo   Chatbot Medico - Iniciando Backend
echo =============================================
echo.

cd /d "%~dp0backend"

REM --- Verificar si existe el archivo .env ---
if not exist ".env" (
    echo [!] Archivo .env no encontrado.
    echo.
    set /p OPENAI_KEY="Ingresa tu OpenAI API Key: "

    if "!OPENAI_KEY!"=="" (
        echo [ERROR] La API Key no puede estar vacia.
        pause
        exit /b 1
    )

    (
        echo PORT=3001
        echo OPENAI_API_KEY=!OPENAI_KEY!
        echo JWT_SECRET=app_jwt_secret_2025
        echo FRONTEND_URL=http://localhost:5173
    ) > .env

    echo.
    echo [OK] Archivo .env creado correctamente.
) else (
    echo [OK] Archivo .env encontrado.

    findstr /i "OPENAI_API_KEY=sk-" .env >nul 2>&1
    if errorlevel 1 (
        echo [!] La API Key de OpenAI no esta configurada en .env
        echo.
        set /p OPENAI_KEY="Ingresa tu OpenAI API Key: "

        if "!OPENAI_KEY!"=="" (
            echo [ERROR] La API Key no puede estar vacia.
            pause
            exit /b 1
        )

        powershell -NoProfile -Command "$c = Get-Content '.env'; if ($c -match 'OPENAI_API_KEY=') { $c = $c -replace 'OPENAI_API_KEY=.*', ('OPENAI_API_KEY=' + '!OPENAI_KEY!') } else { $c += ('OPENAI_API_KEY=' + '!OPENAI_KEY!') }; $c | Set-Content '.env'"
        echo [OK] API Key actualizada en .env
    )
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
echo [*] Iniciando servidor backend en puerto 3001...
echo.
call npm start

pause
