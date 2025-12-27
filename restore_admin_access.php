<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

echo "=== RESTORING ADMIN ACCESS ===\n\n";

try {
    // First, create basic roles if they don't exist
    echo "1. CREATING BASIC ROLES:\n";
    
    $roles = [
        [
            'name' => 'super_admin',
            'display_name' => 'Super Admin',
            'description' => 'Complete system access'
        ],
        [
            'name' => 'editor',
            'display_name' => 'Editor',
            'description' => 'Content management access'
        ],
        [
            'name' => 'penulis',
            'display_name' => 'Penulis',
            'description' => 'Content creation access'
        ],
        [
            'name' => 'user',
            'display_name' => 'User',
            'description' => 'Basic user access'
        ]
    ];

    foreach ($roles as $roleData) {
        $role = Role::firstOrCreate(
            ['name' => $roleData['name']],
            $roleData
        );
        echo "✅ Role '{$role->display_name}' " . ($role->wasRecentlyCreated ? 'created' : 'already exists') . "\n";
    }

    // Create basic permissions
    echo "\n2. CREATING BASIC PERMISSIONS:\n";
    
    $permissions = [
        [
            'name' => 'manage_pages',
            'display_name' => 'Manage Pages',
            'description' => 'Can create, edit and delete pages'
        ],
        [
            'name' => 'manage_articles',
            'display_name' => 'Manage Articles',
            'description' => 'Can create, edit and delete articles'
        ],
        [
            'name' => 'view_pages',
            'display_name' => 'View Pages',
            'description' => 'Can view pages'
        ],
        [
            'name' => 'view_articles',
            'display_name' => 'View Articles',
            'description' => 'Can view articles'
        ],
        [
            'name' => 'create_pages',
            'display_name' => 'Create Pages',
            'description' => 'Can create new pages'
        ],
        [
            'name' => 'create_articles',
            'display_name' => 'Create Articles',
            'description' => 'Can create new articles'
        ]
    ];

    foreach ($permissions as $permissionData) {
        $permission = Permission::firstOrCreate(
            ['name' => $permissionData['name']],
            $permissionData
        );
        echo "✅ Permission '{$permission->display_name}' " . ($permission->wasRecentlyCreated ? 'created' : 'already exists') . "\n";
    }

    // Create admin user
    echo "\n3. CREATING ADMIN USER:\n";
    
    $adminUser = User::where('email', 'admin@imamhafsh.com')->first();
    
    if (!$adminUser) {
        $adminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@imamhafsh.com',
            'email_verified_at' => now(),
            'password' => bcrypt('admin123')
        ]);
        echo "✅ Created new admin user: {$adminUser->name} ({$adminUser->email})\n";
    } else {
        echo "✅ Admin user already exists: {$adminUser->name} ({$adminUser->email})\n";
    }
    
    // Assign super_admin role to admin user
    $superAdminRole = Role::where('name', 'super_admin')->first();
    if ($superAdminRole && !$adminUser->roles->contains($superAdminRole->id)) {
        $adminUser->roles()->attach($superAdminRole->id);
        echo "✅ Assigned super_admin role to admin user\n";
    } else {
        echo "✅ Admin user already has super_admin role\n";
    }
    
    // Assign all permissions to super_admin role
    echo "\n4. ASSIGNING PERMISSIONS TO SUPER ADMIN:\n";
    $allPermissions = Permission::all();
    $superAdminRole->permissions()->syncWithoutDetaching($allPermissions);
    echo "✅ Assigned all " . $allPermissions->count() . " permissions to super_admin role\n";
    
    // Verify admin access
    echo "\n5. VERIFICATION:\n";
    $adminUser = $adminUser->fresh(['roles.permissions']);
    echo "✅ Admin user: {$adminUser->name}\n";
    echo "✅ Admin email: {$adminUser->email}\n";
    echo "✅ Admin roles: " . $adminUser->roles->pluck('display_name')->implode(', ') . "\n";
    echo "✅ Has super_admin role: " . ($adminUser->hasRole('super_admin') ? 'YES' : 'NO') . "\n";
    echo "✅ Is super admin: " . ($adminUser->isSuperAdmin() ? 'YES' : 'NO') . "\n";
    echo "✅ Total permissions: " . $adminUser->getAllPermissions()->count() . "\n";
    
    echo "\n🎉 ADMIN ACCESS RESTORED SUCCESSFULLY!\n";
    echo "\nLogin credentials:\n";
    echo "Email: admin@imamhafsh.com\n";
    echo "Password: admin123\n";

} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "\n" . str_repeat("=", 60) . "\n";