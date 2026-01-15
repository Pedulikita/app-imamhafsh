# Auto Deploy Watcher - Monitors changes and auto-deploys
# Usage: .\watch-deploy.ps1

Write-Host "👀 Starting Auto-Deploy Watcher..." -ForegroundColor Cyan
Write-Host "Watching: resources/js/pages/" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

$watchPath = "resources\js\pages\"
$filter = "*.tsx"
$lastDeployTime = Get-Date

# Create FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.Filter = $filter
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Debounce function - prevent multiple deploys for rapid changes
$debounceSeconds = 3

# Define the action to take when a file changes
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    $fileName = Split-Path $path -Leaf
    
    # Skip if change happened too recently
    $now = Get-Date
    if (($now - $script:lastDeployTime).TotalSeconds -lt $script:debounceSeconds) {
        return
    }
    
    Write-Host "🔄 $changeType detected: $fileName" -ForegroundColor Yellow
    Write-Host "⏰ $(Get-Date -Format 'HH:mm:ss') - Starting auto-deploy..." -ForegroundColor Green
    
    # Run quick deploy
    try {
        & npm run deploy:quick
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Auto-deploy completed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Auto-deploy failed!" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Auto-deploy error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    $script:lastDeployTime = Get-Date
    Write-Host "👀 Watching for changes..." -ForegroundColor Cyan
    Write-Host ""
}

# Register event handlers
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action

Write-Host "✅ Auto-deploy watcher started!" -ForegroundColor Green
Write-Host "Edit any .tsx file in resources/js/pages/ to trigger auto-deploy" -ForegroundColor Cyan

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Cleanup
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`n🛑 Auto-deploy watcher stopped." -ForegroundColor Yellow
}