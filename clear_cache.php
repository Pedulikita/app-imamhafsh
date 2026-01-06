<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Clearing Production Cache ===\n\n";

try {
    // Clear all caches
    echo "🧹 Clearing application cache...\n";
    \Artisan::call('cache:clear');
    echo "   " . \Artisan::output();
    
    echo "🧹 Clearing config cache...\n";
    \Artisan::call('config:clear');
    echo "   " . \Artisan::output();
    
    echo "🧹 Clearing route cache...\n";
    \Artisan::call('route:clear');  
    echo "   " . \Artisan::output();
    
    echo "🧹 Clearing view cache...\n";
    \Artisan::call('view:clear');
    echo "   " . \Artisan::output();
    
    echo "\n📋 Re-caching optimized data...\n";
    
    echo "📋 Caching config...\n";
    \Artisan::call('config:cache');
    echo "   " . \Artisan::output();
    
    echo "📋 Caching routes...\n";
    \Artisan::call('route:cache');
    echo "   " . \Artisan::output();
    
    echo "\n✅ Cache operations completed!\n";
    
    echo "\n🔍 Verifying admin/users route...\n";
    $routes = app('router')->getRoutes();
    
    $adminUsersFound = false;
    foreach ($routes as $route) {
        if ($route->uri() === 'admin/users' && in_array('GET', $route->methods())) {
            $adminUsersFound = true;
            $controller = $route->getAction()['controller'] ?? 'Unknown';
            $middleware = implode(', ', $route->gatherMiddleware());
            echo "✅ Route found: GET admin/users -> $controller\n";
            echo "   Middleware: $middleware\n";
            break;
        }
    }
    
    if (!$adminUsersFound) {
        echo "❌ admin/users route not found after cache clear!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}