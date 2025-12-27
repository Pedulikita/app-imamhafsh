<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Permissions
        $permissions = [
            // Pages Permissions
            ['name' => 'view_pages', 'display_name' => 'View Pages', 'description' => 'View pages list', 'group' => 'Pages'],
            ['name' => 'create_pages', 'display_name' => 'Create Pages', 'description' => 'Create new pages', 'group' => 'Pages'],
            ['name' => 'edit_pages', 'display_name' => 'Edit Pages', 'description' => 'Edit existing pages', 'group' => 'Pages'],
            ['name' => 'delete_pages', 'display_name' => 'Delete Pages', 'description' => 'Delete pages', 'group' => 'Pages'],
            ['name' => 'publish_pages', 'display_name' => 'Publish Pages', 'description' => 'Publish pages to public', 'group' => 'Pages'],
            
            // Article Permissions
            ['name' => 'view_articles', 'display_name' => 'View Articles', 'description' => 'View articles list', 'group' => 'Articles'],
            ['name' => 'create_articles', 'display_name' => 'Create Articles', 'description' => 'Create new articles', 'group' => 'Articles'],
            ['name' => 'edit_articles', 'display_name' => 'Edit Articles', 'description' => 'Edit existing articles', 'group' => 'Articles'],
            ['name' => 'delete_articles', 'display_name' => 'Delete Articles', 'description' => 'Delete articles', 'group' => 'Articles'],
            ['name' => 'publish_articles', 'display_name' => 'Publish Articles', 'description' => 'Publish articles to public', 'group' => 'Articles'],
            ['name' => 'edit_own_articles', 'display_name' => 'Edit Own Articles', 'description' => 'Edit only own articles', 'group' => 'Articles'],
            
            // User Management Permissions
            ['name' => 'manage_users', 'display_name' => 'Manage Users', 'description' => 'Full access to user management', 'group' => 'Users'],
            ['name' => 'manage_roles', 'display_name' => 'Manage Roles', 'description' => 'Full access to roles management', 'group' => 'Roles'],
            ['name' => 'manage_permissions', 'display_name' => 'Manage Permissions', 'description' => 'Full access to permissions management', 'group' => 'Permissions'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }

        // Create Roles
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'super_admin'],
            [
                'display_name' => 'Super Admin',
                'description' => 'Full access to all features - can manage everything including users, roles, pages, articles'
            ]
        );

        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            [
                'display_name' => 'Admin',
                'description' => 'Full administrative access - can manage pages, articles, and most admin features'
            ]
        );

        $editorRole = Role::firstOrCreate(
            ['name' => 'editor'],
            [
                'display_name' => 'Editor',
                'description' => 'Can manage pages and articles - view, create, edit, delete, and publish all content'
            ]
        );

        $penulisRole = Role::firstOrCreate(
            ['name' => 'penulis'],
            [
                'display_name' => 'Penulis',
                'description' => 'Can view, create, and edit own articles - cannot publish or delete'
            ]
        );

        $userRole = Role::firstOrCreate(
            ['name' => 'user'],
            [
                'display_name' => 'User',
                'description' => 'Basic user with access to dashboard only'
            ]
        );

        // Assign Permissions to Roles
        
        // Super Admin gets all permissions
        $superAdminRole->permissions()->sync(Permission::all());

        // Admin gets all permissions (same as super admin)
        $adminRole->permissions()->sync(Permission::all());

        // Editor gets pages and article permissions
        $editorRole->permissions()->sync(
            Permission::whereIn('name', [
                'view_pages',
                'create_pages',
                'edit_pages',
                'delete_pages',
                'publish_pages',
                'view_articles',
                'create_articles',
                'edit_articles',
                'delete_articles',
                'publish_articles'
            ])->pluck('id')
        );

        // Penulis gets limited article permissions (own articles only)
        $penulisRole->permissions()->sync(
            Permission::whereIn('name', [
                'view_articles',
                'create_articles',
                'edit_own_articles'
            ])->pluck('id')
        );

        // User has no special permissions
        $userRole->permissions()->sync([]);

        $this->command->info('Roles and permissions seeded successfully!');
        $this->command->info('');
        $this->command->info('Created Roles:');
        $this->command->info('- Super Admin: Full access to everything');
        $this->command->info('- Admin: Full administrative access');
        $this->command->info('- Editor: Can manage pages and articles');
        $this->command->info('- Penulis: Can create and edit own articles');
        $this->command->info('- User: Basic access only');
    }
}
