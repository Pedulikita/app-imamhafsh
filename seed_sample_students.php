<?php

require 'vendor/autoload.php';
require 'bootstrap/app.php';

use App\Models\Student;

// Create sample students
$students = [
    [
        'student_id' => 'STU001',
        'name' => 'Ahmad Rizki',
        'email' => 'ahmad.rizki@example.com',
        'birth_date' => '2005-01-15',
        'birth_place' => 'Jakarta',
        'gender' => 'male',
        'address' => 'Jl. Merdeka No. 10, Jakarta',
        'phone' => '08123456789',
        'parent_name' => 'Budi Rizki',
        'parent_phone' => '08987654321',
        'parent_email' => 'budi.rizki@example.com',
        'class' => 'X-A',
        'academic_year' => 2024,
        'enrollment_date' => '2024-07-15',
        'status' => 'active',
        'performance_status' => 'excellent',
        'average_grade' => 88.5,
        'attendance_rate' => 95.0,
        'total_grades' => 8
    ],
    [
        'student_id' => 'STU002',
        'name' => 'Siti Nurhaliza',
        'email' => 'siti.nurhaliza@example.com',
        'birth_date' => '2005-03-22',
        'birth_place' => 'Bandung',
        'gender' => 'female',
        'address' => 'Jl. Sudirman No. 25, Bandung',
        'phone' => '08234567890',
        'parent_name' => 'Ibu Sari',
        'parent_phone' => '08876543210',
        'parent_email' => 'ibu.sari@example.com',
        'class' => 'X-A',
        'academic_year' => 2024,
        'enrollment_date' => '2024-07-15',
        'status' => 'active',
        'performance_status' => 'good',
        'average_grade' => 82.3,
        'attendance_rate' => 88.0,
        'total_grades' => 7
    ],
    [
        'student_id' => 'STU003',
        'name' => 'Dimas Pratama',
        'email' => 'dimas.pratama@example.com',
        'birth_date' => '2005-06-10',
        'birth_place' => 'Surabaya',
        'gender' => 'male',
        'address' => 'Jl. Pemuda No. 33, Surabaya',
        'phone' => '08345678901',
        'parent_name' => 'Pak Andi',
        'parent_phone' => '08765432109',
        'parent_email' => 'pak.andi@example.com',
        'class' => 'X-B',
        'academic_year' => 2024,
        'enrollment_date' => '2024-07-15',
        'status' => 'active',
        'performance_status' => 'satisfactory',
        'average_grade' => 75.8,
        'attendance_rate' => 82.0,
        'total_grades' => 6
    ]
];

foreach ($students as $studentData) {
    try {
        // Check if student already exists
        $existing = Student::where('student_id', $studentData['student_id'])->first();
        if (!$existing) {
            Student::create($studentData);
            echo "Created student: " . $studentData['name'] . "\n";
        } else {
            echo "Student already exists: " . $studentData['name'] . "\n";
        }
    } catch (Exception $e) {
        echo "Error creating student " . $studentData['name'] . ": " . $e->getMessage() . "\n";
    }
}

echo "Sample data seeding completed!\n";
echo "Total students: " . Student::count() . "\n";