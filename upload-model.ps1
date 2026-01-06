# Upload PHP Model Script
# Usage: .\upload-model.ps1

Write-Host "📁 Uploading PHP Model Files..." -ForegroundColor Cyan

# Upload HomeSection.php model
scp -P 65002 app/Models/HomeSection.php u817493080@77.37.81.252:~/domains/imamhafsh.com/laravel_app/app/Models/

# Copy to public_html location  
ssh -p 65002 u817493080@77.37.81.252 "cd ~/domains/imamhafsh.com; cp laravel_app/app/Models/HomeSection.php public_html/app/Models/; cd laravel_app; php artisan cache:clear"

Write-Host "✅ Model upload complete!" -ForegroundColor Green