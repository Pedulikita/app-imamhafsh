<?php

namespace Database\Seeders;

use App\Models\LegalContent;
use Illuminate\Database\Seeder;

class LegalContentSeeder extends Seeder
{
    public function run(): void
    {
        $privacyContent = <<<'HTML'
<h2>1. Pengantar</h2>
<p>Imam Hafsh Islamic Boarding School ("kami", "kita", atau "sekolah") berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi yang Anda berikan saat menggunakan website kami.</p>

<h2>2. Informasi yang Kami Kumpulkan</h2>
<p>Kami dapat mengumpulkan berbagai jenis informasi, termasuk:</p>
<ul>
<li><strong>Informasi Pribadi:</strong> Nama lengkap, alamat email, nomor telepon, alamat rumah, tanggal lahir.</li>
<li><strong>Informasi Pendaftaran:</strong> Data calon siswa termasuk riwayat pendidikan, informasi orang tua/wali.</li>
<li><strong>Informasi Akademik:</strong> Nilai, kehadiran, prestasi, dan catatan akademik siswa.</li>
<li><strong>Informasi Teknis:</strong> Alamat IP, jenis browser, sistem operasi.</li>
</ul>

<h2>3. Bagaimana Kami Menggunakan Informasi Anda</h2>
<ul>
<li>Memproses pendaftaran siswa baru</li>
<li>Mengelola administrasi pendidikan</li>
<li>Berkomunikasi dengan siswa dan orang tua/wali</li>
<li>Meningkatkan layanan website</li>
</ul>

<h2>4. Perlindungan Data</h2>
<p>Kami menerapkan langkah-langkah keamanan untuk melindungi informasi pribadi Anda.</p>

<h2>5. Hubungi Kami</h2>
<p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui kontak yang tersedia di website.</p>
HTML;

        $termsContent = <<<'HTML'
<h2>1. Penerimaan Syarat</h2>
<p>Dengan mengakses website Imam Hafsh Islamic Boarding School, Anda setuju untuk terikat oleh syarat dan ketentuan berikut.</p>

<h2>2. Penggunaan Website</h2>
<h3>2.1 Akses Website</h3>
<p>Kami memberikan izin terbatas untuk mengakses dan menggunakan Website ini untuk keperluan informasi dan pendaftaran.</p>

<h3>2.2 Penggunaan yang Dilarang</h3>
<p>Anda setuju untuk TIDAK:</p>
<ul>
<li>Menggunakan Website untuk tujuan melanggar hukum</li>
<li>Mengganggu operasi Website</li>
<li>Mencoba akses tidak sah ke sistem kami</li>
</ul>

<h2>3. Hak Kekayaan Intelektual</h2>
<p>Semua konten di Website adalah milik Imam Hafsh Islamic Boarding School dan dilindungi undang-undang.</p>

<h2>4. Disclaimer</h2>
<p>Website disediakan "sebagaimana adanya" tanpa jaminan. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan Website.</p>

<h2>5. Perubahan Syarat</h2>
<p>Kami dapat memperbarui Syarat dan Ketentuan ini kapan saja. Perubahan akan efektif setelah diposting di halaman ini.</p>
HTML;

        LegalContent::updateOrCreate(
            ['key' => 'privacy_content'],
            ['value' => $privacyContent]
        );

        LegalContent::updateOrCreate(
            ['key' => 'terms_content'],
            ['value' => $termsContent]
        );
    }
}
