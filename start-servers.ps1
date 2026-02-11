#!/usr/bin/env powershell

Write-Host "=" * 60
Write-Host "  🚀 INICIANDO SERVIDOR DE DESENVOLVIMENTO" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Terminal 1: Backend
Write-Host "1️⃣  Iniciando Backend (porta 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
  "cd 'c:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\backend'; `
   Write-Host '🔧 Backend iniciando...' -ForegroundColor Green; `
   npm start"

Start-Sleep -Seconds 3

# Terminal 2: Frontend  
Write-Host "2️⃣  Iniciando Frontend (porta 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
  "cd 'c:\Users\a92207984\Desktop\Projeto feito com Valnei e Wesley\app-Desigualdade-02\frontend'; `
   Write-Host '⚛️  Frontend iniciando...' -ForegroundColor Green; `
   npm run dev"

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "=" * 60
Write-Host "  ✅ SERVIDORES INICIADOS!" -ForegroundColor Green
Write-Host "=" * 60
Write-Host ""
Write-Host "🌐 Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend:   http://localhost:4000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Abra o navegador e acesse a aplicação!" -ForegroundColor Green
Write-Host ""
