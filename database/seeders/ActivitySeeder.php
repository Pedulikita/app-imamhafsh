<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activities = [
            [
                'title' => 'Halaqah Quran Pagi',
                'image' => 'images/PRESTAS.png',
                'category' => 'Halaqah Quran',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Kegiatan Belajar Mengajar (KBM)',
                'image' => 'images/PRESTASI-2.png',
                'category' => 'KBM',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Ekstrakurikuler Olahraga',
                'image' => 'images/PRESTAS.png',
                'category' => 'Ekstrakurikuler',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Tahfidz Al-Quran Malam',
                'image' => 'images/PRESTASI-2.png',
                'category' => 'Halaqah Quran',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Kajian Bahasa Arab',
                'image' => 'images/PRESTAS.png',
                'category' => 'KBM',
                'order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }
    }
}
