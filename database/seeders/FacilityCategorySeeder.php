<?php

namespace Database\Seeders;

use App\Models\FacilityCategory;
use Illuminate\Database\Seeder;

class FacilityCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Eksterior', 'order' => 0, 'is_active' => true],
            ['name' => 'Asrama', 'order' => 1, 'is_active' => true],
            ['name' => 'Kelas & Office', 'order' => 2, 'is_active' => true],
            ['name' => 'BQ Mart & Resto', 'order' => 3, 'is_active' => true],
            ['name' => 'BQ Arena', 'order' => 4, 'is_active' => true],
            ['name' => 'Masjid', 'order' => 5, 'is_active' => true],
            ['name' => 'Fasilitas Lainnya', 'order' => 6, 'is_active' => true],
        ];

        foreach ($categories as $category) {
            FacilityCategory::firstOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
