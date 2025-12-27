<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Role;

echo "=== CHECKING DATABASE STATUS AFTER ISSUE ===\n\n";

try {
    // Check if critical tables exist
    echo "1. DATABASE TABLES STATUS:\n";
    $criticalTables = ['users', 'roles', 'permissions', 'role_user', 'permission_role'];
    
    foreach ($criticalTables as $table) {
        $exists = Schema::hasTable($table);
        echo ($exists ? "✅" : "❌") . " Table '{$table}': " . ($exists ? "EXISTS" : "MISSING") . "\n";
    }
    
    // Check users data
    echo "\n2. USERS DATA:\n";
    $userCount = User::count();
    echo "Total users in database: {$userCount}\n";
    
    if ($userCount > 0) {
        echo "Users list:\n";
        $users = User::select('id', 'name', 'email', 'created_at')->get();
        foreach ($users as $user) {
            echo "  - ID: {$user->id}, Name: {$user->name}, Email: {$user->email}\n";
        }
    } else {
        echo "❌ NO USERS FOUND IN DATABASE!\n";
    }
    
    // Check roles data
    echo "\n3. ROLES DATA:\n";
    $roleCount = Role::count();
    echo "Total roles in database: {$roleCount}\n";
    
    if ($roleCount > 0) {
        echo "Roles list:\n";
        $roles = Role::select('id', 'name', 'display_name')->get();
        foreach ($roles as $role) {
            echo "  - ID: {$role->id}, Name: {$role->name}, Display: {$role->display_name}\n";
        }
    } else {
        echo "❌ NO ROLES FOUND IN DATABASE!\n";
    }
    
    // Check for admin users
    echo "\n4. ADMIN USERS CHECK:\n";
    $adminUsers = User::whereHas('roles', function($query) {
        $query->where('name', 'super_admin');
    })->get();
    
    if ($adminUsers->count() > 0) {
        echo "✅ Found {$adminUsers->count()} admin user(s):\n";
        foreach ($adminUsers as $admin) {
            echo "  - {$admin->name} ({$admin->email})\n";
        }
    } else {
        echo "❌ NO ADMIN USERS FOUND!\n";
    }
    
    // Check authentication tables
    echo "\n5. AUTHENTICATION SYSTEM:\n";
    echo "Sessions table: " . (Schema::hasTable('sessions') ? "✅ EXISTS" : "❌ MISSING") . "\n";
    echo "Password reset tokens: " . (Schema::hasTable('password_reset_tokens') ? "✅ EXISTS" : "❌ MISSING") . "\n";
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 60) . "\n";