<?php

namespace Database\Seeders;

use App\Models\DonationEmbed;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DonationEmbedSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $donationEmbeds = [
            [
                'title' => 'Temani Perjuangan Lansia 80thn Jual Opak Keliling',
                'description' => 'Mari berdonasi untuk membantu Abah Jajang, lansia 80 tahun yang masih berjualan opak keliling untuk mencukupi kebutuhan hidupnya.',
                'embed_url' => 'https://temenbaik.com/campaign/embed/bantuabahjajang',
                'direct_url' => 'https://temenbaik.com/bantuabahjajang',
                'collected_amount' => 106000,
                'target_amount' => 25000000,
                'donors_count' => 12,
                'additional_info' => 'Setiap rupiah yang terkumpul akan langsung disalurkan untuk membantu kebutuhan sehari-hari Abah Jajang.',
                'is_active' => true,
                'sort_order' => 1
            ],
            [
                'title' => 'Bantu Pendidikan Anak Yatim',
                'description' => 'Program beasiswa untuk anak-anak yatim agar bisa melanjutkan pendidikan mereka hingga jenjang yang lebih tinggi.',
                'embed_url' => 'https://example.com/embed/pendidikan-yatim',
                'direct_url' => 'https://example.com/pendidikan-yatim',
                'collected_amount' => 5500000,
                'target_amount' => 50000000,
                'donors_count' => 87,
                'additional_info' => 'Target untuk 50 anak yatim mendapatkan beasiswa pendidikan.',
                'is_active' => true,
                'sort_order' => 2
            ],
            [
                'title' => 'Renovasi Masjid Desa',
                'description' => 'Mari bergotong royong membantu renovasi masjid di desa terpencil agar bisa menjadi tempat ibadah yang layak.',
                'embed_url' => 'https://example.com/embed/renovasi-masjid',
                'direct_url' => 'https://example.com/renovasi-masjid',
                'collected_amount' => 15000000,
                'target_amount' => 100000000,
                'donors_count' => 203,
                'additional_info' => 'Renovasi meliputi atap, lantai, dan fasilitas wudhu.',
                'is_active' => true,
                'sort_order' => 3
            ]
        ];

        foreach ($donationEmbeds as $embed) {
            DonationEmbed::create($embed);
        }
    }
}
