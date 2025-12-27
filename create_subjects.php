<?php

require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CREATING SUBJECTS WITH PROPER CODES ===\n\n";

try {
    echo "🔧 Creating subjects with all required fields...\n\n";
    
    $subjects = [
        ['code' => 'MATH', 'name' => 'Mathematics', 'description' => 'Basic mathematics and calculations', 'credits' => 4, 'category' => 'Core'],
        ['code' => 'INA', 'name' => 'Indonesian Language', 'description' => 'Bahasa Indonesia language skills', 'credits' => 4, 'category' => 'Core'],
        ['code' => 'ENG', 'name' => 'English', 'description' => 'English language skills', 'credits' => 3, 'category' => 'Core'],
        ['code' => 'SCI', 'name' => 'Science', 'description' => 'Natural sciences', 'credits' => 3, 'category' => 'Core'],
        ['code' => 'SOC', 'name' => 'Social Studies', 'description' => 'Social sciences and history', 'credits' => 3, 'category' => 'Core'],
        ['code' => 'ART', 'name' => 'Arts', 'description' => 'Creative arts and drawing', 'credits' => 2, 'category' => 'Elective'],
        ['code' => 'PE', 'name' => 'Physical Education', 'description' => 'Sports and physical activities', 'credits' => 2, 'category' => 'Core'],
        ['code' => 'CS', 'name' => 'Computer Science', 'description' => 'Basic computer and technology skills', 'credits' => 2, 'category' => 'Elective'],
    ];
    
    foreach ($subjects as $subjectData) {
        $subject = \App\Models\Subject::create([
            'code' => $subjectData['code'],
            'name' => $subjectData['name'],
            'description' => $subjectData['description'],
            'credits' => $subjectData['credits'],
            'category' => $subjectData['category'],
            'class_level' => 'All',
            'semester' => 'Both',
            'is_active' => true
        ]);
        echo "   ✅ Created: {$subject->code} - {$subject->name}\n";
    }
    
    echo "\n✅ ALL SUBJECTS CREATED!\n\n";
    
    // Now test the teacher create method data
    echo "🧪 Testing TeacherClassController create method data...\n";
    $grades = \App\Models\GradeLevel::active()->orderByLevel()->select('id', 'name')->get();
    $subjects = \App\Models\Subject::select('id', 'name')->get();
    $teachers = \App\Models\User::whereHas('roles', function ($query) {
        $query->where('name', 'teacher');
    })->select('id', 'name')->get();
    
    echo "   ✅ Grade Levels: " . $grades->count() . "\n";
    echo "   ✅ Subjects: " . $subjects->count() . "\n";
    echo "   ✅ Teachers: " . $teachers->count() . "\n\n";
    
    echo "🎯 DATA READY FOR TEACHER CLASS CREATE!\n";
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "   File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n" . str_repeat("=", 60) . "\n";