<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:create-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a test user for login testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        
        $this->info('Test user created/updated:');
        $this->line('Email: test@example.com');
        $this->line('Password: password');
        $this->line('User ID: ' . $user->id);
        
        return 0;
    }
}
