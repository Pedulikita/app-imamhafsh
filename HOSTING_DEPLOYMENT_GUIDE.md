# 🚀 PANDUAN DEPLOY LARAVEL KE HOSTING

## 📋 Informasi Hosting
- **Server**: 77.37.81.252
- **Port SSH**: 65002  
- **User**: u817493080
- **Status**: SSH connection ready

## 🔧 LANGKAH-LANGKAH DEPLOYMENT

### 1. **Koneksi SSH ke Hosting**
```bash
ssh -p 65002 u817493080@77.37.81.252
```

### 2. **Clone Repository dari GitHub**
Setelah masuk SSH, clone project dari GitHub:
```bash
cd ~/public_html
git clone https://github.com/Pedulikita/app-imamhafsh.git .
```

### 3. **Install Dependencies**
```bash
# Install Composer dependencies
composer install --no-dev --optimize-autoloader

# Install Node.js dependencies  
npm install
npm run build
```

### 4. **Konfigurasi Environment**
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Edit file .env sesuai setting hosting
nano .env
```

### 5. **Setup Database**
Edit file `.env` untuk database:
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=[nama_database_hosting]
DB_USERNAME=[username_database]
DB_PASSWORD=[password_database]
```

### 6. **Migrasi Database**
```bash
# Jalankan migrasi
php artisan migrate --force

# Seed data (opsional)
php artisan db:seed --force
```

### 7. **Set Permissions**
```bash
# Set permission untuk storage dan cache
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
```

### 8. **Optimize untuk Production**
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache
```

## 🔄 UPDATE DEPLOYMENT

### Untuk update di masa depan:
```bash
# Pull latest changes
git pull origin master

# Update dependencies
composer install --no-dev --optimize-autoloader
npm install && npm run build

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Migrate database jika ada perubahan
php artisan migrate --force

# Re-cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🛠️ TROUBLESHOOTING

### Jika ada error permission:
```bash
sudo chown -R www-data:www-data storage/
sudo chown -R www-data:www-data bootstrap/cache/
```

### Jika composer error:
```bash
php -d memory_limit=512M /usr/local/bin/composer install --no-dev
```

### Jika npm error:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

## 📝 CHECKLIST DEPLOYMENT

- [ ] SSH connection berhasil
- [ ] Git repository di-clone ke public_html  
- [ ] Composer install berhasil
- [ ] NPM build berhasil
- [ ] File .env dikonfigurasi
- [ ] Database migrasi berhasil
- [ ] Permissions di-set dengan benar
- [ ] Cache optimization applied
- [ ] Website dapat diakses dari browser

## 🔗 Repository
GitHub: https://github.com/Pedulikita/app-imamhafsh.git

---
*Generated: December 27, 2025*