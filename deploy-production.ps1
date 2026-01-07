# Deploy ke Production via SSH
# Script untuk push perubahan ke server hosting

param(
    [string]$Operation = "deploy",
    [switch]$DryRun,
    [switch]$Verbose
)

# Konfigurasi SSH
$SSHHost = "77.37.81.252"
$SSHPort = 65002
$SSHUser = "u817493080"
$RemotePath = "~/public_html"

# Warna output
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Red = [System.ConsoleColor]::Red
$Cyan = [System.ConsoleColor]::Cyan

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Cyan
Write-Host "║       DEPLOYMENT KE PRODUCTION via SSH                   ║" -ForegroundColor $Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Cyan
Write-Host ""

# 1. Build Frontend Assets
Write-Host "📦 Step 1: Building Frontend Assets..." -ForegroundColor $Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor $Red
    exit 1
}
Write-Host "✓ Build berhasil" -ForegroundColor $Green
Write-Host ""

# 2. Git Commit & Push
Write-Host "📝 Step 2: Git Commit & Push..." -ForegroundColor $Yellow
$changes = git status --porcelain
if ($changes) {
    Write-Host "Changes found:" -ForegroundColor $Cyan
    Write-Host $changes
    
    $commitMsg = Read-Host "Masukkan commit message"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Deploy: Update frontend assets $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    git add .
    git commit -m $commitMsg
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Git push berhasil" -ForegroundColor $Green
    } else {
        Write-Host "⚠ Git push ada issues, lanjut ke deployment..." -ForegroundColor $Yellow
    }
} else {
    Write-Host "⚠ Tidak ada perubahan di Git" -ForegroundColor $Yellow
}
Write-Host ""

# 3. Deploy via SSH
Write-Host "🚀 Step 3: Deploy ke Server ($SSHHost)..." -ForegroundColor $Yellow
Write-Host "User: $SSHUser | Port: $SSHPort | Path: $RemotePath" -ForegroundColor $Cyan
Write-Host ""

# SSH Deploy Commands
$DeployCommands = @"
# Navigate to project directory
cd $RemotePath

# Pull latest changes dari GitHub
echo 'Pulling latest changes...'
git pull origin main

# Install/Update dependencies
echo 'Installing dependencies...'
composer install --no-dev --optimize-autoloader
npm install
npm run build

# Laravel preparation
echo 'Preparing Laravel...'
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# Optimize
php artisan optimize

# Permissions
chmod -R 755 storage bootstrap/cache
chmod -R 755 public/storage

echo 'Deployment complete!'
date
"@

# Execute SSH command
if ($DryRun) {
    Write-Host "DRY RUN MODE - Commands that will be executed:" -ForegroundColor $Yellow
    Write-Host $DeployCommands
} else {
    Write-Host "Executing deployment commands..." -ForegroundColor $Cyan
    
    # Check SSH connectivity first
    Write-Host "🔌 Checking SSH connection..." -ForegroundColor $Yellow
    ssh -p $SSHPort -o ConnectTimeout=5 "$SSHUser@$SSHHost" "echo 'SSH Connection OK'"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Cannot connect to server via SSH!" -ForegroundColor $Red
        Write-Host "Please check:" -ForegroundColor $Yellow
        Write-Host "  - SSH port: $SSHPort"
        Write-Host "  - SSH host: $SSHHost"
        Write-Host "  - SSH user: $SSHUser"
        exit 1
    }
    
    Write-Host "✓ SSH connection successful" -ForegroundColor $Green
    Write-Host ""
    
    # Execute deployment
    $DeployCommands | ssh -p $SSHPort "$SSHUser@$SSHHost"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
        Write-Host "║       SUCCESS - Deployment Complete!                      ║" -ForegroundColor $Green
        Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Green
        Write-Host ""
        Write-Host "Website: https://imamhafsh.com" -ForegroundColor $Cyan
    } else {
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Red
        Write-Host "║       ERROR - Deployment Failed                          ║" -ForegroundColor $Red
        Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Red
        exit 1
    }
}

Write-Host ""
Write-Host "Deployment selesai pada $(Get-Date)" -ForegroundColor $Cyan
