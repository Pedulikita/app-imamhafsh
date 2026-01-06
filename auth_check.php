<?php

// Simple auth check and login redirect helper
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h1>🔐 Authentication Status Check</h1>";
echo "<style>
body { font-family: monospace; margin: 20px; }
.success { color: green; font-weight: bold; }
.error { color: red; font-weight: bold; }
.warning { color: orange; font-weight: bold; }
.action { background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
.section { border: 1px solid #ccc; padding: 15px; margin: 10px 0; background: #f9f9f9; }
</style>";

echo "<div class='section'>";
echo "<h2>👤 Current Authentication Status</h2>";

if (auth()->check()) {
    $user = auth()->user();
    echo "<span class='success'>✅ Logged in as: " . $user->name . " (" . $user->email . ")</span><br>";
    
    // Check roles
    if (method_exists($user, 'hasRole')) {
        if ($user->hasRole('super_admin')) {
            echo "<span class='success'>✅ User has super_admin role</span><br>";
            echo "<h3>✅ You can access User Management!</h3>";
            echo "<a href='/admin/users' class='action'>Go to User Management</a><br>";
        } else {
            echo "<span class='error'>❌ User does NOT have super_admin role</span><br>";
            echo "<strong>Current roles:</strong> " . implode(', ', $user->getRoleNames()->toArray()) . "<br>";
            echo "<p class='warning'>⚠️ You need super_admin role to access /admin/users</p>";
        }
    } else {
        echo "<span class='warning'>⚠️ Role system not available</span><br>";
    }
} else {
    echo "<span class='error'>❌ Not logged in</span><br>";
    echo "<h3>🔐 You need to login first!</h3>";
    echo "<a href='/login' class='action'>Login Here</a><br>";
    echo "<a href='/register' class='action'>Register New Account</a><br>";
}

echo "</div>";

echo "<div class='section'>";
echo "<h2>🎯 Quick Actions</h2>";
echo "<a href='/' class='action'>🏠 Home</a>";
echo "<a href='/dashboard' class='action'>📊 Dashboard</a>";
echo "<a href='/clear-production-cache.php?secret=clear_cache_now_2026' class='action'>🧹 Clear Cache</a>";
echo "</div>";

echo "<div class='section'>";
echo "<h2>📋 Troubleshooting Steps</h2>";
echo "<ol>";
echo "<li><strong>If not logged in:</strong> Click 'Login Here' button above</li>";
echo "<li><strong>If logged in but no super_admin role:</strong> Contact administrator to assign super_admin role</li>";
echo "<li><strong>If still having issues:</strong> Clear cache using the button above</li>";
echo "</ol>";
echo "</div>";

?>