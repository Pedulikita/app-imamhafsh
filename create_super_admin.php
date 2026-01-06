<?php

// Script to create super admin user for initial access
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h1>🔑 Create Super Admin User</h1>";
echo "<style>
body { font-family: monospace; margin: 20px; }
.success { color: green; font-weight: bold; }
.error { color: red; font-weight: bold; }
.warning { color: orange; font-weight: bold; }
.info { color: blue; font-weight: bold; }
.section { border: 1px solid #ccc; padding: 15px; margin: 10px 0; background: #f9f9f9; }
pre { background: #eee; padding: 10px; }
</style>";

try {
    // Create super admin user
    $email = 'admin@imamhafsh.com';
    $password = 'SuperAdmin123!';
    $name = 'Super Administrator';
    
    echo "<div class='section'>";
    echo "<h2>👤 Creating Super Admin User</h2>";
    
    // Check if user already exists
    $existingUser = DB::table('users')->where('email', $email)->first();
    
    if ($existingUser) {
        echo "<span class='warning'>⚠️ User already exists: {$email}</span><br>";
        $userId = $existingUser->id;
        $user = \App\Models\User::find($userId);
    } else {
        // Create new user
        $user = \App\Models\User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);
        
        echo "<span class='success'>✅ User created successfully!</span><br>";
        echo "<strong>Email:</strong> {$email}<br>";
        echo "<strong>Password:</strong> {$password}<br>";
        $userId = $user->id;
    }
    
    echo "</div>";
    
    // Handle roles
    echo "<div class='section'>";
    echo "<h2>🛡️ Assigning Super Admin Role</h2>";
    
    // Create super_admin role if doesn't exist
    $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'super_admin']);
    echo "<span class='info'>📋 Super Admin role ensured</span><br>";
    
    // Assign role to user
    if (!$user->hasRole('super_admin')) {
        $user->assignRole('super_admin');
        echo "<span class='success'>✅ Super Admin role assigned to user</span><br>";
    } else {
        echo "<span class='info'>📋 User already has Super Admin role</span><br>";
    }
    
    // Verify role assignment
    $userRoles = $user->getRoleNames();
    echo "<strong>User roles:</strong> " . implode(', ', $userRoles->toArray()) . "<br>";
    
    echo "</div>";
    
    // Create additional permissions if needed
    echo "<div class='section'>";
    echo "<h2>🔐 Permissions Setup</h2>";
    
    $permissions = ['manage users', 'manage roles', 'manage permissions'];
    foreach ($permissions as $permissionName) {
        $permission = \Spatie\Permission\Models\Permission::firstOrCreate(['name' => $permissionName]);
        if (!$role->hasPermissionTo($permissionName)) {
            $role->givePermissionTo($permissionName);
            echo "<span class='success'>✅ Permission assigned: {$permissionName}</span><br>";
        } else {
            echo "<span class='info'>📋 Permission already exists: {$permissionName}</span><br>";
        }
    }
    
    echo "</div>";
    
    // Test route access
    echo "<div class='section'>";
    echo "<h2>🧪 Testing Route Access</h2>";
    
    // Simulate authentication
    auth()->login($user);
    
    if (auth()->check()) {
        echo "<span class='success'>✅ User authenticated successfully</span><br>";
        echo "<strong>Authenticated as:</strong> " . auth()->user()->name . "<br>";
        
        if (auth()->user()->hasRole('super_admin')) {
            echo "<span class='success'>✅ User has super_admin role - can access /admin/users</span><br>";
        }
    }
    
    echo "</div>";
    
    // Login instructions
    echo "<div class='section'>";
    echo "<h2>🚀 Next Steps</h2>";
    echo "<ol>";
    echo "<li><strong>Login with these credentials:</strong></li>";
    echo "<ul>";
    echo "<li>Email: <strong>{$email}</strong></li>";
    echo "<li>Password: <strong>{$password}</strong></li>";
    echo "</ul>";
    echo "<li><a href='/login' target='_blank'>Go to Login Page</a></li>";
    echo "<li>After login, <a href='/admin/users' target='_blank'>Access User Management</a></li>";
    echo "<li>Change password after first login for security</li>";
    echo "</ol>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div class='section'>";
    echo "<span class='error'>❌ Error: " . $e->getMessage() . "</span><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
    echo "</div>";
}

?>