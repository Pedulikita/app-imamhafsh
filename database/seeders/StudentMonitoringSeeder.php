<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Subject;

class StudentMonitoringSeeder extends Seeder
{
    public function run(): void
    {
        // Create subjects
        Subject::create([
            'code' => 'MTK001',
            'name' => 'Matematika',
            'description' => 'Mata pelajaran Matematika untuk kelas VII',
            'credits' => 4,
            'category' => 'Wajib',
            'class_level' => 'VII',
            'semester' => 'both',
            'is_active' => true,
        ]);

        Subject::create([
            'code' => 'IPA001',
            'name' => 'IPA Terpadu',
            'description' => 'Mata pelajaran IPA Terpadu untuk kelas VII',
            'credits' => 4,
            'category' => 'Wajib',
            'class_level' => 'VII',
            'semester' => 'both',
            'is_active' => true,
        ]);

        // Create students
        Student::create([
            'student_id' => 'BQ2025001',
            'name' => 'Ahmad Fauzan',
            'email' => 'ahmad.fauzan@bq.sch.id',
            'birth_date' => '2010-01-15',
            'birth_place' => 'Jakarta',
            'gender' => 'male',
            'address' => 'Jl. Pendidikan No. 123, Jakarta',
            'phone' => '081234567890',
            'parent_name' => 'Bapak Ahmad Sujono',
            'parent_phone' => '081987654321',
            'parent_email' => 'ahmad.sujono@email.com',
            'class' => 'VII A',
            'academic_year' => 2025,
            'enrollment_date' => '2025-07-01',
            'status' => 'active',
        ]);

        Student::create([
            'student_id' => 'BQ2025002',
            'name' => 'Fatimah Azzahra',
            'email' => 'fatimah.azzahra@bq.sch.id',
            'birth_date' => '2010-03-20',
            'birth_place' => 'Bandung',
            'gender' => 'female',
            'address' => 'Jl. Pendidikan No. 456, Bandung',
            'phone' => '081234567891',
            'parent_name' => 'Ibu Siti Aminah',
            'parent_phone' => '081987654322',
            'parent_email' => 'siti.aminah@email.com',
            'class' => 'VII A',
            'academic_year' => 2025,
            'enrollment_date' => '2025-07-01',
            'status' => 'active',
        ]);

        echo "✅ Test data created successfully!\n";
        echo "📚 Subjects: " . Subject::count() . "\n";
        echo "👨‍🎓 Students: " . Student::count() . "\n";
    }
}
