<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EkstrakurikulerContent;

class EkstrakurikulerContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contents = [
            [
                'key' => 'hero_title',
                'value' => 'Imam Hafsh Islamic Boarding School',
            ],
            [
                'key' => 'hero_subtitle',
                'value' => 'Sekolah Tahfidz Al-Qur\'an, IT Dan Bahasa',
            ],
            [
                'key' => 'paragraph_1',
                'value' => 'Imam Hafsh Islamic Boarding School memberikan keleluasaan kepada seluruh peserta didik untuk mengikuti kegiatan-kegiatan ekstrakurikuler. Tujuan dari kegiatan-kegiatan tersebut adalah untuk memfasilitasi minat dan bakat peserta didik yang cukup variatif, sehingga output Imam Hafsh ini tidak hanya mumpuni dari sisi kognitif dan afektif tetapi juga secara psikomotorik mampu berkompetisi dengan lulusan-lulusan sekolah lainnya.',
            ],
            [
                'key' => 'paragraph_2',
                'value' => 'Selain itu, kegiatan ekstrakurikuler merupakan bagian integral dari pengalaman siswa di sekolah yang dapat memberikan manfaat yang signifikan. Diantaranya adalah untuk pengembangan keterampilan di luar lingkungan kelas untuk dapat berbicara di depan umum dalam logika berargumentasi; Menentukan bakat dan minat melalui berbagai kegiatan ekstrakurikuler sehingga siswa dapat memiliki kesempatan untuk menemukan bakat dan minat yang mungkin belum mereka sadari sebelumnya;',
            ],
            [
                'key' => 'paragraph_3',
                'value' => 'Serta dapat meningkatkan prestasi akademik melalui kegiatan ekstrakurikuler diharapkan membantu meningkatkan keterampilan manajemen waktu, disiplin, dan konsentrasi dalam meraih kesuksesan akademik. Kegiatan ekstrakurikuler Imam Hafsh Islamic Boarding School merupakan kegiatan wajib yang harus diikuti oleh setiap peserta didik. Kegiatan ekstrakurikuler tersebut diantaranya adalah:',
            ],
            [
                'key' => 'gallery_title',
                'value' => 'Dokumentasi Kegiatan Ekstrakurikuler',
            ],
            [
                'key' => 'gallery_subtitle',
                'value' => 'Berbagai kegiatan dan prestasi siswa',
            ],
        ];

        foreach ($contents as $content) {
            EkstrakurikulerContent::updateOrCreate(
                ['key' => $content['key']],
                ['value' => $content['value']]
            );
        }
    }
}
