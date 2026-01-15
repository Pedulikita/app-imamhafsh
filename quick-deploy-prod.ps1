# Quick Deploy to Production

$SSHHost = "77.37.81.252"
$SSHPort = 65002
$SSHUser = "u817493080"

Write-Host "Starting deployment to production..." -ForegroundColor Cyan

# Execute SSH command (without npm, just pull and cache)
$RemoteCommands = 'cd ~/domains/imamhafsh.com/laravel_app && git pull origin master && composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan optimize'

ssh -p $SSHPort "$SSHUser@$SSHHost" $RemoteCommands

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment successful!" -ForegroundColor Green
} else {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}
