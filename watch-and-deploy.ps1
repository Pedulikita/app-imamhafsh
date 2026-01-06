# Auto-deployment watcher untuk Laravel React app
param([switch]$Help)

if ($Help) {
    Write-Host "Auto-deployment script for Laravel + React app" -ForegroundColor Green
    Write-Host "Usage: .\watch-and-deploy.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Monitors changes in resources/ folder and auto-deploys to production"
    Write-Host "Press Ctrl+C to stop watching"
    exit
}

Write-Host "Starting Auto-Deploy Watcher..." -ForegroundColor Cyan
Write-Host "Watching for changes in resources/ folder" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Red

$lastWriteTime = @{}
$watchedExtensions = @("*.tsx", "*.ts", "*.js", "*.jsx", "*.css", "*.scss")

function Get-WatchedFiles {
    $files = @()
    foreach ($ext in $watchedExtensions) {
        $found = Get-ChildItem -Path "resources" -Filter $ext -Recurse -ErrorAction SilentlyContinue
        $files += $found
    }
    return $files
}

function Deploy-Changes {
    Write-Host ""
    Write-Host "Changes detected! Starting deployment..." -ForegroundColor Green
    
    # Build assets
    Write-Host "Building assets..." -ForegroundColor Blue
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build successful!" -ForegroundColor Green
        
        # Deploy to production
        Write-Host "Deploying to production..." -ForegroundColor Blue
        npm run deploy:quick
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Deployment successful! Changes are now live!" -ForegroundColor Green
        } else {
            Write-Host "Deployment failed!" -ForegroundColor Red
        }
    } else {
        Write-Host "Build failed! Skipping deployment." -ForegroundColor Red
    }
    
    Write-Host "Watching for more changes..." -ForegroundColor Cyan
}

# Initial file scan
$files = Get-WatchedFiles
foreach ($file in $files) {
    $lastWriteTime[$file.FullName] = $file.LastWriteTime
}

Write-Host "Monitoring $($files.Count) files" -ForegroundColor Yellow

# Main watch loop
while ($true) {
    Start-Sleep -Seconds 2
    
    $currentFiles = Get-WatchedFiles
    $hasChanges = $false
    
    foreach ($file in $currentFiles) {
        if (-not $lastWriteTime.ContainsKey($file.FullName) -or $lastWriteTime[$file.FullName] -lt $file.LastWriteTime) {
            $hasChanges = $true
            $lastWriteTime[$file.FullName] = $file.LastWriteTime
            Write-Host "Changed: $($file.Name)" -ForegroundColor Yellow
        }
    }
    
    if ($hasChanges) {
        Start-Sleep -Seconds 1  # Debounce multiple file changes
        Deploy-Changes
    }
}