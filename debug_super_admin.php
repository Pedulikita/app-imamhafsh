<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Role;

echo "=== DEBUG SUPER ADMIN ROLE ===\n";

// Check if super_admin role exists
$superAdminRole = Role::where('name', 'super_admin')->first();
echo "Super Admin Role: " . ($superAdminRole ? 'EXISTS' : 'NOT FOUND') . "\n";

if ($superAdminRole) {
    echo "Super Admin Role ID: " . $superAdminRole->id . "\n";
    echo "Permissions: " . $superAdminRole->permissions->count() . "\n\n";
}

// List all users and their roles
echo "=== ALL USERS AND ROLES ===\n";
$users = User::with('roles')->get();
foreach ($users as $user) {
    $roleNames = $user->roles->pluck('name')->join(', ');
    echo $user->email . " - Roles: " . ($roleNames ?: 'NO ROLES') . "\n";
}

// Check which user should be super admin (usually first user or admin user)
echo "\n=== LOOKING FOR ADMIN USER ===\n";
$firstUser = User::first();
if ($firstUser) {
    echo "First user: " . $firstUser->email . "\n";
    echo "Has super_admin role: " . ($firstUser->hasRole('super_admin') ? 'YES' : 'NO') . "\n";
    
    if (!$firstUser->hasRole('super_admin') && $superAdminRole) {
        echo "Assigning super_admin role to first user...\n";
        $firstUser->roles()->attach($superAdminRole);
        echo "Role assigned!\n";
    }
}

// Test canManageAllArticles
echo "\n=== TESTING PERMISSIONS ===\n";
foreach ($users as $user) {
    echo $user->email . " - canManageAllArticles: " . ($user->canManageAllArticles() ? 'YES' : 'NO') . "\n";
}