<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;

class AssignRoleToUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:assign-role {userId} {roleName}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Assign a role to a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('userId');
        $roleName = $this->argument('roleName');

        $user = User::find($userId);
        if (!$user) {
            $this->error("User with ID {$userId} not found!");
            return 1;
        }

        $role = Role::where('name', $roleName)->first();
        if (!$role) {
            $this->error("Role '{$roleName}' not found!");
            return 1;
        }

        if ($user->roles()->where('role_id', $role->id)->exists()) {
            $this->info("User {$user->name} already has the role '{$roleName}'");
            return 0;
        }

        $user->roles()->attach($role->id);
        $this->info("Role '{$roleName}' assigned to user {$user->name} successfully!");
        return 0;
    }
}
