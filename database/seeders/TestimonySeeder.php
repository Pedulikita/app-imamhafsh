<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Testimony;

class TestimonySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonies = [
            [
                'name' => 'Ahmad Fauzi',
                'role' => 'Wali Santri',
                'text' => 'Alhamdulillah, anak saya berkembang pesat di Imam Hafsh Boarding School. Pendidikan agama yang kuat diimbangi dengan pembinaan karakter yang excellent. Sangat merekomendasikan pesantren ini untuk putra-putri Anda.',
                'rating' => 5,
                'avatar' => null,
                'is_featured' => true,
                'platform' => 'Google Review',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Siti Nurhaliza',
                'role' => 'Alumni 2024',
                'text' => 'Pengalaman belajar di pesantren ini sangat berkesan. Ustadz dan ustadzahnya sangat perhatian, fasilitas lengkap, dan program tahfidz yang terstruktur dengan baik. Jazakumullah khairan.',
                'rating' => 5,
                'avatar' => null,
                'is_featured' => false,
                'platform' => 'Testimonial',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Muhammad Ridwan',
                'role' => 'Wali Santri',
                'text' => 'Pesantren terbaik yang pernah kami temui. Anak kami tidak hanya hafal Al-Quran, tapi juga memiliki akhlak yang mulia. Terimakasih Imam Hafsh Boarding School!',
                'rating' => 4,
                'avatar' => null,
                'is_featured' => false,
                'platform' => 'Facebook',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($testimonies as $testimony) {
            Testimony::create($testimony);
        }
    }
}
