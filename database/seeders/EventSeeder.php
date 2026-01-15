<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Wisuda Santri Angkatan 2025',
                'image' => 'images/PRESTAS.png',
                'category' => 'Event',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Penerimaan Santri Baru 2025/2026',
                'image' => 'images/PRESTASI-2.png',
                'category' => 'Poster',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Peringatan Isra Mi\'raj 1446 H',
                'image' => 'images/PRESTAS.png',
                'category' => 'Event',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Open House Ramadhan 1446 H',
                'image' => 'images/PRESTASI-2.png',
                'category' => 'Poster',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
