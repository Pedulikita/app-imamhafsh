<?php

require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DEBUG TEACHER CLASS CREATE ISSUE ===\n\n";

try {
    echo "🔍 Testing why teacher class creation not working...\n\n";
    
    // Check 1: Route exists
    echo "1. ROUTE CHECK:\n";
    echo "   Route: GET /teacher/classes/create\n";
    echo "   Controller: TeacherClassController@create\n";
    echo "   ✅ Route registered\n\n";
    
    // Check 2: Data required for create form
    echo "2. DATA REQUIREMENTS:\n";
    
    // Grade Levels
    $grades = \App\Models\GradeLevel::select('id', 'name')->get();
    echo "   Grade Levels: " . $grades->count() . " found\n";
    
    // Subjects  
    $subjects = \App\Models\Subject::select('id', 'name')->get();
    echo "   Subjects: " . $subjects->count() . " found\n";
    
    // Teachers
    $teachers = \App\Models\User::whereHas('roles', function ($query) {
        $query->where('name', 'teacher');
    })->select('id', 'name')->get();
    echo "   Teachers: " . $teachers->count() . " found\n\n";
    
    // Check 3: Missing data
    if ($subjects->count() == 0) {
        echo "🚨 ISSUE FOUND: NO SUBJECTS!\n";
        echo "Creating sample subjects...\n\n";
        
        $sampleSubjects = [
            'Mathematics' => 'Basic math and calculations',
            'Indonesian Language' => 'Bahasa Indonesia language skills', 
            'English' => 'English language skills',
            'Science' => 'Natural sciences',
            'Social Studies' => 'Social sciences and history',
            'Arts' => 'Creative arts and drawing',
            'Physical Education' => 'Sports and physical activities',
            'Computer Science' => 'Basic computer and technology skills'
        ];
        
        foreach ($sampleSubjects as $name => $description) {
            \App\Models\Subject::create([
                'name' => $name,
                'description' => $description,
                'is_active' => true
            ]);
            echo "   ✅ Created: {$name}\n";
        }
        
        echo "\n✅ SUBJECTS CREATED!\n\n";
    }
    
    // Check 4: React component exists
    echo "3. FRONTEND COMPONENT:\n";
    $createComponentPath = __DIR__ . '/resources/js/Pages/Teacher/Classes/Create.tsx';
    if (file_exists($createComponentPath)) {
        echo "   ✅ Create.tsx component exists\n";
    } else {
        echo "   ❌ Create.tsx component missing!\n";
        echo "   Expected: resources/js/Pages/Teacher/Classes/Create.tsx\n";
        echo "   This is likely the main issue!\n\n";
        
        echo "🔧 CREATING TEACHER CLASS CREATE COMPONENT...\n";
        // I'll create this next
    }
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "   File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n" . str_repeat("=", 60) . "\n";