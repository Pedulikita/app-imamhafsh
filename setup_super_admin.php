<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Role;

echo "=== SETUP SUPER ADMIN FOR TESTING ===\n";

// Minta input email user yang akan dijadikan super admin
echo "Masukkan email user yang akan dijadikan super admin: ";
$handle = fopen("php://stdin", "r");
$email = trim(fgets($handle));
fclose($handle);

if (empty($email)) {
    echo "❌ Email tidak boleh kosong!\n";
    exit(1);
}

// Cari user berdasarkan email
$user = User::where('email', $email)->first();

if (!$user) {
    echo "❌ User dengan email '$email' tidak ditemukan!\n";
    exit(1);
}

// Cari role super_admin
$superAdminRole = Role::where('name', 'super_admin')->first();

if (!$superAdminRole) {
    echo "❌ Role super_admin tidak ditemukan! Jalankan seeder dulu.\n";
    exit(1);
}

// Assign role super_admin ke user jika belum punya
if (!$user->hasRole('super_admin')) {
    $user->roles()->attach($superAdminRole);
    echo "✅ Role super_admin telah diberikan ke user '$email'\n";
} else {
    echo "✅ User '$email' sudah memiliki role super_admin\n";
}

// Tampilkan info lengkap user
echo "\n=== INFO USER ===\n";
echo "Email: " . $user->email . "\n";
echo "Name: " . $user->name . "\n";
echo "Roles: " . $user->roles->pluck('name')->join(', ') . "\n";
echo "Has super_admin role: " . ($user->hasRole('super_admin') ? 'YES' : 'NO') . "\n";
echo "Can manage all articles: " . ($user->canManageAllArticles() ? 'YES' : 'NO') . "\n";

echo "\n✅ Silakan login dengan email '$email' untuk test akses artikel!\n";