<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert default values for collage images
        $images = [
            'collage_image_1' => '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor21-300x200.jpg',
            'collage_image_2' => '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor24-300x200.jpg',
            'collage_image_3' => '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor2-300x200.jpg',
            'collage_image_4' => '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor3-300x200.jpg',
        ];

        foreach ($images as $key => $value) {
            \DB::table('ekstrakurikuler_content')->insert([
                'key' => $key,
                'value' => $value,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \DB::table('ekstrakurikuler_content')->whereIn('key', [
            'collage_image_1',
            'collage_image_2', 
            'collage_image_3',
            'collage_image_4',
        ])->delete();
    }
};
