<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h1>🔍 Production vs Local Debugging</h1>";
echo "<style>
body { font-family: monospace; margin: 20px; }
.success { color: green; font-weight: bold; }
.error { color: red; font-weight: bold; }
.warning { color: orange; font-weight: bold; }
.section { border: 1px solid #ccc; padding: 15px; margin: 10px 0; background: #f9f9f9; }
pre { background: #eee; padding: 10px; overflow-x: auto; }
</style>";

echo "<div class='section'>";
echo "<h2>📊 Environment Information</h2>";
echo "<strong>APP_ENV:</strong> " . config('app.env') . "<br>";
echo "<strong>APP_DEBUG:</strong> " . (config('app.debug') ? 'true' : 'false') . "<br>";
echo "<strong>APP_URL:</strong> " . config('app.url') . "<br>";
echo "<strong>Current URL:</strong> " . (isset($_SERVER['HTTP_HOST']) ? 'https://' . $_SERVER['HTTP_HOST'] : 'CLI') . "<br>";
echo "<strong>PHP Version:</strong> " . PHP_VERSION . "<br>";
echo "<strong>Laravel Version:</strong> " . app()->version() . "<br>";
echo "</div>";

echo "<div class='section'>";
echo "<h2>🛡️ Middleware & Authentication</h2>";
try {
    // Check if user is authenticated
    if (auth()->check()) {
        $user = auth()->user();
        echo "<span class='success'>✅ User authenticated: " . $user->name . " (ID: " . $user->id . ")</span><br>";
        
        // Check roles
        if (method_exists($user, 'getRoleNames')) {
            $roles = $user->getRoleNames();
            echo "<strong>User Roles:</strong> " . ($roles->count() > 0 ? implode(', ', $roles->toArray()) : 'No roles') . "<br>";
            
            // Check specifically for super_admin role
            if ($user->hasRole('super_admin')) {
                echo "<span class='success'>✅ User has super_admin role</span><br>";
            } else {
                echo "<span class='error'>❌ User does NOT have super_admin role</span><br>";
            }
        }
        
        // Check permissions
        if (method_exists($user, 'getAllPermissions')) {
            $permissions = $user->getAllPermissions();
            echo "<strong>User Permissions:</strong> " . $permissions->count() . " permissions<br>";
        }
    } else {
        echo "<span class='warning'>⚠️ No authenticated user</span><br>";
    }
} catch (Exception $e) {
    echo "<span class='error'>❌ Auth Error: " . $e->getMessage() . "</span><br>";
}
echo "</div>";

echo "<div class='section'>";
echo "<h2>🛤️ Route Analysis</h2>";

// Get all routes
$routes = Route::getRoutes();
$adminUserRoutes = [];

foreach ($routes as $route) {
    $uri = $route->uri();
    if (strpos($uri, 'admin/users') !== false) {
        $adminUserRoutes[] = [
            'method' => implode('|', $route->methods()),
            'uri' => $uri,
            'name' => $route->getName(),
            'action' => $route->getActionName(),
            'middleware' => $route->middleware()
        ];
    }
}

if (!empty($adminUserRoutes)) {
    echo "<span class='success'>✅ Found " . count($adminUserRoutes) . " admin/users routes</span><br>";
    echo "<pre>";
    foreach ($adminUserRoutes as $route) {
        echo "Method: {$route['method']}\n";
        echo "URI: {$route['uri']}\n";
        echo "Name: {$route['name']}\n";
        echo "Action: {$route['action']}\n";
        echo "Middleware: " . implode(', ', $route['middleware']) . "\n";
        echo "---\n";
    }
    echo "</pre>";
} else {
    echo "<span class='error'>❌ No admin/users routes found!</span><br>";
}
echo "</div>";

echo "<div class='section'>";
echo "<h2>💾 Database Connection</h2>";
try {
    DB::connection()->getPdo();
    echo "<span class='success'>✅ Database connected</span><br>";
    
    // Check users table
    $userCount = DB::table('users')->count();
    echo "<strong>Users in database:</strong> " . $userCount . "<br>";
    
    // Check roles table if exists
    try {
        $roleCount = DB::table('roles')->count();
        echo "<strong>Roles in database:</strong> " . $roleCount . "<br>";
        
        // List roles
        $roles = DB::table('roles')->select('name')->get();
        echo "<strong>Available roles:</strong> " . implode(', ', $roles->pluck('name')->toArray()) . "<br>";
    } catch (Exception $e) {
        echo "<span class='warning'>⚠️ Roles table issue: " . $e->getMessage() . "</span><br>";
    }
    
} catch (Exception $e) {
    echo "<span class='error'>❌ Database Error: " . $e->getMessage() . "</span><br>";
}
echo "</div>";

echo "<div class='section'>";
echo "<h2>📁 File System Check</h2>";
$criticalFiles = [
    'public/.htaccess',
    'bootstrap/cache',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs'
];

foreach ($criticalFiles as $file) {
    if (file_exists($file)) {
        echo "<span class='success'>✅ {$file} exists</span><br>";
        if (is_dir($file)) {
            echo "&nbsp;&nbsp;&nbsp;Permissions: " . substr(sprintf('%o', fileperms($file)), -4) . "<br>";
        }
    } else {
        echo "<span class='error'>❌ {$file} missing</span><br>";
    }
}
echo "</div>";

echo "<div class='section'>";
echo "<h2>⚙️ Configuration Check</h2>";
echo "<strong>Session Driver:</strong> " . config('session.driver') . "<br>";
echo "<strong>Cache Driver:</strong> " . config('cache.default') . "<br>";
echo "<strong>Queue Driver:</strong> " . config('queue.default') . "<br>";
echo "<strong>Mail Driver:</strong> " . config('mail.default') . "<br>";

// Check critical config values
$configs = [
    'app.key' => 'Application Key',
    'session.cookie' => 'Session Cookie Name',
    'session.domain' => 'Session Domain'
];

foreach ($configs as $key => $label) {
    $value = config($key);
    if ($value) {
        echo "<strong>{$label}:</strong> " . (strlen($value) > 50 ? substr($value, 0, 50) . '...' : $value) . "<br>";
    } else {
        echo "<span class='error'>❌ {$label} not set</span><br>";
    }
}
echo "</div>";

echo "<div class='section'>";
echo "<h2>🔄 Cache Status</h2>";
try {
    // Try to clear caches
    Artisan::call('route:clear');
    echo "<span class='success'>✅ Routes cleared</span><br>";
    
    Artisan::call('config:clear');
    echo "<span class='success'>✅ Config cleared</span><br>";
    
    Artisan::call('view:clear');
    echo "<span class='success'>✅ Views cleared</span><br>";
    
    // Re-cache for production
    if (config('app.env') === 'production') {
        Artisan::call('route:cache');
        echo "<span class='success'>✅ Routes cached</span><br>";
        
        Artisan::call('config:cache');
        echo "<span class='success'>✅ Config cached</span><br>";
    }
} catch (Exception $e) {
    echo "<span class='error'>❌ Cache Error: " . $e->getMessage() . "</span><br>";
}
echo "</div>";

echo "<div class='section'>";
echo "<h2>🔍 Route Testing</h2>";
try {
    // Test if route exists
    $testUrl = url('/admin/users');
    echo "<strong>Testing URL:</strong> {$testUrl}<br>";
    
    // Try to resolve route
    $request = Request::create('/admin/users', 'GET');
    $request->headers->set('Accept', 'application/json');
    
    try {
        $route = Route::getRoutes()->match($request);
        echo "<span class='success'>✅ Route matched: " . $route->getName() . "</span><br>";
        echo "<strong>Controller:</strong> " . $route->getActionName() . "<br>";
        echo "<strong>Middleware:</strong> " . implode(', ', $route->middleware()) . "<br>";
    } catch (Exception $e) {
        echo "<span class='error'>❌ Route matching failed: " . $e->getMessage() . "</span><br>";
    }
    
} catch (Exception $e) {
    echo "<span class='error'>❌ Route test error: " . $e->getMessage() . "</span><br>";
}
echo "</div>";

echo "<div class='section'>";
echo "<h2>📊 Server Information</h2>";
echo "<strong>Server Software:</strong> " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "<br>";
echo "<strong>Document Root:</strong> " . ($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown') . "<br>";
echo "<strong>Script Name:</strong> " . ($_SERVER['SCRIPT_NAME'] ?? 'Unknown') . "<br>";
echo "<strong>Request URI:</strong> " . ($_SERVER['REQUEST_URI'] ?? 'Unknown') . "<br>";
echo "<strong>HTTP Host:</strong> " . ($_SERVER['HTTP_HOST'] ?? 'Unknown') . "<br>";
echo "<strong>HTTPS:</strong> " . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'Yes' : 'No') . "<br>";
echo "</div>";

echo "<div class='section'>";
echo "<h2>✅ Recommendations</h2>";
echo "<ul>";
echo "<li>Pastikan file <code>.htaccess</code> ada di folder <code>public/</code></li>";
echo "<li>Verifikasi user memiliki role <code>super_admin</code></li>";
echo "<li>Cek konfigurasi web server (Apache/Nginx)</li>";
echo "<li>Pastikan semua cache sudah di-clear dan di-rebuild</li>";
echo "<li>Verifikasi environment variables di production</li>";
echo "</ul>";
echo "</div>";

?>