# OAuth Social Login Setup Guide

## Overview
Sistem autentikasi media sosial telah diimplementasi untuk platform education Imam Hafsh. Users dapat login menggunakan akun Google, Facebook, atau GitHub.

## Features yang Diimplementasi

### ✅ Backend Implementation
1. **Laravel Socialite Package** - Installed dan configured
2. **Database Migration** - Kolom social login fields telah ditambahkan ke tabel users
3. **SocialAuthController** - Complete OAuth handling dengan fitur:
   - User registration via social accounts
   - Account linking untuk existing users
   - Account unlinking
   - Role-based redirects
   - Error handling dan security validation

### ✅ Frontend Integration
4. **React Login Form** - Social login buttons sudah ready di `/resources/js/pages/auth/login.tsx`
5. **Route Configuration** - OAuth routes telah registered di `/routes/web.php`

### ✅ Database Schema
6. **User Model Fields**:
   - `google_id` - Google OAuth user ID
   - `facebook_id` - Facebook OAuth user ID
   - `github_id` - GitHub OAuth user ID
   - `provider_avatar` - Social profile picture URL
   - `provider_name` - OAuth provider name
   - `social_linked_at` - Timestamp when account was linked

## Required OAuth App Setup

Untuk mengaktifkan social login, Anda perlu membuat OAuth applications di setiap provider:

### 1. Google OAuth Setup
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Enable Google+ API
4. Pergi ke "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set redirect URL: `http://your-domain.com/auth/google/callback`
6. Copy Client ID dan Client Secret

### 2. Facebook OAuth Setup
1. Buka [Facebook Developers](https://developers.facebook.com/)
2. Create App > Consumer
3. Add Facebook Login product
4. Set redirect URL: `http://your-domain.com/auth/facebook/callback`
5. Copy App ID dan App Secret

### 3. GitHub OAuth Setup
1. Buka [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App
3. Set Authorization callback URL: `http://your-domain.com/auth/github/callback`
4. Copy Client ID dan Client Secret

## Environment Configuration

Tambahkan konfigurasi berikut ke file `.env`:

```env
# OAuth Social Login Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Testing the Implementation

1. **Local Testing**:
   ```bash
   php artisan serve
   ```

2. **Test Routes**:
   - http://localhost:8000/auth/google
   - http://localhost:8000/auth/facebook 
   - http://localhost:8000/auth/github

3. **Expected Behavior**:
   - Redirects ke OAuth provider
   - Setelah authorization, redirect kembali ke callback URL
   - User otomatis login atau register
   - Redirect ke dashboard sesuai role

## Security Features

- **CSRF Protection** - Semua routes protected
- **Email Verification** - Optional email verification untuk social users
- **Account Linking** - Existing users dapat link social accounts
- **Role-Based Redirects** - Users diredirect sesuai role mereka
- **Provider Validation** - Hanya Google, Facebook, GitHub yang diizinkan

## Error Handling

- **Invalid Provider** - 404 error untuk provider tidak dikenal
- **OAuth Failure** - Redirect ke login dengan error message
- **Account Conflicts** - Automatic account linking dengan existing email
- **Missing Scopes** - Fallback dengan error notification

## Database Queries

Controller telah optimized untuk mencegah N+1 queries dan memiliki proper error handling untuk semua scenario.

## Next Steps

1. Set up OAuth applications di semua providers
2. Configure production environment variables
3. Test semua OAuth flows
4. Update privacy policy untuk mention social login data usage
5. Optional: Add social account management di user dashboard

## Files Modified/Created

- `database/migrations/2025_12_24_081928_add_social_login_fields_to_users_table.php`
- `app/Http/Controllers/SocialAuthController.php`
- `app/Models/User.php` - Added social login methods dan fillable fields
- `config/services.php` - Added OAuth provider configurations
- `routes/web.php` - Added social authentication routes
- `.env.example` - Added OAuth configuration templates

Sistem social login sekarang sudah complete dan siap untuk production deployment!