@echo off
setlocal enabledelayedexpansion

echo.
echo ============================================================
echo   INICIANDO SERVIDORES DE DESENVOLVIMENTO
echo ============================================================
echo.

echo [1] Iniciando Backend na porta 4000...
echo.
start cmd /k "cd /d "c:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\backend" && npm start"

timeout /t 3 /nobreak

echo [2] Iniciando Frontend na porta 5173...
echo.
start cmd /k "cd /d "c:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\frontend" && npm run dev"

echo.
echo ============================================================
echo   SERVIDORES INICIADOS!
echo ============================================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000
echo.
echo Abra o navegador e acesse!
echo.

pause
