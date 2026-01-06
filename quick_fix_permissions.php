<?php

require_once __DIR__ . '/vendor/autoload.php';

try {
    // Bootstrap Laravel
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    
    echo "=== QUICK SPATIE SETUP ===\n\n";
    
    // 1. Check and create missing tables manually if needed
    echo "1. Checking Spatie tables...\n";
    $requiredTables = ['roles', 'permissions', 'role_has_permissions', 'model_has_roles', 'model_has_permissions'];
    foreach ($requiredTables as $table) {
        $exists = \Illuminate\Support\Facades\Schema::hasTable($table);
        echo "Table '$table': " . ($exists ? "EXISTS" : "MISSING") . "\n";
    }
    echo "\n";
    
    // 2. Try to create basic roles
    echo "2. Creating basic roles...\n";
    try {
        // First try to create the Role model directly
        $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'super_admin']);
        echo "Super admin role: " . ($role->wasRecentlyCreated ? "CREATED" : "EXISTS") . "\n";
        
        // Create other roles
        $roles = ['admin', 'teacher', 'student'];
        foreach ($roles as $roleName) {
            $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => $roleName]);
            echo "Role '$roleName': " . ($role->wasRecentlyCreated ? "CREATED" : "EXISTS") . "\n";
        }
    } catch (Exception $e) {
        echo "Error creating roles: " . $e->getMessage() . "\n";
        echo "This might mean the tables don't exist. Creating them manually...\n";
        
        // Create tables manually
        try {
            \Illuminate\Support\Facades\DB::statement("
                CREATE TABLE IF NOT EXISTS `role_has_permissions` (
                    `permission_id` bigint(20) unsigned NOT NULL,
                    `role_id` bigint(20) unsigned NOT NULL,
                    PRIMARY KEY (`permission_id`,`role_id`),
                    KEY `role_has_permissions_role_id_foreign` (`role_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            
            \Illuminate\Support\Facades\DB::statement("
                CREATE TABLE IF NOT EXISTS `model_has_roles` (
                    `role_id` bigint(20) unsigned NOT NULL,
                    `model_type` varchar(255) NOT NULL,
                    `model_id` bigint(20) unsigned NOT NULL,
                    PRIMARY KEY (`role_id`,`model_id`,`model_type`),
                    KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            
            \Illuminate\Support\Facades\DB::statement("
                CREATE TABLE IF NOT EXISTS `model_has_permissions` (
                    `permission_id` bigint(20) unsigned NOT NULL,
                    `model_type` varchar(255) NOT NULL,
                    `model_id` bigint(20) unsigned NOT NULL,
                    PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
                    KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            
            echo "✓ Tables created manually\n";
            
            // Try creating roles again
            $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'super_admin']);
            echo "Super admin role: " . ($role->wasRecentlyCreated ? "CREATED" : "EXISTS") . "\n";
            
        } catch (Exception $e2) {
            echo "Error creating tables manually: " . $e2->getMessage() . "\n";
        }
    }
    echo "\n";
    
    // 3. Assign super_admin role to admin user
    echo "3. Assigning super_admin role...\n";
    try {
        $user = \App\Models\User::where('email', 'admin@imamhafsh.com')->first();
        if ($user) {
            if (!$user->hasRole('super_admin')) {
                $user->assignRole('super_admin');
                echo "✓ Super admin role assigned to admin@imamhafsh.com\n";
            } else {
                echo "✓ admin@imamhafsh.com already has super_admin role\n";
            }
        } else {
            echo "✗ admin@imamhafsh.com user not found\n";
        }
    } catch (Exception $e) {
        echo "Error assigning role: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    echo "=== SETUP COMPLETE ===\n";
    
} catch (Exception $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}