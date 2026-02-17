# Script de Limpeza e Reinício Profundo
Write-Host "Matando processos Node/Electron..." -ForegroundColor Yellow
Stop-Process -Name "electron" -ErrorAction SilentlyContinue
Stop-Process -Name "node" -ErrorAction SilentlyContinue

Write-Host "Limpando Cache do Vite..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue
}

Write-Host "Configurando PATH..." -ForegroundColor Yellow
# Garante que usa o nodejs da pasta irma (nivel acima)
$NodeDir = Resolve-Path (Join-Path $PSScriptRoot "..\nodejs")
$env:PATH = "$NodeDir;$env:PATH"

Write-Host "Caminho Node configurado: $NodeDir"

# Verifica se encontrou
try {
    $nodeLoc = Get-Command node -ErrorAction Stop
    Write-Host "Node encontrado em: $($nodeLoc.Source)"
}
catch {
    Write-Host "ERRO: Node nao encontrado no PATH!" -ForegroundColor Red
    Write-Host "O PATH atual e: $env:PATH"
    Pause
    exit
}

Write-Host "Iniciando App..." -ForegroundColor Green
npm run dev
