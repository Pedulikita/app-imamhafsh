<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class TeacherRoleSeeder extends Seeder
{
    public function run()
    {
        // Create Teacher role
        $teacherRole = Role::firstOrCreate([
            'name' => 'teacher'
        ], [
            'display_name' => 'Teacher',
            'description' => 'Teacher with class management access'
        ]);

        // Create Class Management permissions
        $classPermissions = [
            [
                'name' => 'view_classes',
                'display_name' => 'View Classes',
                'description' => 'Can view class information'
            ],
            [
                'name' => 'manage_classes',
                'display_name' => 'Manage Classes',
                'description' => 'Can create, edit, and manage classes'
            ],
            [
                'name' => 'view_students',
                'display_name' => 'View Students',
                'description' => 'Can view student information'
            ],
            [
                'name' => 'manage_students',
                'display_name' => 'Manage Students',
                'description' => 'Can manage student data in assigned classes'
            ],
            [
                'name' => 'manage_grades',
                'display_name' => 'Manage Grades',
                'description' => 'Can input and manage student grades'
            ],
            [
                'name' => 'manage_attendance',
                'display_name' => 'Manage Attendance',
                'description' => 'Can record and manage student attendance'
            ],
            [
                'name' => 'view_reports',
                'display_name' => 'View Reports',
                'description' => 'Can view class and student reports'
            ],
            [
                'name' => 'generate_reports',
                'display_name' => 'Generate Reports',
                'description' => 'Can generate class progress reports'
            ]
        ];

        // Create permissions
        $createdPermissions = [];
        foreach ($classPermissions as $permissionData) {
            $permission = Permission::firstOrCreate([
                'name' => $permissionData['name']
            ], $permissionData);
            $createdPermissions[] = $permission;
        }

        // Assign permissions to teacher role
        $teacherRole->permissions()->syncWithoutDetaching($createdPermissions);

        // Update super_admin role to have all new permissions
        $superAdminRole = Role::where('name', 'super_admin')->first();
        if ($superAdminRole) {
            $superAdminRole->permissions()->syncWithoutDetaching($createdPermissions);
        }

        echo "Teacher role and permissions created successfully!" . PHP_EOL;
    }
}