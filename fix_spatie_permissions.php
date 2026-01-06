<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Artisan;

try {
    // Bootstrap Laravel
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    
    echo "=== FIXING SPATIE PERMISSIONS SETUP ===\n\n";
    
    // 1. Publish Spatie Permission migrations
    echo "1. Publishing Spatie Permission migrations...\n";
    try {
        Artisan::call('vendor:publish', [
            '--provider' => 'Spatie\\Permission\\PermissionServiceProvider',
            '--tag' => 'migrations'
        ]);
        echo "✓ Migrations published\n";
        echo Artisan::output();
    } catch (Exception $e) {
        echo "Error publishing migrations: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    // 2. Run migrations
    echo "2. Running database migrations...\n";
    try {
        Artisan::call('migrate', ['--force' => true]);
        echo "✓ Migrations completed\n";
        echo Artisan::output();
    } catch (Exception $e) {
        echo "Error running migrations: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    // 3. Check if tables now exist
    echo "3. Verifying permission tables...\n";
    $requiredTables = ['roles', 'permissions', 'role_has_permissions', 'model_has_roles', 'model_has_permissions'];
    foreach ($requiredTables as $table) {
        $exists = \Illuminate\Support\Facades\Schema::hasTable($table);
        echo "Table '$table': " . ($exists ? "✓ EXISTS" : "✗ MISSING") . "\n";
    }
    echo "\n";
    
    // 4. Create basic roles if they don't exist
    echo "4. Creating basic roles...\n";
    try {
        $roleClass = \Spatie\Permission\Models\Role::class;
        
        $roles = ['super_admin', 'admin', 'teacher', 'student'];
        foreach ($roles as $roleName) {
            $role = $roleClass::firstOrCreate(['name' => $roleName]);
            echo "Role '$roleName': " . ($role->wasRecentlyCreated ? "CREATED" : "EXISTS") . "\n";
        }
    } catch (Exception $e) {
        echo "Error creating roles: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    // 5. Check if super admin user exists and assign role
    echo "5. Checking super admin user...\n";
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
        echo "Error checking super admin: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    // 6. Clear cache
    echo "6. Clearing cache...\n";
    try {
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        echo "✓ Cache cleared\n";
    } catch (Exception $e) {
        echo "Error clearing cache: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    echo "=== SETUP COMPLETE ===\n";
    echo "You should now be able to access /admin/users\n";
    
} catch (Exception $e) {
    echo "FATAL ERROR during setup:\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}