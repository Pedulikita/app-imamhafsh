# Git Post-Commit Hook - Auto-deploy after commit
# Usage: Copy content to .git/hooks/post-commit (remove .ps1 extension)

Write-Host "🚀 Git Post-Commit: Auto-deploying to production..." -ForegroundColor Green

# Check if commit includes frontend files
$changedFiles = git diff-tree --no-commit-id --name-only -r HEAD

$frontendFiles = $changedFiles | Where-Object { 
    $_ -match "resources/js/" -or 
    $_ -match "resources/css/" -or 
    $_ -match "resources/views/" 
}

if ($frontendFiles) {
    Write-Host "Frontend changes detected:" -ForegroundColor Yellow
    foreach ($file in $frontendFiles) {
        Write-Host "  - $file" -ForegroundColor Gray
    }
    
    Write-Host "📦 Building and deploying..." -ForegroundColor Cyan
    
    try {
        & npm run deploy:quick
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Auto-deploy after commit successful!" -ForegroundColor Green
        } else {
            Write-Host "❌ Auto-deploy failed!" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Deploy error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "No frontend changes detected, skipping deploy." -ForegroundColor Gray
}