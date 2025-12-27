# Panduan Setup Google Login

## Langkah 1: Buat Google OAuth Application

1. **Buka Google Cloud Console**:
   - Pergi ke https://console.cloud.google.com/
   - Login dengan akun Google Anda

2. **Buat Project Baru atau Pilih Project**:
   - Klik "Select a project" di bagian atas
   - Klik "NEW PROJECT"
   - Isi nama project: "ImamHafsh Education"
   - Klik "CREATE"

3. **Enable Google+ API**:
   - Di sidebar, pilih "APIs & Services" > "Library"
   - Cari "Google+ API"
   - Klik dan pilih "ENABLE"

4. **Buat OAuth 2.0 Credentials**:
   - Pergi ke "APIs & Services" > "Credentials"
   - Klik "+ CREATE CREDENTIALS"
   - Pilih "OAuth 2.0 Client IDs"

5. **Configure OAuth Consent Screen**:
   - Jika diminta, klik "CONFIGURE CONSENT SCREEN"
   - Pilih "External" user type
   - Isi informasi aplikasi:
     - App name: "ImamHafsh Education Platform"
     - User support email: email Anda
     - Developer contact email: email Anda
   - Klik "SAVE AND CONTINUE"

6. **Buat OAuth 2.0 Client ID**:
   - Pilih "Web application"
   - Name: "ImamHafsh Web Client"
   - Authorized redirect URIs:
     - http://localhost:8000/auth/google/callback
     - http://127.0.0.1:8000/auth/google/callback
     - http://imamhafsh.com/auth/google/callback (untuk production)
   - Klik "CREATE"

7. **Copy Client ID dan Client Secret**:
   - Setelah dibuat, akan muncul popup dengan Client ID dan Client Secret
   - SIMPAN kedua nilai ini dengan aman

## Langkah 2: Konfigurasi Laravel

Tambahkan konfigurasi berikut ke file `.env`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Langkah 3: Test Google Login

1. Restart Laravel server:
   ```bash
   php artisan serve
   ```

2. Buka browser dan pergi ke:
   ```
   http://localhost:8000/login
   ```

3. Klik tombol "Masuk dengan Google"

4. Anda akan diarahkan ke Google untuk authorize aplikasi

5. Setelah approve, akan kembali ke aplikasi dan otomatis login

## Troubleshooting

**Error "redirect_uri_mismatch"**:
- Pastikan URL callback di Google Console sama persis dengan yang digunakan aplikasi
- Check URL: http://localhost:8000/auth/google/callback

**Error "invalid_client"**:
- Periksa kembali GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di .env
- Pastikan tidak ada spasi atau karakter tambahan

**Error "access_denied"**:
- User membatalkan authorize di Google
- Atau aplikasi belum di-approve untuk production

## URL Penting

- **Login Page**: http://localhost:8000/login
- **Google Redirect**: http://localhost:8000/auth/google
- **Callback URL**: http://localhost:8000/auth/google/callback