<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BehaviorCategory;

class BehaviorCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Positive Behaviors
            [
                'name' => 'academic_excellence',
                'display_name' => 'Prestasi Akademik',
                'color' => '#10B981',
                'icon' => 'Trophy',
                'description' => 'Pencapaian yang luar biasa dalam bidang akademik',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'leadership',
                'display_name' => 'Kepemimpinan',
                'color' => '#3B82F6',
                'icon' => 'Crown',
                'description' => 'Menunjukkan kualitas kepemimpinan yang baik',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'teamwork',
                'display_name' => 'Kerjasama Tim',
                'color' => '#8B5CF6',
                'icon' => 'Users',
                'description' => 'Bekerja sama dengan baik dalam kelompok',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'responsibility',
                'display_name' => 'Tanggung Jawab',
                'color' => '#10B981',
                'icon' => 'Shield',
                'description' => 'Menunjukkan sikap bertanggung jawab',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'helpfulness',
                'display_name' => 'Suka Menolong',
                'color' => '#F59E0B',
                'icon' => 'Heart',
                'description' => 'Membantu teman atau guru dengan sukarela',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'creativity',
                'display_name' => 'Kreativitas',
                'color' => '#EC4899',
                'icon' => 'Lightbulb',
                'description' => 'Menunjukkan ide-ide kreatif dan inovatif',
                'is_active' => true,
                'sort_order' => 6,
            ],

            // Negative Behaviors
            [
                'name' => 'tardiness',
                'display_name' => 'Keterlambatan',
                'color' => '#F59E0B',
                'icon' => 'Clock',
                'description' => 'Terlambat masuk kelas atau aktivitas sekolah',
                'is_active' => true,
                'sort_order' => 10,
            ],
            [
                'name' => 'absence',
                'display_name' => 'Absensi',
                'color' => '#EF4444',
                'icon' => 'UserX',
                'description' => 'Tidak hadir tanpa keterangan yang jelas',
                'is_active' => true,
                'sort_order' => 11,
            ],
            [
                'name' => 'incomplete_assignment',
                'display_name' => 'Tugas Tidak Lengkap',
                'color' => '#F59E0B',
                'icon' => 'FileX',
                'description' => 'Tidak menyelesaikan tugas yang diberikan',
                'is_active' => true,
                'sort_order' => 12,
            ],
            [
                'name' => 'disruptive_behavior',
                'display_name' => 'Perilaku Mengganggu',
                'color' => '#EF4444',
                'icon' => 'AlertTriangle',
                'description' => 'Mengganggu kelas atau aktivitas belajar',
                'is_active' => true,
                'sort_order' => 13,
            ],
            [
                'name' => 'inappropriate_language',
                'display_name' => 'Bahasa Tidak Pantas',
                'color' => '#DC2626',
                'icon' => 'MessageSquareX',
                'description' => 'Menggunakan bahasa yang tidak sopan',
                'is_active' => true,
                'sort_order' => 14,
            ],
            [
                'name' => 'bullying',
                'display_name' => 'Perundungan',
                'color' => '#DC2626',
                'icon' => 'UserMinus',
                'description' => 'Melakukan intimidasi atau perundungan',
                'is_active' => true,
                'sort_order' => 15,
            ],
            [
                'name' => 'cheating',
                'display_name' => 'Kecurangan',
                'color' => '#DC2626',
                'icon' => 'Eye',
                'description' => 'Menyontek atau melakukan kecurangan akademik',
                'is_active' => true,
                'sort_order' => 16,
            ],
            [
                'name' => 'property_damage',
                'display_name' => 'Kerusakan Properti',
                'color' => '#DC2626',
                'icon' => 'AlertCircle',
                'description' => 'Merusak fasilitas atau properti sekolah',
                'is_active' => true,
                'sort_order' => 17,
            ],

            // Neutral/Observation Behaviors
            [
                'name' => 'social_interaction',
                'display_name' => 'Interaksi Sosial',
                'color' => '#6B7280',
                'icon' => 'Users',
                'description' => 'Observasi cara berinteraksi dengan orang lain',
                'is_active' => true,
                'sort_order' => 20,
            ],
            [
                'name' => 'learning_style',
                'display_name' => 'Gaya Belajar',
                'color' => '#6B7280',
                'icon' => 'Book',
                'description' => 'Observasi preferensi dan gaya belajar siswa',
                'is_active' => true,
                'sort_order' => 21,
            ],
            [
                'name' => 'emotional_state',
                'display_name' => 'Kondisi Emosional',
                'color' => '#6B7280',
                'icon' => 'Heart',
                'description' => 'Observasi kondisi emosional siswa',
                'is_active' => true,
                'sort_order' => 22,
            ],
            [
                'name' => 'participation',
                'display_name' => 'Partisipasi Kelas',
                'color' => '#6B7280',
                'icon' => 'Hand',
                'description' => 'Tingkat partisipasi dalam aktivitas kelas',
                'is_active' => true,
                'sort_order' => 23,
            ],
        ];

        foreach ($categories as $category) {
            BehaviorCategory::updateOrCreate(
                ['name' => $category['name']], 
                $category
            );
        }
    }
}
