<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;

class CheckUserRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:check-roles';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Check all users and their roles';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->warn('No users found in database');
            return;
        }

        $this->info('Users and their roles:');
        $this->newLine();
        
        foreach ($users as $user) {
            $roles = $user->roles()->pluck('name')->implode(', ') ?: 'No roles';
            $this->line("ID: {$user->id} | Name: {$user->name} | Email: {$user->email}");
            $this->line("   Roles: {$roles}");
            $this->newLine();
        }

        $this->info('Available roles in database:');
        $roles = Role::all();
        if ($roles->isEmpty()) {
            $this->warn('No roles found in database');
            return;
        }

        foreach ($roles as $role) {
            $this->line("- {$role->name} ({$role->display_name})");
        }
    }
}
