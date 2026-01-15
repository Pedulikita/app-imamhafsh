export const defaultContent = {
    hero: {
        badge: 'Penerimaan Santri Baru',
        title: 'IMAM HAFSH\nBOARDING SCHOOL',
        subtitle:
            "Imam Hafsh Islamic Boarding School adalah pondok pesantren dengan Aqidah Ahlussunnah wal Jama'ah. Pembelajaran dan pengasuhan terarah untuk memahami Alquran dan As-Sunnah secara mendalam.",
        button: 'Daftar Sekarang',
    },
    about: {
        badge: 'About Us',
        title: 'Imam Hafsh Islamic Boarding School',
        content: `
            <p>Imam Hafsh Islamic Boarding School adalah pondok pesantren yang berpemahaman Ahlussunnah wal Jama'ah sebagai landasan utama dalam seluruh kegiatan pembelajaran dan pengasuhan. Para santri diajarkan untuk memahami Alquran dan As-Sunnah secara mendalam, serta berpegang teguh pada ajaran Islam yang benar.</p>
            <p>Imam Hafsh Islamic Boarding School merupakan lembaga pendidikan formal berasrama jenjang SMP putera sederajat, yang telah <span class="font-semibold text-neutral-800">Terakreditasi A</span> berdasarkan surat keputusan no.267/BAN-PDM/SK/2024. Memiliki fasilitas terbaik untuk menunjang kenyamanan dan kesuksesan proses pembelajaran peserta didik.</p>
        `,
    },
    alasan: {
        badge: 'Alasan Memilih',
        title: 'Imam Hafsh Islamic Boarding School',
        content:
            'Visi Imam Hafsh Islamic Boarding School adalah agar terwujudnya lembaga pendidikan Islam yang ramah dan profesional dalam membangun generasi qurani yang cakap berbahasa dan teknologi. Berikut adalah 10 alasan memilih Imam Hafsh Islamic Boarding School sebagai pilihan yang tepat:',
        list: [
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
    },
    pendidikan: {
        badge: 'Kebijakan Dan Norma',
        title: 'Imam Hafsh Tanpa Bullying & LGBT',
        subtitle: '#BQAgainstBullying #SafeSchoolEnvironment',
        content:
            'Dengan penuh keyakinan dan keteguhan, BQ Islamic Boarding School menegaskan komitmennya untuk melawan segala bentuk bullying dan aktivitas menyimpang LGBT. Kami menempatkan keamanan dan kenyamanan siswa sebagai prioritas utama. Langkah nyata serta tindakan kami terkait masalah ini adalah kampanye pendidikan anti bullying yang dimulai sejak masa Pengenalan Lingkungan Sekolah, serta pengawalan penuh selama siswa berada di BQ Islamic Boarding School.',
    },
    galeri: {
        badge: 'Project Galleries',
        title: 'Project Siswa SMP Imam Hafsh',
        heading: 'Project Siswa',
        content:
            'Project siswa merupakan karya santri Bina Qurani, fokus dalam proyek ini adalah bertujuan agar setiap peserta didik dapat mengembangkan minat dan bakat, serta keterampilan melalui proses perencanaan dan perancangan project siswa dengan terlibat secara langsung melalui produk yang nyata.',
    },
    artikel: {
        badge: 'Artikel Terbaru',
        title: 'Inspiring Articles',
        button: 'See More',
    },
    fallbacks: {
        testimonials: [
            {
                name: 'Rini Puspita Sari',
                role: 'Wali Santri',
                content:
                    'Kamar asramanya itu bersih dan nyaman luas kemudian dari segi kebersihannya juga bagus terjamin dan terawat semua lingkungannya baik dari mulai halaman depan sampai dengan kamar, dan toilet serta kamar mandinya.',
                rating: 5,
                image: null,
            },
            {
                name: 'M. Adam Hamdan',
                role: 'Santri',
                content:
                    'Setelah tiga minggu ini bersekolah di BQ sangat luar biasa, tadi sudah ketemu di mana anak kami bercerita keseharian di BQ, kebersamaannya termasuk fasilitas dan juga keramahtamahan dari seluruh pegawai ataupun guru di BQ.',
                rating: 5,
                image: null,
            },
            {
                name: 'Dewi Fitria',
                role: 'Wali Santri',
                content:
                    'Saya Dewi Fitria Bunda dari Fazri Czar Mauludi. Kesan saya tentang sekolah ini, unik. Karena masih jarang sekolah, pesantren yang mengusung konsep Jago ilmu teknologi dan ilmu Ngaji, yang memang dibutuhkan dalam kehidupan.',
                rating: 5,
                image: null,
            },
            {
                name: 'Ahmad Zaki',
                role: 'Alumni',
                content:
                    'Pengalaman belajar yang sangat berharga, fasilitas lengkap dan guru yang sangat mendukung perkembangan santri baik akademik maupun non-akademik.',
                rating: 5,
                image: null,
            },
        ],
        mentors: [
            {
                name: 'Hodam Wiyaya, S.Pd., MPP.',
                title: 'Mentor & Pendampingan Santri 90+ Pesantren',
                quote: 'Hari ini saya berada di Bina Qurani di daerah Bogor, kita belajar bersama guru-guru hebat, berlatih, tentang bagaimana menjadi seorang guru yang dikagumi, ada dua hal yang kita pelajari yaitu tentang spirit kebesaran generasi & contoh konkret dari kurikulum yang diajarkan kepada murid-murid Bina Qurani Islamic Boarding School.',
                img: '/images/PRESTAS.png',
                category: 'mentor',
            },
            {
                name: 'Ust. Ahmad Zaki',
                title: 'Mentor Tahfizh & Pengembangan Karakter',
                quote: 'Lingkungan belajar yang kondusif dan berorientasi pada adab membuat proses pembelajaran lebih bermakna. Pendampingan berkelanjutan memastikan setiap santri bertumbuh sesuai potensi.',
                img: '/images/PRESTAS.png',
                category: 'mentor',
            },
        ],
        activities: Array.from({ length: 9 }).map((_, i) => ({
            id: i + 1,
            title: `Aktivitas ${i + 1}`,
            src: '/images/PRESTAS.png',
            category: 'kegiatan',
        })),
        facilities: Array.from({ length: 8 }).map((_, i) => ({
            id: i + 1,
            src: '/images/PRESTAS.png',
        })),
        news: [
            {
                title: 'Kegiatan Outing Class',
                date: '12 Des 2025',
                category: 'Kegiatan',
            },
            {
                title: 'Prestasi Olimpiade Sains',
                date: '05 Des 2025',
                category: 'Prestasi',
            },
            {
                title: 'Seminar Parenting',
                date: '30 Nov 2025',
                category: 'Agenda',
            },
        ],
    },
};
