<?php

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\StudentClass;
use App\Models\User;
use Carbon\Carbon;

class StudentManagementSeeder extends Seeder
{
    public function run()
    {
        // Create sample classes
        $classes = [
            [
                'name' => 'Kelas X IPA 1',
                'description' => 'Kelas X Ilmu Pengetahuan Alam semester 1',
                'academic_year' => 2024,
                'max_students' => 30,
                'status' => 'active',
            ],
            [
                'name' => 'Kelas X IPS 1', 
                'description' => 'Kelas X Ilmu Pengetahuan Sosial semester 1',
                'academic_year' => 2024,
                'max_students' => 28,
                'status' => 'active',
            ],
            [
                'name' => 'Kelas XI IPA 1',
                'description' => 'Kelas XI Ilmu Pengetahuan Alam semester 1',
                'academic_year' => 2024,
                'max_students' => 32,
                'status' => 'active',
            ]
        ];

        $createdClasses = [];
        foreach ($classes as $classData) {
            $createdClasses[] = StudentClass::create($classData);
        }

        // Create sample students
        $students = [
            [
                'name' => 'Ahmad Riski Pratama',
                'email' => 'ahmad.riski@student.school.com',
                'phone' => '081234567890',
                'student_id' => 'STD001',
                'nis' => 'NIS001',
                'nisn' => 'NISN001',
                'gender' => 'male',
                'birth_date' => '2008-05-15',
                'birth_place' => 'Jakarta',
                'address' => 'Jl. Merdeka No. 123, Jakarta',
                'parent_name' => 'Budi Pratama',
                'parent_phone' => '081234567891',
                'parent_email' => 'budi.pratama@gmail.com',
                'emergency_contact' => 'Siti Pratama',
                'emergency_phone' => '081234567892',
                'class_id' => $createdClasses[0]->id,
                'academic_year' => 2024,
                'enrollment_date' => '2024-07-15',
                'status' => 'active',
                'religion' => 'Islam',
                'blood_type' => 'A',
            ],
            [
                'name' => 'Sari Indah Pertiwi',
                'email' => 'sari.indah@student.school.com',
                'phone' => '081234567893',
                'student_id' => 'STD002',
                'nis' => 'NIS002',
                'nisn' => 'NISN002',
                'gender' => 'female',
                'birth_date' => '2008-03-22',
                'birth_place' => 'Bandung',
                'address' => 'Jl. Sudirman No. 456, Bandung',
                'parent_name' => 'Agus Pertiwi',
                'parent_phone' => '081234567894',
                'parent_email' => 'agus.pertiwi@gmail.com',
                'emergency_contact' => 'Rina Pertiwi',
                'emergency_phone' => '081234567895',
                'class_id' => $createdClasses[0]->id,
                'academic_year' => 2024,
                'enrollment_date' => '2024-07-15',
                'status' => 'active',
                'religion' => 'Islam',
                'blood_type' => 'B',
            ],
            [
                'name' => 'Mohammad Fajar Sidiq',
                'email' => 'fajar.sidiq@student.school.com',
                'phone' => '081234567896',
                'student_id' => 'STD003',
                'nis' => 'NIS003',
                'nisn' => 'NISN003',
                'gender' => 'male',
                'birth_date' => '2008-08-10',
                'birth_place' => 'Surabaya',
                'address' => 'Jl. Diponegoro No. 789, Surabaya',
                'parent_name' => 'Hendra Sidiq',
                'parent_phone' => '081234567897',
                'parent_email' => 'hendra.sidiq@gmail.com',
                'emergency_contact' => 'Dewi Sidiq',
                'emergency_phone' => '081234567898',
                'class_id' => $createdClasses[1]->id,
                'academic_year' => 2024,
                'enrollment_date' => '2024-07-15',
                'status' => 'active',
                'religion' => 'Islam',
                'blood_type' => 'O',
            ],
            [
                'name' => 'Putri Ayu Lestari',
                'email' => 'putri.ayu@student.school.com',
                'phone' => '081234567899',
                'student_id' => 'STD004',
                'nis' => 'NIS004',
                'nisn' => 'NISN004',
                'gender' => 'female',
                'birth_date' => '2007-12-05',
                'birth_place' => 'Yogyakarta',
                'address' => 'Jl. Malioboro No. 321, Yogyakarta',
                'parent_name' => 'Bambang Lestari',
                'parent_phone' => '081234567900',
                'parent_email' => 'bambang.lestari@gmail.com',
                'emergency_contact' => 'Sri Lestari',
                'emergency_phone' => '081234567901',
                'class_id' => $createdClasses[2]->id,
                'academic_year' => 2024,
                'enrollment_date' => '2024-07-15',
                'status' => 'active',
                'religion' => 'Kristen',
                'blood_type' => 'AB',
            ],
            [
                'name' => 'Rizky Hakim Naufal',
                'email' => 'rizky.hakim@student.school.com',
                'phone' => '081234567902',
                'student_id' => 'STD005',
                'nis' => 'NIS005',
                'nisn' => 'NISN005',
                'gender' => 'male',
                'birth_date' => '2008-01-18',
                'birth_place' => 'Medan',
                'address' => 'Jl. Ahmad Yani No. 654, Medan',
                'parent_name' => 'Irwan Naufal',
                'parent_phone' => '081234567903',
                'parent_email' => 'irwan.naufal@gmail.com',
                'emergency_contact' => 'Maya Naufal',
                'emergency_phone' => '081234567904',
                'class_id' => null, // Student without class
                'academic_year' => 2024,
                'enrollment_date' => '2024-07-15',
                'status' => 'active',
                'religion' => 'Islam',
                'blood_type' => 'A',
            ]
        ];

        foreach ($students as $studentData) {
            Student::create($studentData);
        }

        echo "Student Management System seeder completed!\n";
        echo "Created " . count($createdClasses) . " classes and " . count($students) . " students.\n";
    }
}