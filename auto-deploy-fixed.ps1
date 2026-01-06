Write-Host "Auto-Deploy Watcher Started" -ForegroundColor Red
Write-Host "Changes will be deployed to PRODUCTION!" -ForegroundColor Yellow
Write-Host "Watching: resources/js/pages/" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray

$lastChange = Get-Date

while ($true) {
    # Check for changes in pages directory
    $pageFiles = Get-ChildItem -Path "resources\js\pages\" -Recurse -File -Filter "*.tsx" | Where-Object { $_.LastWriteTime -gt $lastChange }
    
    if ($pageFiles) {
        Write-Host ""
        Write-Host "Page changes detected:" -ForegroundColor Red
        
        foreach ($file in $pageFiles) {
            Write-Host "  - $($file.Name)" -ForegroundColor Yellow
        }
        
        Write-Host "Auto-deploying to production..." -ForegroundColor Red
        & npm run deploy:quick
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Deploy successful!" -ForegroundColor Green
            Write-Host "Live at: https://imamhafsh.com" -ForegroundColor Cyan
        } else {
            Write-Host "Deploy failed!" -ForegroundColor Red
        }
        
        $lastChange = Get-Date
        Write-Host "Watching for more changes..." -ForegroundColor Cyan
    }
    
    Start-Sleep -Seconds 3
}