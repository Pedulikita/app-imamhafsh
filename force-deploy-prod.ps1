# Force Deploy to Production - Stash local changes and pull

$SSHHost = "77.37.81.252"
$SSHPort = 65002
$SSHUser = "u817493080"

Write-Host "Starting FORCE deployment to production..." -ForegroundColor Cyan
Write-Host "This will stash any local changes on the server" -ForegroundColor Yellow

# Remote commands to force update - Unix style
$RemoteCommands = "cd domains/imamhafsh.com/laravel_app && git fetch origin && git reset --hard origin/master && git clean -fd && composer install --no-dev --optimize-autoloader && php artisan config:clear && php artisan cache:clear && php artisan route:clear && php artisan view:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan optimize && echo 'Deployment complete!' && date"

# Execute via SSH
ssh -p $SSHPort "$SSHUser@$SSHHost" $RemoteCommands

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host "Website: https://imamhafsh.com" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}
