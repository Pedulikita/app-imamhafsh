<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

echo "=== Production Users Debug ===\n\n";

try {
    // Get all users with roles
    $users = User::with('roles')->get();
    
    if ($users->isEmpty()) {
        echo "❌ No users found in database\n";
        return;
    }
    
    foreach ($users as $user) {
        echo "👤 User: {$user->name} ({$user->email})\n";
        echo "   ID: {$user->id}\n";
        
        if ($user->roles->isEmpty()) {
            echo "   ⚠️  No roles assigned\n";
        } else {
            echo "   🎭 Roles:\n";
            foreach ($user->roles as $role) {
                echo "      - {$role->name} ({$role->display_name})\n";
            }
        }
        echo "\n";
    }
    
    // Check if any user has super_admin role
    $superAdmins = User::whereHas('roles', function($query) {
        $query->where('name', 'super_admin');
    })->with('roles')->get();
    
    echo "=== Super Admin Users ===\n";
    if ($superAdmins->isEmpty()) {
        echo "❌ No super admin users found!\n";
        echo "This might be why /users route returns 404\n";
    } else {
        foreach ($superAdmins as $admin) {
            echo "✅ Super Admin: {$admin->name} ({$admin->email})\n";
        }
    }
    
    echo "\n=== Route Access Debug ===\n";
    echo "Route '/users' requires middleware: role:super_admin\n";
    echo "Current super admins count: " . $superAdmins->count() . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}