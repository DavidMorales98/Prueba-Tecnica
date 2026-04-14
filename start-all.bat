@echo off
setlocal EnableDelayedExpansion
title Chatbot Medico - Iniciador

echo.
echo =============================================
echo   Chatbot Medico - Chatbot de Agendamiento Medico
echo =============================================
echo.

cd /d "%~dp0backend"

REM === Verificar/configurar .env del backend ===
if not exist ".env" (
    echo [!] Archivo .env no encontrado en el backend.
    echo.
    set /p OPENAI_KEY="  Ingresa tu OpenAI API Key: "

    if "!OPENAI_KEY!"=="" (
        echo.
        echo [ERROR] La API Key de OpenAI es obligatoria.
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
    echo [OK] Archivo .env creado.
) else (
    echo [OK] Archivo .env encontrado.

    REM Verificar si la API Key esta vacia o es placeholder
    findstr /i "OPENAI_API_KEY=sk-" .env >nul 2>&1
    if errorlevel 1 (
        echo [!] La API Key de OpenAI no esta configurada.
        echo.
        set /p OPENAI_KEY="  Ingresa tu OpenAI API Key: "

        if "!OPENAI_KEY!"=="" (
            echo [ERROR] La API Key no puede estar vacia.
            pause
            exit /b 1
        )

        powershell -NoProfile -Command "$c = Get-Content '.env'; if ($c -match 'OPENAI_API_KEY=') { $c = $c -replace 'OPENAI_API_KEY=.*', ('OPENAI_API_KEY=' + '!OPENAI_KEY!') } else { $c += ('OPENAI_API_KEY=' + '!OPENAI_KEY!') }; $c | Set-Content '.env'"
        echo [OK] API Key configurada correctamente.
    )
)

echo.
echo [*] Instalando dependencias del backend...
call npm install --silent
if errorlevel 1 (
    echo [ERROR] Fallo al instalar dependencias del backend.
    pause
    exit /b 1
)
echo [OK] Backend listo.

echo.
echo [*] Instalando dependencias del frontend...
cd /d "%~dp0frontend"

if not exist ".env" (
    echo VITE_BACKEND_URL=http://localhost:3001 > .env
    echo [OK] .env del frontend creado.
)

call npm install --silent
if errorlevel 1 (
    echo [ERROR] Fallo al instalar dependencias del frontend.
    pause
    exit /b 1
)
echo [OK] Frontend listo.

echo.
echo =============================================
echo   Iniciando servidores...
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:5173
echo =============================================
echo.

start "Chatbot Medico - Backend" cmd /k "cd /d "%~dp0backend" && npm start"

timeout /t 3 /nobreak >nul

start "Chatbot Medico - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 4 /nobreak >nul
start "" "http://localhost:5173"

echo [OK] Aplicacion iniciada. Abriendo navegador...
echo.
echo Presiona cualquier tecla para cerrar esta ventana.
echo Los servidores seguiran corriendo en sus propias ventanas.
echo.
pause >nul
