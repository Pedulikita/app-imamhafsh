#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Deploy to production server via SSH
.DESCRIPTION
  Pulls latest changes from GitHub and clears caches on production
.EXAMPLE
  .\deploy-to-production.ps1
#>

param(
    [string]$Branch = "main",
    [switch]$DryRun,
    [switch]$Force
)

$SSHHost = "77.37.81.252"
$SSHPort = "65002"
$SSHUser = "u817493080"
$RemotePath = "/domains/imamhafsh.com/public_html"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         PRODUCTION DEPLOYMENT via SSH                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Server: $SSHHost:$SSHPort" -ForegroundColor Yellow
Write-Host "User: $SSHUser" -ForegroundColor Yellow
Write-Host "Remote Path: $RemotePath" -ForegroundColor Yellow
Write-Host "Branch: $Branch`n" -ForegroundColor Yellow

if (-not $Force) {
    $response = Read-Host "Continue with deployment? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "Deployment cancelled." -ForegroundColor Yellow
        exit 0
    }
}

$SSHCommand = @"
cd $RemotePath

echo '📦 Step 1: Fetching latest changes from GitHub...'
git fetch origin $Branch
if [ `$? -ne 0 ]; then echo 'Git fetch failed!'; exit 1; fi

echo '📦 Step 2: Resetting to remote version...'
git reset --hard origin/$Branch
if [ `$? -ne 0 ]; then echo 'Git reset failed!'; exit 1; fi

echo '🧹 Step 3: Clearing Laravel cache...'
php artisan cache:clear
php artisan view:clear
php artisan config:cache

echo '✅ Step 4: Verifying deployment...'
echo "Current commit:"
git log --oneline -1
echo ""
echo "Git status:"
git status --short

echo ""
echo "✓ Deployment complete!"
"@

Write-Host "Executing deployment commands on server...`n" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "DRY RUN - Commands that would be executed:" -ForegroundColor Yellow
    Write-Host $SSHCommand
    exit 0
}

# Execute SSH command
ssh -p $SSHPort "${SSHUser}@${SSHHost}" $SSHCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Deployment successful!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Test article page: https://imamhafsh.com/articles/tes" -ForegroundColor Gray
    Write-Host "2. Verify meta tags using Facebook Debugger" -ForegroundColor Gray
    Write-Host "3. Test WhatsApp share preview" -ForegroundColor Gray
} else {
    Write-Host "`n✗ Deployment failed!" -ForegroundColor Red
    exit 1
}
