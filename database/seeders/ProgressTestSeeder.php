<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Grade;
use App\Models\Attendance;
use Carbon\Carbon;

class ProgressTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing test data
        Grade::truncate();
        Attendance::truncate();
        
        // Get existing student and subject
        $student = Student::first();
        $subjects = Subject::take(2)->get();
        
        if (!$student || $subjects->isEmpty()) {
            $this->command->info('No students or subjects found. Running base seeder...');
            $this->call(StudentMonitoringSeeder::class);
            
            $student = Student::first();
            $subjects = Subject::take(2)->get();
        }
        
        $currentYear = Carbon::now()->year;
        
        // Create grades data
        $examTypes = ['Quiz', 'UTS', 'UAS', 'Tugas'];
        
        foreach ($subjects as $subject) {
            foreach ($examTypes as $type) {
                Grade::create([
                    'student_id' => $student->id,
                    'subject_id' => $subject->id,
                    'exam_type' => $type,
                    'score' => fake()->randomFloat(1, 70, 95),
                    'exam_date' => Carbon::now()->subDays(fake()->numberBetween(1, 30)),
                    'semester' => 'ganjil',
                    'academic_year' => $currentYear,
                    'grade_letter' => 'A',
                    'notes' => 'Test grade for ' . $type,
                ]);
            }
        }
        
        // Create attendance data for last 30 days
        for ($i = 30; $i >= 1; $i--) {
            $date = Carbon::now()->subDays($i);
            
            // Skip weekends
            if ($date->isWeekend()) {
                continue;
            }
            
            foreach ($subjects as $subject) {
                $status = fake()->randomElement(['present', 'present', 'present', 'late', 'absent']);
                
                Attendance::create([
                    'student_id' => $student->id,
                    'subject_id' => $subject->id,
                    'date' => $date,
                    'status' => $status,
                    'time_in' => $status !== 'absent' ? '08:00:00' : null,
                    'time_out' => $status === 'present' ? '16:00:00' : null,
                    'semester' => 'ganjil',
                    'academic_year' => $currentYear,
                    'notes' => 'Generated attendance for testing',
                ]);
            }
        }
        
        $this->command->info('Progress test data created successfully!');
        $this->command->info('Grades created: ' . Grade::count());
        $this->command->info('Attendances created: ' . Attendance::count());
    }
}
