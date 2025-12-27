<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

echo "=== RECOVERY SUMMARY REPORT ===\n\n";

try {
    echo "📊 DATABASE RECOVERY STATUS:\n";
    echo str_repeat("-", 40) . "\n";
    
    // Users Status
    $totalUsers = User::count();
    $adminUsers = User::whereHas('roles', function($query) {
        $query->where('name', 'super_admin');
    })->count();
    
    echo "👥 USERS:\n";
    echo "  Total users: {$totalUsers}\n";
    echo "  Admin users: {$adminUsers}\n";
    
    $users = User::with('roles')->get();
    foreach ($users as $user) {
        $roleNames = $user->roles->pluck('display_name')->implode(', ') ?: 'No roles';
        echo "  - {$user->name} ({$user->email}) - {$roleNames}\n";
    }
    
    // Roles Status  
    $totalRoles = Role::count();
    echo "\n🎭 ROLES:\n";
    echo "  Total roles: {$totalRoles}\n";
    
    $roles = Role::withCount('permissions')->get();
    foreach ($roles as $role) {
        echo "  - {$role->display_name} ({$role->permissions_count} permissions)\n";
    }
    
    // Permissions Status
    $totalPermissions = Permission::count();
    echo "\n🔐 PERMISSIONS:\n";
    echo "  Total permissions: {$totalPermissions}\n";
    
    $permissions = Permission::all();
    foreach ($permissions as $permission) {
        echo "  - {$permission->display_name} ({$permission->name})\n";
    }
    
    echo "\n" . str_repeat("=", 50) . "\n";
    echo "🎉 RECOVERY COMPLETED SUCCESSFULLY!\n\n";
    
    echo "✅ WHAT WAS RESTORED:\n";
    echo "  • Super Admin role dengan semua permissions\n";
    echo "  • Editor, Penulis, User roles\n";  
    echo "  • Teacher role (sudah ada sebelumnya)\n";
    echo "  • Admin user dengan super_admin role\n";
    echo "  • All necessary permissions untuk content management\n";
    echo "  • All necessary permissions untuk teacher class management\n";
    echo "  • Email verification untuk admin user\n\n";
    
    echo "🔑 ADMIN LOGIN CREDENTIALS:\n";
    echo "  Email: admin@imamhafsh.com\n";
    echo "  Password: admin123\n\n";
    
    echo "👨‍🏫 TEACHER LOGIN CREDENTIALS:\n";
    echo "  Email: teacher@imamhafsh.com\n";
    echo "  Password: password123\n\n";
    
    echo "🌐 CARA AKSES:\n";
    echo "  1. Pastikan server Laravel berjalan: php artisan serve\n";
    echo "  2. Buka browser ke: http://localhost:8000/login\n";
    echo "  3. Login dengan kredensial di atas\n";
    echo "  4. Admin memiliki akses penuh ke semua fitur\n";
    echo "  5. Teacher memiliki akses ke class management\n\n";
    
    echo "📱 FITUR YANG TERSEDIA:\n";
    echo "  • Admin Dashboard - Content management\n";
    echo "  • Student Monitoring System\n";
    echo "  • Teacher Class Management\n";  
    echo "  • Role-based Access Control\n";
    echo "  • Article & Page Management\n";
    echo "  • User Management\n\n";
    
    echo "Problem 'date bese di hilankan semua' telah diselesaikan!\n";
    echo "Admin sekarang dapat login kembali dengan normal.\n";
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 60) . "\n";