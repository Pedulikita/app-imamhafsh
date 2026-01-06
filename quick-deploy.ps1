# Quick Deploy Script - Build & Deploy in One Command
# Usage: .\quick-deploy.ps1

Write-Host "⚡ Quick Deploy - Build & Upload Assets" -ForegroundColor Cyan

# Build
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Build failed" -ForegroundColor Red; exit 1 }

# Clean & Upload in one go
Write-Host "🔄 Deploying..." -ForegroundColor Yellow
ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com/public_html/build; rm -rf assets/* manifest.json"
scp -P 65002 -r public/build/* u817493080@77.37.81.252:~/domains/imamhafsh.com/laravel_app/public/build/
ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com; cp -r laravel_app/public/build/* public_html/build/; cd laravel_app; php artisan cache:clear"

Write-Host "✅ Quick deploy complete! Test at https://imamhafsh.com" -ForegroundColor Green