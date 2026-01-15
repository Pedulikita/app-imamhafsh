<?php

namespace Database\Seeders;

use App\Models\PPDBSetting;
use Illuminate\Database\Seeder;

class PPDBSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'section_key' => 'hero',
                'content' => [
                    'title' => 'Penerimaan Peserta Didik Baru',
                    'description' => 'Bergabung bersama IMAM HAFSH Islamic Boarding School. Proses pendaftaran dibantu admin PPDB untuk memastikan data dan jadwal seleksi rapi.',
                    'registration_url' => 'https://kolaborasitemanbaik.com/ppdb/imam-hafsh-p6swYI',
                    'banner_image' => '/images/Banner-Page.png',
                ],
                'is_active' => true,
                'order' => 0,
            ],
            [
                'section_key' => 'programs',
                'content' => [
                    'items' => [
                        [
                            'title' => 'Tahfidz Bersanad',
                            'subtitle' => 'Irama & langgam',
                            'icon' => 'GraduationCap',
                        ],
                        [
                            'title' => 'Internalisasi Adab',
                            'subtitle' => 'Knowing • Being • Doing',
                            'icon' => 'ShieldCheck',
                        ],
                        [
                            'title' => 'Arabic & English',
                            'subtitle' => 'Native speaker',
                            'icon' => 'BookOpen',
                        ],
                        [
                            'title' => 'IT & Sains',
                            'subtitle' => 'Project-based learning',
                            'icon' => 'Building2',
                        ],
                    ],
                ],
                'is_active' => true,
                'order' => 1,
            ],
            [
                'section_key' => 'flow_steps',
                'content' => [
                    'items' => [
                        [
                            'title' => 'Konsultasi & Info',
                            'description' => 'Tanyakan kuota, program, dan persyaratan melalui admin PPDB.',
                            'icon' => 'ClipboardList',
                        ],
                        [
                            'title' => 'Pengisian Data',
                            'description' => 'Kirim data calon siswa sesuai format yang diberikan admin.',
                            'icon' => 'Users',
                        ],
                        [
                            'title' => 'Seleksi & Observasi',
                            'description' => 'Jadwal seleksi/observasi diinformasikan setelah data diverifikasi.',
                            'icon' => 'CalendarDays',
                        ],
                        [
                            'title' => 'Pengumuman',
                            'description' => 'Hasil seleksi disampaikan melalui WhatsApp atau email resmi.',
                            'icon' => 'BadgeCheck',
                        ],
                    ],
                ],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'section_key' => 'fees',
                'content' => [
                    'items' => [
                        [
                            'title' => 'Biaya Pendaftaran',
                            'price' => 'Hubungi admin',
                            'note' => 'Termasuk proses administrasi & berkas.',
                            'icon' => 'CreditCard',
                        ],
                        [
                            'title' => 'SPP Bulanan',
                            'price' => 'Hubungi admin',
                            'note' => 'Menyesuaikan program & fasilitas.',
                            'icon' => 'CheckCircle2',
                        ],
                        [
                            'title' => 'Uang Pangkal',
                            'price' => 'Hubungi admin',
                            'note' => 'Pembayaran sesuai ketentuan PPDB.',
                            'icon' => 'Building2',
                        ],
                    ],
                ],
                'is_active' => true,
                'order' => 3,
            ],
            [
                'section_key' => 'faqs',
                'content' => [
                    'items' => [
                        [
                            'question' => 'Apakah pendaftaran bisa dilakukan online?',
                            'answer' => 'Bisa. Proses awal dapat dilakukan melalui admin PPDB untuk konsultasi dan pengisian data.',
                        ],
                        [
                            'question' => 'Dokumen apa saja yang diperlukan?',
                            'answer' => 'Umumnya Kartu Keluarga, Akta Kelahiran, dan rapor/surat keterangan sekolah. Detail akan diinformasikan admin PPDB.',
                        ],
                        [
                            'question' => 'Apakah ada tes seleksi?',
                            'answer' => 'Ada tahapan seleksi/observasi sesuai program. Jadwal dan ketentuan diinformasikan setelah data diverifikasi.',
                        ],
                        [
                            'question' => 'Bagaimana sistem pembayaran?',
                            'answer' => 'Admin PPDB akan memberikan rincian biaya dan metode pembayaran resmi setelah proses pendaftaran berjalan.',
                        ],
                    ],
                ],
                'is_active' => true,
                'order' => 4,
            ],
            [
                'section_key' => 'gallery',
                'content' => [
                    'images' => [
                        '/images/PRESTAS.png',
                        '/images/PRESTAS.png',
                        '/images/Banner-Page.png',
                        '/images/Program-Unggulan.png',
                        '/images/Program-Unggulan-2.png',
                        '/images/Program-Unggulan-3.png',
                        '/images/Program-Unggulan-4.png',
                        '/images/logo.png',
                    ],
                ],
                'is_active' => true,
                'order' => 5,
            ],
            [
                'section_key' => 'welcome',
                'content' => [
                    'badge' => 'Sambutan',
                    'title' => 'Selamat Datang di IMAM HAFSH',
                    'description' => 'Kami berkomitmen menghadirkan pendidikan yang menumbuhkan cinta Al-Qur\'an, adab, dan prestasi. PPDB disiapkan agar orang tua mendapatkan informasi yang jelas sebelum bergabung.',
                    'image' => '/images/logo.png',
                    'items' => [
                        'Pendampingan harian di asrama',
                        'Pembiasaan ibadah dan adab',
                        'Kegiatan akademik dan non-akademik',
                        'Lingkungan aman dan kondusif',
                    ],
                ],
                'is_active' => true,
                'order' => 6,
            ],
        ];

        foreach ($settings as $setting) {
            PPDBSetting::updateOrCreate(
                ['section_key' => $setting['section_key']],
                $setting
            );
        }
    }
}
