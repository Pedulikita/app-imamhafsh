<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Seeder;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facilities = [
            // Eksterior
            ['title' => 'Gerbang Utama', 'image' => '/images/PRESTAS.png', 'category' => 'Eksterior', 'is_active' => true],
            ['title' => 'Gedung Utama', 'image' => '/images/PRESTAS.png', 'category' => 'Eksterior', 'is_active' => true],
            ['title' => 'Area Hijau', 'image' => '/images/PRESTAS.png', 'category' => 'Eksterior', 'is_active' => true],

            // Asrama
            ['title' => 'Asrama Putra', 'image' => '/images/PRESTAS.png', 'category' => 'Asrama', 'is_active' => true],
            ['title' => 'Asrama Putri', 'image' => '/images/PRESTAS.png', 'category' => 'Asrama', 'is_active' => true],

            // Kelas & Office
            ['title' => 'Ruang Kelas', 'image' => '/images/PRESTAS.png', 'category' => 'Kelas & Office', 'is_active' => true],
            ['title' => 'Ruang Guru', 'image' => '/images/PRESTAS.png', 'category' => 'Kelas & Office', 'is_active' => true],

            // BQ Mart & Resto
            ['title' => 'BQ Mart', 'image' => '/images/PRESTAS.png', 'category' => 'BQ Mart & Resto', 'is_active' => true],
            ['title' => 'Resto Santri', 'image' => '/images/PRESTAS.png', 'category' => 'BQ Mart & Resto', 'is_active' => true],

            // BQ Arena
            ['title' => 'Lapangan Serbaguna', 'image' => '/images/PRESTAS.png', 'category' => 'BQ Arena', 'is_active' => true],
            ['title' => 'Arena Olahraga', 'image' => '/images/PRESTAS.png', 'category' => 'BQ Arena', 'is_active' => true],

            // Masjid
            ['title' => 'Masjid', 'image' => '/images/PRESTAS.png', 'category' => 'Masjid', 'is_active' => true],

            // Fasilitas Lainnya
            ['title' => 'Perpustakaan', 'image' => '/images/PRESTAS.png', 'category' => 'Fasilitas Lainnya', 'is_active' => true],
            ['title' => 'Laboratorium IT', 'image' => '/images/PRESTAS.png', 'category' => 'Fasilitas Lainnya', 'is_active' => true],
            ['title' => 'Ruang Kreatif', 'image' => '/images/PRESTAS.png', 'category' => 'Fasilitas Lainnya', 'is_active' => true],
        ];

        Facility::insert($facilities);
    }
}
