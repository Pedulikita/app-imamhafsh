<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ParentProfile;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ParentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create parent user 1
        $parent1 = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi.santoso@gmail.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Assign parent role
        $parent1->assignRole('parent');

        // Create parent profile for user 1
        ParentProfile::create([
            'user_id' => $parent1->id,
            'father_name' => 'Budi Santoso',
            'father_phone' => '081234567890',
            'father_email' => 'budi.santoso@gmail.com',
            'father_occupation' => 'Guru',
            'mother_name' => 'Siti Nurhaliza',
            'mother_phone' => '082345678901',
            'mother_email' => 'siti.nurhaliza@gmail.com',
            'mother_occupation' => 'Ibu Rumah Tangga',
            'address' => 'Jl. Merdeka No. 123, Jakarta Selatan',
            'emergency_contact_name' => 'Ani Wijaya',
            'emergency_contact_phone' => '083456789012',
            'emergency_contact_relation' => 'Nenek',
            'receive_grade_notifications' => true,
            'receive_attendance_notifications' => true,
            'receive_behavior_notifications' => true,
            'receive_announcement_notifications' => true,
        ]);

        // Link students to parent 1 (father)
        $students1 = Student::where('name', 'like', '%')
            ->limit(2)
            ->get();

        foreach ($students1 as $student) {
            $parent1->parentProfile->students()->attach($student->id, [
                'relation' => 'father',
                'is_primary_contact' => true,
                'can_pickup' => true,
                'emergency_contact' => true,
            ]);
        }

        // Create parent user 2
        $parent2 = User::create([
            'name' => 'Rini Wijaya',
            'email' => 'rini.wijaya@gmail.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Assign parent role
        $parent2->assignRole('parent');

        // Create parent profile for user 2
        ParentProfile::create([
            'user_id' => $parent2->id,
            'father_name' => 'Ahmad Suryanto',
            'father_phone' => '081567890123',
            'father_email' => 'ahmad.suryanto@gmail.com',
            'father_occupation' => 'Karyawan Swasta',
            'mother_name' => 'Rini Wijaya',
            'mother_phone' => '082678901234',
            'mother_email' => 'rini.wijaya@gmail.com',
            'mother_occupation' => 'Dokter',
            'address' => 'Jl. Sudirman No. 456, Jakarta Pusat',
            'emergency_contact_name' => 'Hendra Kusuma',
            'emergency_contact_phone' => '083789012345',
            'emergency_contact_relation' => 'Paman',
            'receive_grade_notifications' => true,
            'receive_attendance_notifications' => true,
            'receive_behavior_notifications' => false,
            'receive_announcement_notifications' => true,
        ]);

        // Link students to parent 2
        $students2 = Student::where('name', 'like', '%')
            ->limit(3)
            ->get();

        foreach ($students2 as $student) {
            $parent2->parentProfile->students()->attach($student->id, [
                'relation' => 'mother',
                'is_primary_contact' => true,
                'can_pickup' => true,
                'emergency_contact' => true,
            ]);
        }

        $this->command->info('Parent accounts created successfully!');
        $this->command->info('Parent 1: budi.santoso@gmail.com / password123');
        $this->command->info('Parent 2: rini.wijaya@gmail.com / password123');
    }
}
