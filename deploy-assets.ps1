# Deploy Assets to Production Script (PowerShell)
# Usage: .\deploy-assets.ps1
# Automatically builds and deploys assets to production

Write-Host "🚀 Starting automatic deployment process..." -ForegroundColor Yellow

# Build assets locally
Write-Host "📦 Building assets locally..." -ForegroundColor Yellow
& npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Upload assets to production
Write-Host "☁️  Uploading assets to production..." -ForegroundColor Yellow

# Clean and upload in one step - Remove old assets and copy new ones
Write-Host "🧹 Cleaning old assets and uploading new ones..." -ForegroundColor Gray
& ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com/public_html/build; rm -rf assets/* manifest.json"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Old assets cleaned" -ForegroundColor Green
} else {
    Write-Host "⚠️ Warning: Could not clean old assets, continuing..." -ForegroundColor Yellow
}

# Copy new assets to laravel_app (backup location)
Write-Host "📤 Uploading to laravel_app..." -ForegroundColor Gray  
& scp -P 65002 -r public/build/* u817493080@77.37.81.252:~/domains/imamhafsh.com/laravel_app/public/build/

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Assets uploaded to laravel_app" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to upload to laravel_app" -ForegroundColor Red
    exit 1
}

# Copy new assets to public_html (serving location)
Write-Host "🔄 Copying to public_html (serving location)..." -ForegroundColor Gray
& ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com; cp -r laravel_app/public/build/* public_html/build/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Assets copied to public_html" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to copy to public_html" -ForegroundColor Red
    exit 1
}

# Clear Laravel cache
Write-Host "🧽 Clearing Laravel cache..." -ForegroundColor Yellow
& ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com/laravel_app; php artisan cache:clear; php artisan config:clear; php artisan view:clear"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Cache cleared successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️ Warning: Cache clear had issues, but continuing..." -ForegroundColor Yellow
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green

# Test critical assets
Write-Host "🧪 Testing critical assets..." -ForegroundColor Yellow

$testFiles = @(
    "app-FifeAbI1.css",
    "app-ClFu6NNW.js", 
    "home-CVcq6t2O.js",
    "pendaftaran-B1Utg22G.js"
)

$allGood = $true

foreach ($file in $testFiles) {
    try {
        $response = Invoke-WebRequest -Uri "https://imamhafsh.com/build/assets/$file" -Method Head -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $file OK" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $file Status: $($response.StatusCode)" -ForegroundColor Yellow
            $allGood = $false
        }
    } catch {
        Write-Host "❌ $file Failed" -ForegroundColor Red
        $allGood = $false
    }
}

if ($allGood) {
    Write-Host "🎉 All assets are working perfectly!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some assets may have issues, please check manually" -ForegroundColor Yellow
}

Write-Host "🌐 Website ready at https://imamhafsh.com" -ForegroundColor Cyan
Write-Host "📄 Pendaftaran page: https://imamhafsh.com/pendaftaran" -ForegroundColor Cyan

Write-Host "`n🚀 Deployment Complete! You can now test button functionality." -ForegroundColor Green