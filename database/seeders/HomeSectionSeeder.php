<?php

namespace Database\Seeders;

use App\Models\HomeSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HomeSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            [
                'section_key' => 'about',
                'title' => 'Imam Hafsh Islamic Boarding School',
                'subtitle' => null,
                'content' => 'Imam Hafsh Islamic Boarding School adalah pondok pesantren yang berpemahaman Ahlussunnah wal Jama\'ah sebagai landasan utama dalam seluruh kegiatan pembelajaran dan pengasuhan. Para santri diajarkan untuk memahami Alquran dan As-Sunnah secara mendalam, serta berpegang teguh pada ajaran Islam yang benar.

Imam Hafsh Islamic Boarding School merupakan lembaga pendidikan formal berasrama jenjang SMP putera sederajat, yang telah Terakreditasi A berdasarkan surat keputusan no.267/BAN-PDM/SK/2024. Memiliki fasilitas terbaik untuk menunjang kenyamanan dan kesuksesan proses pembelajaran peserta didik.',
                'image' => 'images/PRESTASI-2.png',
                'image_alt' => 'Prestasi santri Imam Hafsh',
                'badge_text' => 'About Us',
                'button_text' => 'See More',
                'button_link' => '#profil',
                'meta' => null,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'section_key' => 'alasan',
                'title' => 'Imam Hafsh Islamic Boarding School',
                'subtitle' => null,
                'content' => 'Visi Bina Qurani Islamic Boarding School adalah agar terwujudnya lembaga pendidikan Islam yang ramah dan profesional dalam membangun generasi qurani yang cakap berbahasa dan teknologi. Berikut adalah 10 alasan memilih BQ Islamic Boarding School sebagai pilihan yang tepat:',
                'image' => 'images/PRESTAS.png',
                'image_alt' => 'Santri berprestasi',
                'badge_text' => 'Alasan Memilih',
                'button_text' => null,
                'button_link' => null,
                'meta' => [
                    'list_items' => [
                        'Terakreditasi A',
                        'Jago Ngaji, Jago Coding',
                        'Program Unggulan Quality',
                        'Kurikulum IT Berbasis Projek',
                        'High Quality & Hospitality',
                        'Service Excellence',
                        'Anti Bullying & LGBT',
                        'Unggul dan Berprestasi',
                        'Tenaga Pengajar Profesional',
                        'Lokasi yang Asri & Strategis',
                    ],
                ],
                'order' => 2,
                'is_active' => true,
            ],
            [
                'section_key' => 'pendidikan',
                'title' => 'Imam Hafsh Tanpa Bullying & LGBT',
                'subtitle' => '#BQAgainstBullying #SafeSchoolEnvironment',
                'content' => 'Dengan penuh keyakinan dan keteguhan, BQ Islamic Boarding School menegaskan komitmennya untuk melawan segala bentuk bullying dan aktivitas menyimpang LGBT. Kami menempatkan keamanan dan kenyamanan siswa sebagai prioritas utama. Langkah nyata serta tindakan kami terkait masalah ini adalah kampanye pendidikan anti bullying yang dimulai sejak masa Pengenalan Lingkungan Sekolah, serta pengawalan penuh selama siswa berada di BQ Islamic Boarding School.',
                'image' => 'images/Pendidikan.jpg',
                'image_alt' => 'Lingkungan pendidikan yang aman',
                'badge_text' => 'Kebijakan Dan Norma',
                'button_text' => 'See More',
                'button_link' => '#about',
                'meta' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'section_key' => 'galeri',
                'title' => 'Project Siswa SMP Imam Hafsh',
                'subtitle' => null,
                'content' => 'Project siswa merupakan karya santri Bina Qurani, fokus dalam proyek ini adalah bertujuan agar setiap peserta didik dapat mengembangkan minat dan bakat, serta keterampilan melalui proses perencanaan dan perancangan project siswa dengan terlibat secara langsung melalui produk yang nyata.',
                'image' => 'images/PRESTASI-2.png',
                'image_alt' => 'Project siswa',
                'badge_text' => 'Project Galleries',
                'button_text' => 'Lihat Project',
                'button_link' => '#galeri',
                'meta' => null,
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($sections as $section) {
            HomeSection::updateOrCreate(
                ['section_key' => $section['section_key']],
                $section
            );
        }
    }
}
