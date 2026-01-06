<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Route Debugging ===\n\n";

try {
    // List all registered routes containing 'users'
    $routes = app('router')->getRoutes();
    
    echo "🔍 All routes containing 'users':\n";
    foreach ($routes as $route) {
        $uri = $route->uri();
        if (strpos($uri, 'users') !== false) {
            $methods = implode('|', $route->methods());
            $name = $route->getName() ?: 'unnamed';
            $action = $route->getAction();
            $controller = isset($action['controller']) ? $action['controller'] : 'Closure';
            
            echo "  [$methods] $uri -> $controller (name: $name)\n";
        }
    }
    
    echo "\n📋 Specific admin/users routes:\n";
    foreach ($routes as $route) {
        $uri = $route->uri();
        if (strpos($uri, 'admin/users') !== false) {
            $methods = implode('|', $route->methods());
            $name = $route->getName() ?: 'unnamed';
            $middleware = implode(', ', $route->gatherMiddleware());
            
            echo "  [$methods] $uri (middleware: $middleware) (name: $name)\n";
        }
    }
    
    echo "\n🛡️ Middleware check:\n";
    // Check if user has proper role
    if (auth()->check()) {
        $user = auth()->user();
        echo "  Current user: {$user->name} ({$user->email})\n";
        $roles = $user->roles->pluck('name')->toArray();
        echo "  User roles: " . implode(', ', $roles) . "\n";
        echo "  Has super_admin role: " . (in_array('super_admin', $roles) ? 'YES' : 'NO') . "\n";
    } else {
        echo "  No authenticated user\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}