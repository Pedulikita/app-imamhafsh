<?php

// Debug environment differences between local and production
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h1>🔍 Environment Debug: Local vs Production</h1>";
echo "<style>
body { font-family: monospace; margin: 20px; }
.success { color: green; font-weight: bold; }
.error { color: red; font-weight: bold; }
.warning { color: orange; font-weight: bold; }
.info { color: blue; font-weight: bold; }
.section { border: 1px solid #ccc; padding: 15px; margin: 10px 0; background: #f9f9f9; }
pre { background: #eee; padding: 10px; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
th { background: #f0f0f0; }
</style>";

echo "<div class='section'>";
echo "<h2>🌍 Environment Comparison</h2>";
echo "<table>";
echo "<tr><th>Setting</th><th>Value</th><th>Status</th></tr>";

$checks = [
    'Environment' => config('app.env'),
    'Debug Mode' => config('app.debug') ? 'true' : 'false',
    'URL' => config('app.url'),
    'Current URL' => url()->current(),
    'Request URL' => request()->url(),
    'PHP Version' => PHP_VERSION,
    'Laravel Version' => app()->version(),
    'Server Software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'Document Root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown',
    'HTTP Host' => $_SERVER['HTTP_HOST'] ?? 'Unknown',
];

foreach ($checks as $label => $value) {
    $status = 'info';
    if ($label === 'Environment' && $value === 'production') {
        $status = 'warning';
    } elseif ($label === 'Debug Mode' && $value === 'false') {
        $status = 'warning';
    }
    echo "<tr><td><strong>{$label}</strong></td><td>{$value}</td><td><span class='{$status}'>●</span></td></tr>";
}

echo "</table>";
echo "</div>";

echo "<div class='section'>";
echo "<h2>📁 File System Status</h2>";

$files = [
    'public/.htaccess' => 'Web server rewrite rules',
    'routes/web.php' => 'Route definitions',
    'bootstrap/cache/routes.php' => 'Cached routes (if exists)',
    'bootstrap/cache/config.php' => 'Cached config (if exists)',
    'storage/framework/cache' => 'Cache directory',
    'storage/logs' => 'Log directory',
];

echo "<table>";
echo "<tr><th>File/Directory</th><th>Status</th><th>Permissions</th><th>Description</th></tr>";

foreach ($files as $path => $description) {
    if (file_exists($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -4);
        $status = "<span class='success'>✅ Exists</span>";
    } else {
        $perms = 'N/A';
        $status = "<span class='error'>❌ Missing</span>";
    }
    echo "<tr><td>{$path}</td><td>{$status}</td><td>{$perms}</td><td>{$description}</td></tr>";
}

echo "</table>";
echo "</div>";

echo "<div class='section'>";
echo "<h2>🛤️ Route Analysis</h2>";

// Get all routes with admin/users pattern
$routes = Route::getRoutes();
$userRoutes = [];

foreach ($routes as $route) {
    $uri = $route->uri();
    if (strpos($uri, 'admin/users') !== false || strpos($uri, 'users') !== false) {
        $userRoutes[] = [
            'method' => implode('|', $route->methods()),
            'uri' => $uri,
            'name' => $route->getName() ?? 'N/A',
            'middleware' => implode(', ', $route->middleware()),
            'action' => $route->getActionName()
        ];
    }
}

if (!empty($userRoutes)) {
    echo "<span class='success'>✅ Found " . count($userRoutes) . " user-related routes</span><br><br>";
    echo "<table>";
    echo "<tr><th>Method</th><th>URI</th><th>Name</th><th>Middleware</th><th>Action</th></tr>";
    foreach ($userRoutes as $route) {
        echo "<tr>";
        echo "<td>{$route['method']}</td>";
        echo "<td>{$route['uri']}</td>";
        echo "<td>{$route['name']}</td>";
        echo "<td>{$route['middleware']}</td>";
        echo "<td>" . substr($route['action'], 0, 50) . "...</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<span class='error'>❌ No user-related routes found!</span>";
}

echo "</div>";

echo "<div class='section'>";
echo "<h2>🧪 Route Matching Test</h2>";

$testRoutes = [
    '/admin/users',
    '/admin/users-test', 
    '/admin/users-debug',
    '/admin-users-test'
];

echo "<table>";
echo "<tr><th>Test Route</th><th>Match Status</th><th>Details</th></tr>";

foreach ($testRoutes as $testRoute) {
    try {
        $request = Request::create($testRoute, 'GET');
        $route = Route::getRoutes()->match($request);
        
        $status = "<span class='success'>✅ Matched</span>";
        $details = "Action: " . $route->getActionName() . "<br>Middleware: " . implode(', ', $route->middleware());
    } catch (Exception $e) {
        $status = "<span class='error'>❌ No Match</span>";
        $details = "Error: " . $e->getMessage();
    }
    
    echo "<tr><td>{$testRoute}</td><td>{$status}</td><td>{$details}</td></tr>";
}

echo "</table>";
echo "</div>";

echo "<div class='section'>";
echo "<h2>⚙️ Web Server Configuration</h2>";
echo "<p><strong>Jika route test bekerja tapi route asli tidak, masalahnya kemungkinan:</strong></p>";
echo "<ul>";
echo "<li><strong>.htaccess tidak berfungsi</strong> - File tidak ter-deploy atau server tidak support mod_rewrite</li>";
echo "<li><strong>Web server configuration</strong> - Apache/Nginx tidak dikonfigurasi untuk Laravel</li>";
echo "<li><strong>Document root salah</strong> - Server tidak mengarah ke folder public/</li>";
echo "<li><strong>Cache production</strong> - Route cache berbeda dengan file route yang ada</li>";
echo "</ul>";
echo "</div>";

echo "<div class='section'>";
echo "<h2>🚀 Next Steps</h2>";
echo "<p><strong>Test URLs untuk debug:</strong></p>";
echo "<ul>";
echo "<li><a href='/admin/users-debug' target='_blank'>Test /admin/users-debug (tanpa middleware)</a></li>";
echo "<li><a href='/admin/users-test' target='_blank'>Test /admin/users-test (prefix test)</a></li>";
echo "<li><a href='/route_test.php' target='_blank'>Route analysis tool</a></li>";
echo "</ul>";
echo "</div>";

?>