<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EkstrakurikulerItem;

class EkstrakurikulerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ekstrakurikuler = [
            ['name' => 'Archery', 'order' => 1, 'is_active' => true],
            ['name' => 'Match Club', 'order' => 2, 'is_active' => true],
            ['name' => 'Basket', 'order' => 3, 'is_active' => true],
            ['name' => 'Badminton', 'order' => 4, 'is_active' => true],
            ['name' => 'Futsal', 'order' => 5, 'is_active' => true],
            ['name' => 'Taekwondo', 'order' => 6, 'is_active' => true],
            ['name' => 'Pramuka', 'order' => 7, 'is_active' => true],
            ['name' => 'Animasi', 'order' => 8, 'is_active' => true],
            ['name' => 'Desain Grafis', 'order' => 9, 'is_active' => true],
            ['name' => 'PMR', 'order' => 10, 'is_active' => true],
        ];

        foreach ($ekstrakurikuler as $item) {
            EkstrakurikulerItem::create($item);
        }
    }
}
