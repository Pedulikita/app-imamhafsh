<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call(RolesAndPermissionsSeeder::class);

        // User::factory(10)->create();

        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Create super admin user
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@imamhafsh.com'],
            [
                'name' => 'Super Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Assign super_admin role to admin user
        $superAdminRole = \App\Models\Role::where('name', 'super_admin')->first();
        if ($superAdminRole && !$superAdmin->hasRole('super_admin')) {
            $superAdmin->roles()->attach($superAdminRole->id);
        }

        // Seed content
        $this->call([
            ProfilePageSeeder::class,
            ProjectSeeder::class,
            ActivitySeeder::class,
            AchievementSeeder::class,
            EventSeeder::class,
            TestimonySeeder::class,
            TeamMemberSeeder::class,
            EkstrakurikulerSeeder::class,
        ]);
    }
}
