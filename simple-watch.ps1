Write-Host "👀 Auto-Build Watcher Started" -ForegroundColor Green
Write-Host "Watching: resources/js/ and resources/css/" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray

$lastChange = Get-Date

while ($true) {
    # Check for changes in resources/js
    $jsFiles = Get-ChildItem -Path "resources\js\" -Recurse -File | Where-Object { $_.LastWriteTime -gt $lastChange }
    
    # Check for changes in resources/css  
    $cssFiles = Get-ChildItem -Path "resources\css\" -Recurse -File | Where-Object { $_.LastWriteTime -gt $lastChange }
    
    if ($jsFiles -or $cssFiles) {
        $changedFiles = @($jsFiles) + @($cssFiles)
        Write-Host "`n🔄 Changes detected:" -ForegroundColor Yellow
        
        foreach ($file in $changedFiles) {
            Write-Host "  - $($file.Name)" -ForegroundColor Gray
        }
        
        Write-Host "📦 Building..." -ForegroundColor Cyan
        & npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
        } else {
            Write-Host "❌ Build failed!" -ForegroundColor Red
        }
        
        $lastChange = Get-Date
        Write-Host "👀 Watching for more changes...`n" -ForegroundColor Cyan
    }
    
    Start-Sleep -Seconds 2
}