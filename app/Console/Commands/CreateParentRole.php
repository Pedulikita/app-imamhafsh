<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class CreateParentRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'role:create-parent';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create parent role if it does not exist';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Check if parent role exists
        if (Role::where('name', 'parent')->exists()) {
            $this->info('✅ Role "parent" already exists');
            return 0;
        }

        // Create parent role
        $role = Role::create(['name' => 'parent', 'guard_name' => 'web']);

        // Get or create permissions for parent
        $permissions = [
            'view parent dashboard',
            'view parent children',
            'view child grades',
            'view child attendance',
            'view communications',
            'view announcements',
            'update parent profile',
        ];

        foreach ($permissions as $permission) {
            if (!Permission::where('name', $permission)->exists()) {
                Permission::create(['name' => $permission, 'guard_name' => 'web']);
            }
            $perm = Permission::where('name', $permission)->first();
            $role->givePermissionTo($perm);
        }

        $this->info('✅ Role "parent" created successfully with permissions!');
        return 0;
    }
}
