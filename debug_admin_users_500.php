<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

try {
    // Bootstrap Laravel
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    
    echo "=== DEBUG: Admin Users 500 Error Investigation ===\n\n";
    
    // Check if UserController exists
    echo "1. Checking UserController...\n";
    $controllerExists = class_exists('App\Http\Controllers\UserController');
    echo "UserController exists: " . ($controllerExists ? "YES" : "NO") . "\n";
    
    if ($controllerExists) {
        $reflection = new ReflectionClass('App\Http\Controllers\UserController');
        $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);
        echo "Available methods: " . implode(', ', array_map(function($method) {
            return $method->getName();
        }, $methods)) . "\n";
    }
    echo "\n";
    
    // Check database connection
    echo "2. Checking database connection...\n";
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        echo "Database connection: OK\n";
        
        // Check users table
        $usersTableExists = \Illuminate\Support\Facades\Schema::hasTable('users');
        echo "Users table exists: " . ($usersTableExists ? "YES" : "NO") . "\n";
        
        if ($usersTableExists) {
            $userCount = \Illuminate\Support\Facades\DB::table('users')->count();
            echo "User count: $userCount\n";
        }
    } catch (Exception $e) {
        echo "Database error: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    // Check Spatie permissions tables
    echo "3. Checking Spatie permissions tables...\n";
    $requiredTables = ['roles', 'permissions', 'role_has_permissions', 'model_has_roles', 'model_has_permissions'];
    foreach ($requiredTables as $table) {
        $exists = \Illuminate\Support\Facades\Schema::hasTable($table);
        echo "Table '$table': " . ($exists ? "EXISTS" : "MISSING") . "\n";
    }
    echo "\n";
    
    // Check middleware
    echo "4. Checking middleware...\n";
    $middlewareExists = class_exists('Spatie\Permission\Middlewares\RoleMiddleware');
    echo "Role middleware exists: " . ($middlewareExists ? "YES" : "NO") . "\n";
    echo "\n";
    
    // Test route resolution
    echo "5. Testing route resolution...\n";
    try {
        $request = Request::create('/admin/users', 'GET');
        $route = \Illuminate\Support\Facades\Route::getRoutes()->match($request);
        echo "Route matched: " . $route->getName() . "\n";
        echo "Controller: " . $route->getController() . "\n";
        echo "Middleware: " . implode(', ', $route->middleware()) . "\n";
    } catch (Exception $e) {
        echo "Route resolution error: " . $e->getMessage() . "\n";
    }
    echo "\n";
    
    // Check current user authentication
    echo "6. Checking authentication...\n";
    $user = \Illuminate\Support\Facades\Auth::user();
    if ($user) {
        echo "Current user ID: " . $user->id . "\n";
        echo "Current user email: " . $user->email . "\n";
        echo "User roles: " . implode(', ', $user->getRoleNames()->toArray()) . "\n";
        echo "Has super_admin role: " . ($user->hasRole('super_admin') ? "YES" : "NO") . "\n";
    } else {
        echo "No authenticated user\n";
    }
    echo "\n";
    
    // Test UserController instantiation
    echo "7. Testing UserController instantiation...\n";
    try {
        if ($controllerExists) {
            $controller = new \App\Http\Controllers\UserController();
            echo "UserController instantiated successfully\n";
            
            // Check if index method exists
            if (method_exists($controller, 'index')) {
                echo "Index method exists\n";
            } else {
                echo "Index method MISSING\n";
            }
        }
    } catch (Exception $e) {
        echo "Controller instantiation error: " . $e->getMessage() . "\n";
        echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    }
    echo "\n";
    
    // Check configuration
    echo "8. Checking configuration...\n";
    echo "APP_ENV: " . config('app.env') . "\n";
    echo "APP_DEBUG: " . (config('app.debug') ? "true" : "false") . "\n";
    echo "Database connection: " . config('database.default') . "\n";
    echo "\n";
    
    echo "=== Investigation complete ===\n";
    
} catch (Exception $e) {
    echo "FATAL ERROR during investigation:\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}