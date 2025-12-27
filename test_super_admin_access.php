<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

echo "=== TEST LOGIN SUPER ADMIN ===\n";

// Get user dengan super_admin role
$superAdmin = User::whereHas('roles', function ($query) {
    $query->where('name', 'super_admin');
})->first();

if (!$superAdmin) {
    echo "❌ No super admin user found!\n";
    exit(1);
}

echo "Super Admin User: " . $superAdmin->email . "\n";
echo "Has super_admin role: " . ($superAdmin->hasRole('super_admin') ? 'YES' : 'NO') . "\n";
echo "isSuperAdmin(): " . ($superAdmin->isSuperAdmin() ? 'YES' : 'NO') . "\n";
echo "canManageAllArticles(): " . ($superAdmin->canManageAllArticles() ? 'YES' : 'NO') . "\n";

// Test middleware roles
$allowedRoles = ['penulis', 'editor', 'admin', 'super_admin'];
echo "\n=== MIDDLEWARE ROLE TESTS ===\n";
foreach ($allowedRoles as $role) {
    $hasRole = $superAdmin->hasRole($role);
    echo "Has role '$role': " . ($hasRole ? 'YES' : 'NO') . "\n";
    if ($hasRole) {
        echo "✅ Middleware should allow access via role '$role'\n";
    }
}

// Check specific permissions
echo "\n=== PERMISSION TESTS ===\n";
$permissions = ['view_articles', 'create_articles', 'edit_articles', 'delete_articles', 'publish_articles'];
foreach ($permissions as $permission) {
    $hasPermission = $superAdmin->hasPermission($permission);
    echo "Has permission '$permission': " . ($hasPermission ? 'YES' : 'NO') . "\n";
}

echo "\n=== CONCLUSION ===\n";
if ($superAdmin->isSuperAdmin() && $superAdmin->canManageAllArticles()) {
    echo "✅ Super Admin should have FULL ACCESS to all article features\n";
    echo "✅ Check browser session and make sure you're logged in as: " . $superAdmin->email . "\n";
} else {
    echo "❌ There's an issue with the super admin configuration\n";
}