<?php

namespace Database\Seeders;

use App\Models\KebijakanContent;
use Illuminate\Database\Seeder;

class KebijakanContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KebijakanContent::create([
            'hero_badge' => 'Kebijakan Dan Norma',
            'hero_title' => 'Imam Hafsh Tanpa Bullying & LGBT',
            'hero_subtitle' => 'Menciptakan lingkungan pendidikan yang aman, nyaman, dan kondusif bagi seluruh santri',
            'hero_image' => '/images/Pendidikan.jpg',
            
            'intro_title' => 'Komitmen Kami',
            'intro_content' => '<p>Dengan penuh keyakinan dan keteguhan, Imam Hafsh Islamic Boarding School menegaskan komitmennya untuk melawan segala bentuk bullying dan aktivitas menyimpang LGBT. Kami menempatkan keamanan dan kenyamanan santri sebagai prioritas utama dalam setiap aspek pembelajaran dan pengasuhan.</p>',
            
            'bullying_title' => 'Anti Bullying Policy',
            'bullying_content' => '<p>Kami memiliki sistem yang komprehensif untuk mencegah dan menangani bullying di lingkungan sekolah. Setiap kasus ditangani dengan serius dan transparan.</p>',
            'bullying_points' => [
                'Kampanye pendidikan anti bullying sejak masa orientasi',
                'Pengawasan penuh 24/7 oleh pengasuh terlatih',
                'Sistem pelaporan yang mudah dan aman',
                'Sanksi tegas bagi pelaku bullying',
                'Konseling dan pendampingan untuk korban',
                'Program pembinaan karakter berkelanjutan',
            ],
            'bullying_image' => '/images/Banner-Page.png',
            
            'lgbt_title' => 'Kebijakan Anti LGBT',
            'lgbt_content' => '<p>Berdasarkan nilai-nilai Islam dan norma sosial, kami menerapkan kebijakan yang tegas terhadap aktivitas LGBT sambil tetap menjunjung tinggi martabat setiap individu.</p>',
            'lgbt_points' => [
                'Edukasi nilai-nilai Islam tentang fitrah manusia',
                'Pemisahan asrama putra dan putri yang ketat',
                'Pengawasan aktivitas santri secara menyeluruh',
                'Program pembinaan akhlak dan akidah',
                'Kerjasama dengan orang tua dalam pengawasan',
                'Konseling islami untuk yang membutuhkan',
            ],
            'lgbt_image' => '/images/PRESTAS.png',
            
            'environment_title' => 'Lingkungan Aman & Nyaman',
            'environment_content' => '<p>Kami menciptakan lingkungan yang aman, nyaman, dan kondusif untuk perkembangan optimal santri, baik secara akademik, spiritual, maupun sosial.</p>',
            'environment_features' => [
                [
                    'icon' => 'shield-check',
                    'title' => 'Keamanan 24/7',
                    'description' => 'Sistem pengawasan dan keamanan selama 24 jam penuh'
                ],
                [
                    'icon' => 'users',
                    'title' => 'Pengasuh Terlatih',
                    'description' => 'Tim pengasuh profesional dan terlatih mendampingi santri'
                ],
                [
                    'icon' => 'heart',
                    'title' => 'Lingkungan Positif',
                    'description' => 'Budaya saling menghormati dan saling mendukung'
                ],
                [
                    'icon' => 'book-open',
                    'title' => 'Pembinaan Karakter',
                    'description' => 'Program pengembangan karakter islami yang konsisten'
                ],
            ],
            'environment_image' => '/images/PRESTAS.png',
            
            'commitment_title' => 'Komitmen Kami Kepada Orang Tua',
            'commitment_content' => '<p>Kami berkomitmen penuh untuk menjaga amanah orang tua dengan menciptakan lingkungan pendidikan yang aman, islami, dan kondusif.</p>',
            'commitment_items' => [
                'Transparansi penuh dalam setiap kebijakan dan penanganan kasus',
                'Komunikasi aktif dengan orang tua terkait perkembangan santri',
                'Sanksi tegas dan konsisten terhadap pelanggaran',
                'Program pembinaan berkelanjutan untuk semua santri',
                'Sistem pelaporan yang mudah diakses orang tua',
                'Evaluasi berkala terhadap implementasi kebijakan',
            ],
            
            'is_active' => true,
            'order' => 1,
        ]);
    }
}
