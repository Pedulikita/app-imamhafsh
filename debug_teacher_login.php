<?php

require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "=== TEACHER LOGIN DEBUG ===\n\n";

$teacher = User::where('email', 'teacher@imamhafsh.com')->first();

if ($teacher) {
    echo "✅ Teacher account exists\n";
    echo "Email: {$teacher->email}\n";
    echo "Name: {$teacher->name}\n";
    
    // Test password
    $correctPassword = \Illuminate\Support\Facades\Hash::check('password123', $teacher->password);
    echo "Password 'password123': " . ($correctPassword ? "✅ CORRECT" : "❌ WRONG") . "\n";
    
    // Test role
    $hasTeacherRole = $teacher->hasRole('teacher');
    echo "Has teacher role: " . ($hasTeacherRole ? "✅ YES" : "❌ NO") . "\n";
    
    if ($hasTeacherRole) {
        echo "\n🎯 LOGIN SHOULD REDIRECT TO: /teacher/dashboard\n";
    } else {
        echo "\n❌ PROBLEM: Missing teacher role!\n";
    }
} else {
    echo "❌ Teacher account not found!\n";
}

echo "\n" . str_repeat("=", 50) . "\n";