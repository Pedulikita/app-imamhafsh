<?php
// Simple route test
echo "<h1>Route Test</h1>";

try {
    require_once 'vendor/autoload.php';
    $app = require_once 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    echo "<h2>Testing Route Resolution</h2>";
    
    // Test route existence
    $routes = Route::getRoutes();
    $adminUserRoutes = [];
    
    foreach ($routes as $route) {
        if (strpos($route->uri(), 'admin/users') !== false) {
            $adminUserRoutes[] = [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName()
            ];
        }
    }
    
    if (count($adminUserRoutes) > 0) {
        echo "<p style='color:green;'><strong>✅ Found " . count($adminUserRoutes) . " admin/users routes:</strong></p>";
        foreach ($adminUserRoutes as $route) {
            echo "<li>{$route['method']} /{$route['uri']} (name: {$route['name']})</li>";
        }
        
        // Test specific route matching
        try {
            $request = Request::create('/admin/users', 'GET');
            $matchedRoute = Route::getRoutes()->match($request);
            echo "<p style='color:green;'><strong>✅ Route /admin/users successfully matched!</strong></p>";
            echo "<li>Controller: " . $matchedRoute->getActionName() . "</li>";
            echo "<li>Middleware: " . implode(', ', $matchedRoute->middleware()) . "</li>";
        } catch (Exception $e) {
            echo "<p style='color:red;'><strong>❌ Route matching failed: " . $e->getMessage() . "</strong></p>";
        }
        
    } else {
        echo "<p style='color:red;'><strong>❌ No admin/users routes found!</strong></p>";
    }
    
    echo "<h2>Environment Info</h2>";
    echo "<li>Laravel Version: " . app()->version() . "</li>";
    echo "<li>Environment: " . config('app.env') . "</li>";
    echo "<li>Debug: " . (config('app.debug') ? 'true' : 'false') . "</li>";
    
} catch (Exception $e) {
    echo "<p style='color:red;'><strong>Error: " . $e->getMessage() . "</strong></p>";
}
?>