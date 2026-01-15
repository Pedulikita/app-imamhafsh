<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\ParentProfile;
use App\Models\Student;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateParent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:parent
                            {email : Email orang tua}
                            {password : Password untuk login}
                            {--name= : Nama orang tua}
                            {--father-name= : Nama ayah}
                            {--mother-name= : Nama ibu}
                            {--father-phone= : Nomor ayah}
                            {--mother-phone= : Nomor ibu}
                            {--address= : Alamat}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new parent account with profile';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');
        $password = $this->argument('password');
        $name = $this->option('name') ?? explode('@', $email)[0];

        // Check if email exists
        if (User::where('email', $email)->exists()) {
            $this->error("Email {$email} sudah terdaftar!");
            return 1;
        }

        // Create user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        // Assign parent role
        $user->assignRole('parent');

        // Create parent profile
        $parentProfile = ParentProfile::create([
            'user_id' => $user->id,
            'father_name' => $this->option('father-name') ?? 'Ayah',
            'mother_name' => $this->option('mother-name') ?? 'Ibu',
            'father_phone' => $this->option('father-phone') ?? '',
            'mother_phone' => $this->option('mother-phone') ?? '',
            'address' => $this->option('address') ?? '',
            'receive_grade_notifications' => true,
            'receive_attendance_notifications' => true,
            'receive_behavior_notifications' => true,
            'receive_announcement_notifications' => true,
        ]);

        $this->info("✅ Parent account created successfully!");
        $this->line("Email: {$email}");
        $this->line("Password: {$password}");
        $this->line("ID: {$user->id}");

        // Ask to link students
        if ($this->confirm('Link dengan student sekarang?')) {
            $this->linkStudents($parentProfile);
        }

        return 0;
    }

    protected function linkStudents(ParentProfile $parentProfile)
    {
        $students = Student::all();

        if ($students->isEmpty()) {
            $this->error('Tidak ada student di database');
            return;
        }

        $this->info('Daftar Student:');
        foreach ($students as $student) {
            $this->line("{$student->id}. {$student->name} - Kelas {$student->class?->name}");
        }

        $studentIds = $this->ask('Masukkan ID student (pisahkan dengan koma)');
        $ids = array_map('trim', explode(',', $studentIds));

        $relation = $this->choice('Hubungan dengan student:', ['father', 'mother', 'guardian'], 0);

        foreach ($ids as $id) {
            if (is_numeric($id)) {
                $parentProfile->students()->attach($id, [
                    'relation' => $relation,
                    'is_primary_contact' => true,
                    'can_pickup' => true,
                ]);
                $this->info("✓ Student {$id} linked");
            }
        }
    }
}
