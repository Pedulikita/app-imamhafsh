<?php

/**
 * Authorization Debug Test
 * 
 * This script helps debug authorization errors by testing
 * authentication and permission systems.
 */

require_once 'vendor/autoload.php';

echo "=== AUTHORIZATION DEBUG TEST ===\n\n";

// Test 1: Check if admin user exists
echo "1. Testing Admin User Setup:\n";
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=imamhafsh', 'root', '');
    
    // Check if admin user exists
    $stmt = $pdo->query("SELECT id, name, email FROM users WHERE email LIKE '%admin%' LIMIT 1");
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "   ✅ Admin user found: {$admin['email']}\n";
        
        // Check roles
        $roleStmt = $pdo->prepare("SELECT r.name FROM roles r 
                                   JOIN user_roles ur ON r.id = ur.role_id 
                                   WHERE ur.user_id = ?");
        $roleStmt->execute([$admin['id']]);
        $roles = $roleStmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (!empty($roles)) {
            echo "   ✅ Admin roles: " . implode(', ', $roles) . "\n";
        } else {
            echo "   ❌ Admin user has no roles assigned\n";
        }
    } else {
        echo "   ❌ No admin user found\n";
    }
} catch (Exception $e) {
    echo "   ❌ Database error: " . $e->getMessage() . "\n";
}

// Test 2: Check middleware registration
echo "\n2. Testing Middleware Setup:\n";
if (file_exists('bootstrap/app.php')) {
    $appContent = file_get_contents('bootstrap/app.php');
    
    if (strpos($appContent, 'CheckRole::class') !== false) {
        echo "   ✅ Role middleware registered\n";
    } else {
        echo "   ❌ Role middleware not found\n";
    }
    
    if (strpos($appContent, 'CheckPermission::class') !== false) {
        echo "   ✅ Permission middleware registered\n";
    } else {
        echo "   ❌ Permission middleware not found\n";
    }
    
    if (strpos($appContent, 'SecurityHeaders::class') !== false) {
        echo "   ✅ Security headers middleware registered\n";
    } else {
        echo "   ❌ Security headers middleware not found\n";
    }
}

// Test 3: Test route access
echo "\n3. Testing Route Access:\n";
$protectedRoutes = [
    'Dashboard' => 'http://127.0.0.1:8000/dashboard',
    'Settings' => 'http://127.0.0.1:8000/settings',
    'Admin Panel' => 'http://127.0.0.1:8000/admin'
];

foreach ($protectedRoutes as $name => $url) {
    echo "   Testing {$name}: ";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    switch ($httpCode) {
        case 200:
            echo "✅ ACCESSIBLE (No auth required)\n";
            break;
        case 302:
            echo "✅ PROTECTED (Redirects to login)\n";
            break;
        case 403:
            echo "❌ FORBIDDEN (Authorization error)\n";
            break;
        case 404:
            echo "⚠️ NOT FOUND (Route doesn't exist)\n";
            break;
        default:
            echo "❓ HTTP {$httpCode}\n";
            break;
    }
}

echo "\n=== QUICK FIXES ===\n";

// Check if we need to create admin user
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE email LIKE '%admin%'");
    $adminCount = $stmt->fetchColumn();
    
    if ($adminCount == 0) {
        echo "\n🔧 ADMIN USER SETUP:\n";
        echo "Run this to create an admin user:\n\n";
        echo "php artisan tinker\n";
        echo ">>> \$user = App\\Models\\User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => Hash::make('password')]);\n";
        echo ">>> \$role = App\\Models\\Role::where('name', 'super_admin')->first();\n";
        echo ">>> \$user->roles()->attach(\$role);\n";
        echo ">>> exit\n\n";
    }
    
    // Check if super_admin role exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM roles WHERE name = 'super_admin'");
    $roleCount = $stmt->fetchColumn();
    
    if ($roleCount == 0) {
        echo "\n🔧 ROLE SETUP:\n";
        echo "Run this to create super_admin role:\n\n";
        echo "php artisan tinker\n";
        echo ">>> App\\Models\\Role::create(['name' => 'super_admin', 'description' => 'Super Administrator']);\n";
        echo ">>> exit\n\n";
    }
    
} catch (Exception $e) {
    echo "Database connection issue: " . $e->getMessage() . "\n";
}

echo "\n🚀 COMMON SOLUTIONS:\n\n";
echo "1. If you're getting 403 errors, you may need to:\n";
echo "   - Log in as an admin user\n";
echo "   - Check if your user has the correct roles\n";
echo "   - Verify middleware is working properly\n\n";

echo "2. If you're getting redirect loops:\n";
echo "   - Check if login route is accessible\n";
echo "   - Verify session configuration\n";
echo "   - Clear browser cache/cookies\n\n";

echo "3. To access admin features:\n";
echo "   - Go to http://127.0.0.1:8000/login\n";
echo "   - Use admin credentials\n";
echo "   - Check role assignments in database\n\n";

echo "Authorization debug completed!\n";