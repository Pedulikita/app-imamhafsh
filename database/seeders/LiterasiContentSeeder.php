<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LiterasiContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\LiterasiContent::create([
            'title' => 'Bentuk Dukungan Imam Hafsh Boarding School Terhadap Gerakan Literasi Sekolah',
            'subtitle' => 'BQ Library',
            'description' => 'BQ Islamic Boarding School mendukung Gerakan Literasi Sekolah dengan menghadirkan 1.469 lebih koleksi buku yang tersedia di BQ Library.',
            'main_content' => 'BQ Islamic Boarding School mendukung Gerakan Literasi Sekolah (GLS) dengan menghadirkan 1.469 lebih koleksi buku yang tersedia di BQ Library. Dengan berbagai topik pembahasan yang menarik untuk siswa, koleksi buku BQ Islamic Boarding School diharapkan dapat mendorong minat baca siswa.

Gerakan Literasi Sekolah merupakan program dari Kementrian Pendidikan dan Kebudayaan Republik Indonesia sebagai bentuk usaha untuk menumbuhkan rasa cinta siswa sekolah dalam membaca buku. Selain itu, Gerakan Literasi Sekolah juga merupakan upaya pemerintah dalam membentuk dan menumbuhkan budi pekerti anak.

Program Gerakan Literasi Sekolah dikemas dan dikembangkan berdasarkan Permendikbud Nomor 21 Tahun 2015 tentang Penumbuhan Budi Pekerti. Gerakan Literasi Sekolah bersifat partisipatif dengan melibatkan warga sekolah seperti peserta didik, guru, kepala sekolah, tenaga kependidikan, pengawas sekolah, komite sekolah, orang tua atau wali murid, akademisi, penerbit, media massa, tokoh masyarakat, dan pemangku kepentingan di bawah koordinasi Direktorat Jenderal Pendidikan Dasar dan Menengah Kementerian Pendidikan dan Kebudayaan.',
            'features' => [
                [
                    'title' => 'Koleksi Lengkap',
                    'description' => '1.469 lebih koleksi buku dengan berbagai topik pembahasan yang menarik',
                    'icon' => '📚'
                ],
                [
                    'title' => 'Desain Nyaman',
                    'description' => 'Desain simple dan elegan untuk kenyamanan membaca siswa',
                    'icon' => '🏛️'
                ],
                [
                    'title' => 'Program Terstruktur',
                    'description' => 'Program literasi terstruktur dengan tahapan pembiasaan, pengembangan, dan pembelajaran',
                    'icon' => '📋'
                ]
            ],
            'statistics' => [
                [
                    'label' => 'Total Koleksi Buku',
                    'value' => '1,469+'
                ],
                [
                    'label' => 'Waktu Baca Harian',
                    'value' => '30-60 menit'
                ],
                [
                    'label' => 'Siswa Aktif',
                    'value' => '100%'
                ]
            ],
            'image_path' => '/images/Prestasi-Tim-Literasi-Sekolah-SMP-Bina-Qurani-Islamic-Boarding-School-Kota-Bogor-768x768.jpeg',
            'gallery_images' => [
                '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor2-300x200.jpg',
                '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor3-300x200.jpg',
                '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor16-300x200.jpg',
                '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor24-300x200.jpg',
            ],
            'meta_title' => 'Literasi Sekolah - BQ Islamic Boarding School',
            'meta_description' => 'BQ Islamic Boarding School mendukung Gerakan Literasi Sekolah dengan 1.469+ koleksi buku di BQ Library untuk menumbuhkan minat baca siswa.',
            'is_active' => true,
            'sort_order' => 1,
        ]);
    }
}
