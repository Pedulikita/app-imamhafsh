<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Role;

echo "=== TEACHER DEMO LOGIN INFO ===\n\n";

try {
    // Check teacher users
    echo "👨‍🏫 TEACHER DEMO ACCOUNTS:\n";
    echo str_repeat("-", 40) . "\n";
    
    $teacherUsers = User::whereHas('roles', function($query) {
        $query->where('name', 'teacher');
    })->with('roles.permissions')->get();
    
    if ($teacherUsers->count() > 0) {
        foreach ($teacherUsers as $teacher) {
            echo "✅ TEACHER DEMO TERSEDIA:\n";
            echo "  Nama: {$teacher->name}\n";
            echo "  Email: {$teacher->email}\n";
            echo "  Password: password123\n";
            echo "  Status: " . ($teacher->email_verified_at ? 'Verified' : 'Not Verified') . "\n";
            echo "  Role: " . $teacher->roles->pluck('display_name')->implode(', ') . "\n";
            echo "  Total Permissions: " . $teacher->getAllPermissions()->count() . "\n";
            
            echo "\n  🔐 Teacher Permissions:\n";
            foreach ($teacher->getAllPermissions() as $permission) {
                echo "    - {$permission->display_name}\n";
            }
            echo "\n";
        }
        
        echo "🌐 CARA LOGIN TEACHER:\n";
        echo "  1. Start server: php artisan serve\n";
        echo "  2. Buka: http://localhost:8000/login\n";
        echo "  3. Gunakan kredensial teacher di atas\n\n";
        
        echo "📚 FITUR YANG BISA DIAKSES TEACHER:\n";
        echo "  • Dashboard Teacher: /teacher/classes\n";
        echo "  • Kelola Kelas: /teacher/classes/create\n";
        echo "  • Presensi Siswa: /teacher/classes/{id}/attendance\n";
        echo "  • Laporan Kelas: /teacher/classes/{id}/report\n";
        echo "  • Manajemen Siswa dalam Kelas\n";
        echo "  • Input dan Kelola Nilai\n";
        echo "  • Generate Progress Reports\n\n";
        
    } else {
        echo "❌ TIDAK ADA TEACHER DEMO!\n";
        echo "Mari buat teacher demo...\n\n";
        
        // Create teacher demo if not exists
        $teacherRole = Role::where('name', 'teacher')->first();
        if ($teacherRole) {
            $demoTeacher = User::create([
                'name' => 'Teacher Demo',
                'email' => 'teacher@imamhafsh.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password123')
            ]);
            
            $demoTeacher->roles()->attach($teacherRole->id);
            
            echo "✅ Teacher Demo berhasil dibuat!\n";
            echo "  Email: teacher@imamhafsh.com\n";
            echo "  Password: password123\n";
        }
    }
    
    // Also show admin info for comparison
    echo "👤 ADMIN LOGIN (untuk perbandingan):\n";
    echo "  Email: admin@imamhafsh.com\n";
    echo "  Password: admin123\n\n";
    
    echo "🎯 PERBEDAAN AKSES:\n";
    echo "  • ADMIN: Full access ke semua fitur sistem\n";
    echo "  • TEACHER: Hanya akses ke class management & monitoring\n\n";
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}

echo str_repeat("=", 60) . "\n";