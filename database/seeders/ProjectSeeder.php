<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Renovasi Gedung Asrama Santri',
                'subtitle' => 'Pembangunan fasilitas asrama modern untuk kenyamanan santri',
                'image' => 'images/PRESTAS.png',
                'category' => 'Infrastructure',
                'badge' => 'PROJECT',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Perpustakaan Digital Islamic Center',
                'subtitle' => 'Pengembangan perpustakaan digital dengan koleksi ribuan kitab dan buku Islami',
                'image' => 'images/PRESTASI-2.png',
                'category' => 'Education',
                'badge' => 'PROJECT',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Program Beasiswa Tahfidz',
                'subtitle' => 'Beasiswa penuh untuk santri berprestasi dalam program tahfidz Al-Quran',
                'image' => 'images/PRESTAS.png',
                'category' => 'Scholarship',
                'badge' => 'PROJECT',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
