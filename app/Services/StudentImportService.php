<?php

namespace App\Services;

use App\Models\Student;
use App\Models\StudentClass;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;

class StudentImportService
{
    public function importStudents(array $studentsData): array
    {
        $imported = 0;
        $skipped = 0;
        $errors = [];

        DB::beginTransaction();

        try {
            foreach ($studentsData as $index => $studentData) {
                try {
                    $result = $this->processStudentImport($studentData, $index + 1);
                    
                    if ($result['success']) {
                        $imported++;
                    } else {
                        $skipped++;
                        $errors[] = "Row {$result['row']}: {$result['error']}";
                    }
                } catch (\Exception $e) {
                    $skipped++;
                    $errors[] = "Row " . ($index + 1) . ": " . $e->getMessage();
                    Log::error('Student import error', [
                        'row' => $index + 1,
                        'data' => $studentData,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            DB::commit();

            return [
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors
            ];
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    private function processStudentImport(array $data, int $rowNumber): array
    {
        // Check for existing student with same student_id
        if (Student::where('student_id', $data['student_id'])->exists()) {
            return [
                'success' => false,
                'row' => $rowNumber,
                'error' => "Student ID {$data['student_id']} already exists"
            ];
        }

        // Check for existing email if provided
        if (!empty($data['email']) && Student::where('email', $data['email'])->exists()) {
            return [
                'success' => false,
                'row' => $rowNumber,
                'error' => "Email {$data['email']} already exists"
            ];
        }

        // Check for existing NIS if provided
        if (!empty($data['nis']) && Student::where('nis', $data['nis'])->exists()) {
            return [
                'success' => false,
                'row' => $rowNumber,
                'error' => "NIS {$data['nis']} already exists"
            ];
        }

        // Check for existing NISN if provided
        if (!empty($data['nisn']) && Student::where('nisn', $data['nisn'])->exists()) {
            return [
                'success' => false,
                'row' => $rowNumber,
                'error' => "NISN {$data['nisn']} already exists"
            ];
        }

        // Find class if class_name is provided
        $classId = null;
        if (!empty($data['class_name'])) {
            $class = StudentClass::where('name', $data['class_name'])
                                ->where('academic_year', $data['academic_year'])
                                ->first();
            
            if (!$class) {
                return [
                    'success' => false,
                    'row' => $rowNumber,
                    'error' => "Class {$data['class_name']} not found for academic year {$data['academic_year']}"
                ];
            }
            
            if (!$class->canEnrollStudent()) {
                return [
                    'success' => false,
                    'row' => $rowNumber,
                    'error' => "Class {$data['class_name']} is full"
                ];
            }
            
            $classId = $class->id;
        }

        // Prepare student data
        $studentData = [
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $this->cleanPhoneNumber($data['phone'] ?? null),
            'student_id' => $data['student_id'],
            'nis' => $data['nis'] ?? null,
            'nisn' => $data['nisn'] ?? null,
            'gender' => $data['gender'],
            'birth_date' => !empty($data['birth_date']) ? date('Y-m-d', strtotime($data['birth_date'])) : null,
            'birth_place' => $data['birth_place'] ?? null,
            'address' => $data['address'] ?? null,
            'parent_name' => $data['parent_name'] ?? null,
            'parent_phone' => $this->cleanPhoneNumber($data['parent_phone'] ?? null),
            'parent_email' => $data['parent_email'] ?? null,
            'class_id' => $classId,
            'academic_year' => $data['academic_year'],
            'enrollment_date' => now()->toDateString(),
            'status' => 'active'
        ];

        // Create student
        $student = Student::create($studentData);

        // Enroll in class if applicable
        if ($classId) {
            $class = StudentClass::find($classId);
            $class->enrollStudent($student);
        }

        return [
            'success' => true,
            'row' => $rowNumber,
            'student_id' => $student->id
        ];
    }

    private function cleanPhoneNumber(?string $phone): ?string
    {
        if (!$phone) {
            return null;
        }
        
        return preg_replace('/[^0-9+]/', '', $phone);
    }

    public function validateImportData(array $studentsData): array
    {
        $errors = [];
        $warnings = [];
        $studentIds = [];
        $emails = [];
        $nisNumbers = [];
        $nisnNumbers = [];

        foreach ($studentsData as $index => $data) {
            $row = $index + 1;
            
            // Required field validation
            if (empty($data['name'])) {
                $errors[] = "Row {$row}: Name is required";
            }
            
            if (empty($data['student_id'])) {
                $errors[] = "Row {$row}: Student ID is required";
            } else {
                // Check for duplicates within import
                if (in_array($data['student_id'], $studentIds)) {
                    $errors[] = "Row {$row}: Duplicate Student ID {$data['student_id']} in import";
                } else {
                    $studentIds[] = $data['student_id'];
                    
                    // Check if exists in database
                    if (Student::where('student_id', $data['student_id'])->exists()) {
                        $warnings[] = "Row {$row}: Student ID {$data['student_id']} already exists in database";
                    }
                }
            }
            
            if (empty($data['gender']) || !in_array($data['gender'], ['male', 'female'])) {
                $errors[] = "Row {$row}: Valid gender (male/female) is required";
            }
            
            if (empty($data['academic_year']) || !is_numeric($data['academic_year'])) {
                $errors[] = "Row {$row}: Valid academic year is required";
            }
            
            // Email validation
            if (!empty($data['email'])) {
                if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                    $errors[] = "Row {$row}: Invalid email format";
                } else {
                    if (in_array($data['email'], $emails)) {
                        $errors[] = "Row {$row}: Duplicate email {$data['email']} in import";
                    } else {
                        $emails[] = $data['email'];
                        
                        if (Student::where('email', $data['email'])->exists()) {
                            $warnings[] = "Row {$row}: Email {$data['email']} already exists in database";
                        }
                    }
                }
            }
            
            // NIS validation
            if (!empty($data['nis'])) {
                if (in_array($data['nis'], $nisNumbers)) {
                    $errors[] = "Row {$row}: Duplicate NIS {$data['nis']} in import";
                } else {
                    $nisNumbers[] = $data['nis'];
                    
                    if (Student::where('nis', $data['nis'])->exists()) {
                        $warnings[] = "Row {$row}: NIS {$data['nis']} already exists in database";
                    }
                }
            }
            
            // NISN validation
            if (!empty($data['nisn'])) {
                if (in_array($data['nisn'], $nisnNumbers)) {
                    $errors[] = "Row {$row}: Duplicate NISN {$data['nisn']} in import";
                } else {
                    $nisnNumbers[] = $data['nisn'];
                    
                    if (Student::where('nisn', $data['nisn'])->exists()) {
                        $warnings[] = "Row {$row}: NISN {$data['nisn']} already exists in database";
                    }
                }
            }
            
            // Class validation
            if (!empty($data['class_name'])) {
                $class = StudentClass::where('name', $data['class_name'])
                                    ->where('academic_year', $data['academic_year'])
                                    ->first();
                
                if (!$class) {
                    $errors[] = "Row {$row}: Class {$data['class_name']} not found for academic year {$data['academic_year']}";
                } elseif (!$class->canEnrollStudent()) {
                    $warnings[] = "Row {$row}: Class {$data['class_name']} is full";
                }
            }
        }

        return [
            'errors' => $errors,
            'warnings' => $warnings,
            'valid' => empty($errors)
        ];
    }
}