<?php

use App\Models\Student;

// Sample student data for testing
$students = [
    [
        'student_id' => '2024001',
        'name' => 'Ahmad Rizki Pratama',
        'email' => '2024001@student.local',
        'birth_date' => '2010-01-15',
        'birth_place' => 'Jakarta',
        'gender' => 'male',
        'address' => 'Jl. Merdeka No. 123, Jakarta Selatan',
        'phone' => '081234567890',
        'parent_name' => 'Bambang Pratama',
        'parent_phone' => '081234567891',
        'parent_email' => 'bambang.pratama@email.com',
        'class' => '10A',
        'academic_year' => 2024,
        'enrollment_date' => '2024-07-01',
        'status' => 'active'
    ],
    [
        'student_id' => '2024002',
        'name' => 'Siti Nurhaliza',
        'email' => '2024002@student.local',
        'birth_date' => '2010-03-20',
        'birth_place' => 'Bandung',
        'gender' => 'female',
        'address' => 'Jl. Sudirman No. 456, Bandung',
        'phone' => '081234567892',
        'parent_name' => 'Dedi Mulyadi',
        'parent_phone' => '081234567893',
        'parent_email' => 'dedi.mulyadi@email.com',
        'class' => '10A',
        'academic_year' => 2024,
        'enrollment_date' => '2024-07-01',
        'status' => 'active'
    ],
    [
        'student_id' => '2024003',
        'name' => 'Muhammad Farel',
        'email' => '2024003@student.local',
        'birth_date' => '2009-12-10',
        'birth_place' => 'Surabaya',
        'gender' => 'male',
        'address' => 'Jl. Diponegoro No. 789, Surabaya',
        'phone' => '081234567894',
        'parent_name' => 'Indra Wijaya',
        'parent_phone' => '081234567895',
        'parent_email' => 'indra.wijaya@email.com',
        'class' => '11B',
        'academic_year' => 2024,
        'enrollment_date' => '2024-07-01',
        'status' => 'active'
    ],
    [
        'student_id' => '2024004',
        'name' => 'Dewi Permata Sari',
        'email' => '2024004@student.local',
        'birth_date' => '2009-08-05',
        'birth_place' => 'Medan',
        'gender' => 'female',
        'address' => 'Jl. Ahmad Yani No. 321, Medan',
        'phone' => '081234567896',
        'parent_name' => 'Rudi Santoso',
        'parent_phone' => '081234567897',
        'parent_email' => 'rudi.santoso@email.com',
        'class' => '12C',
        'academic_year' => 2024,
        'enrollment_date' => '2024-07-01',
        'status' => 'active'
    ]
];

echo "Creating sample students...\n";

foreach ($students as $studentData) {
    $student = Student::create($studentData);
    echo "Created student: {$student->name} (ID: {$student->student_id}, Class: {$student->class})\n";
}

echo "Sample students created successfully!\n";
echo "\nLogin credentials:\n";
echo "Class: 10A, ID: 2024001 (Ahmad Rizki Pratama)\n";
echo "Class: 10A, ID: 2024002 (Siti Nurhaliza)\n";
echo "Class: 11B, ID: 2024003 (Muhammad Farel)\n";
echo "Class: 12C, ID: 2024004 (Dewi Permata Sari)\n";