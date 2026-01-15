<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use Carbon\Carbon;

class AdditionalStudentSeeder extends Seeder
{
    public function run()
    {
        $students = [
            [
                'student_id' => 'BQ2025003',
                'name' => 'Siti Aisyah',
                'email' => 'siti.aisyah@gmail.com',
                'birth_date' => '2010-03-15',
                'birth_place' => 'Bandung',
                'gender' => 'female',
                'address' => 'Jl. Merdeka No. 123, Bandung',
                'phone' => '08123456789',
                'parent_name' => 'Budi Aisyah',
                'parent_phone' => '08234567890',
                'parent_email' => 'budi.aisyah@gmail.com',
                'class' => 'VII B',
                'academic_year' => 2025,
                'enrollment_date' => '2025-07-15',
                'status' => 'active',
            ],
            [
                'student_id' => 'BQ2025004',
                'name' => 'Muhammad Rizki',
                'email' => 'rizki.muhammad@gmail.com',
                'birth_date' => '2009-08-22',
                'birth_place' => 'Jakarta',
                'gender' => 'male',
                'address' => 'Jl. Sudirman No. 456, Jakarta',
                'phone' => '08345678901',
                'parent_name' => 'Ahmad Rizki',
                'parent_phone' => '08456789012',
                'parent_email' => 'ahmad.rizki@gmail.com',
                'class' => 'VIII A',
                'academic_year' => 2025,
                'enrollment_date' => '2024-07-15',
                'status' => 'active',
            ],
            [
                'student_id' => 'BQ2025005',
                'name' => 'Dewi Sartika',
                'email' => 'dewi.sartika@gmail.com',
                'birth_date' => '2008-12-10',
                'birth_place' => 'Surabaya',
                'gender' => 'female',
                'address' => 'Jl. Pahlawan No. 789, Surabaya',
                'phone' => '08567890123',
                'parent_name' => 'Indra Sartika',
                'parent_phone' => '08678901234',
                'parent_email' => 'indra.sartika@gmail.com',
                'class' => 'IX A',
                'academic_year' => 2025,
                'enrollment_date' => '2023-07-15',
                'status' => 'active',
            ],
            [
                'student_id' => 'BQ2024001',
                'name' => 'Alex Pratama',
                'email' => null,
                'birth_date' => '2007-05-30',
                'birth_place' => 'Medan',
                'gender' => 'male',
                'address' => 'Jl. Garuda No. 321, Medan',
                'phone' => null,
                'parent_name' => 'Benny Pratama',
                'parent_phone' => '08789012345',
                'parent_email' => 'benny.pratama@gmail.com',
                'class' => 'IX B',
                'academic_year' => 2024,
                'enrollment_date' => '2023-07-15',
                'status' => 'graduated',
            ],
            [
                'student_id' => 'BQ2025006',
                'name' => 'Nanda Putri',
                'email' => 'nanda.putri@gmail.com',
                'birth_date' => '2010-11-08',
                'birth_place' => 'Yogyakarta',
                'gender' => 'female',
                'address' => 'Jl. Malioboro No. 654, Yogyakarta',
                'phone' => '08890123456',
                'parent_name' => 'Eko Putri',
                'parent_phone' => '08901234567',
                'parent_email' => 'eko.putri@gmail.com',
                'class' => 'VII A',
                'academic_year' => 2025,
                'enrollment_date' => '2025-07-15',
                'status' => 'active',
            ],
            [
                'student_id' => 'BQ2025007',
                'name' => 'Rudi Hartono',
                'email' => 'rudi.hartono@gmail.com',
                'birth_date' => '2009-04-18',
                'birth_place' => 'Semarang',
                'gender' => 'male',
                'address' => 'Jl. Pemuda No. 987, Semarang',
                'phone' => '08012345678',
                'parent_name' => 'Hadi Hartono',
                'parent_phone' => '08123456780',
                'parent_email' => 'hadi.hartono@gmail.com',
                'class' => 'VIII B',
                'academic_year' => 2025,
                'enrollment_date' => '2024-07-15',
                'status' => 'inactive',
            ]
        ];

        foreach ($students as $student) {
            Student::create($student);
        }
    }
}