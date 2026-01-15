<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            [
                'title' => 'Juara 1 Lomba Hafalan Al-Quran Tingkat Nasional',
                'image' => 'images/PRESTAS.png',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Juara 2 Olimpiade Sains Nasional (OSN) Matematika',
                'image' => 'images/Prestasi-Siswa-SMP-BQ-Islamic-Boarding-School-Kota-Bogor1-768x768.png',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Juara 1 Lomba Bahasa Arab Tingkat Provinsi',
                'image' => 'images/PRESTAS.png',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Juara 3 Lomba Kaligrafi Internasional',
                'image' => 'images/Prestasi-Siswa-SMP-BQ-Islamic-Boarding-School-Kota-Bogor2-768x768.png',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Juara Umum MTQ Tingkat Kabupaten',
                'image' => 'images/PRESTAS.png',
                'order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::create($achievement);
        }
    }
}
