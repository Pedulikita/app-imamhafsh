<?php
// Simple web-based cache clear for production
// Access via: https://imamhafsh.com/clear-production-cache.php

if (isset($_GET['secret']) && $_GET['secret'] === 'clear_cache_now_2026') {
    require_once __DIR__ . '/vendor/autoload.php';
    
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
    
    echo "<h1>Production Cache Clear</h1>";
    echo "<pre>";
    
    try {
        echo "🧹 Clearing application cache...\n";
        \Artisan::call('cache:clear');
        echo \Artisan::output();
        
        echo "🧹 Clearing config cache...\n";
        \Artisan::call('config:clear');
        echo \Artisan::output();
        
        echo "🧹 Clearing route cache...\n";
        \Artisan::call('route:clear');  
        echo \Artisan::output();
        
        echo "🧹 Clearing view cache...\n";
        \Artisan::call('view:clear');
        echo \Artisan::output();
        
        echo "\n📋 Re-caching optimized data...\n";
        
        echo "📋 Caching config...\n";
        \Artisan::call('config:cache');
        echo \Artisan::output();
        
        echo "📋 Caching routes...\n";
        \Artisan::call('route:cache');
        echo \Artisan::output();
        
        echo "\n✅ All cache operations completed!\n";
        echo "🔗 Try accessing /admin/users now\n";
        
    } catch (Exception $e) {
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
    
    echo "</pre>";
} else {
    echo "<h1>Access Denied</h1>";
    echo "<p>Invalid or missing secret parameter.</p>";
}
?>