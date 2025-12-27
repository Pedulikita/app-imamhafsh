import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

interface LiterasiContent {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    main_content: string;
    features: Array<{
        title: string;
        description: string;
        icon: string;
    }>;
    statistics: Array<{
        label: string;
        value: string;
    }>;
    image_path: string;
    gallery_images: string[];
    meta_title: string;
    meta_description: string;
}

interface Props {
    content: LiterasiContent | null;
}

export default function Literasi({ content }: Props) {
    // Fallback data if no content from database
    const defaultContent = {
        title: 'Bentuk Dukungan Imam Hafsh Boarding School Terhadap Gerakan Literasi Sekolah',
        subtitle: 'Imam Hafsh Library',
        description: 'Imam Hafsh Islamic Boarding School mendukung Gerakan Literasi Sekolah dengan menghadirkan 1.469 lebih koleksi buku yang tersedia di Imam Hafsh Library.',
        main_content: 'Imam Hafsh Islamic Boarding School mendukung Gerakan Literasi Sekolah (GLS) dengan menghadirkan 1.469 lebih koleksi buku yang tersedia di Imam Hafsh Library. Dengan berbagai topik pembahasan yang menarik untuk siswa, koleksi buku Imam Hafsh Islamic Boarding School diharapkan dapat mendorong minat baca siswa.\n\nGerakan Literasi Sekolah merupakan program dari Kementrian Pendidikan dan Kebudayaan Republik Indonesia sebagai bentuk usaha untuk menumbuhkan rasa cinta siswa sekolah dalam membaca buku. Selain itu, Gerakan Literasi Sekolah juga merupakan upaya pemerintah dalam membentuk dan menumbuhkan budi pekerti anak.\n\nProgram Gerakan Literasi Sekolah dikemas dan dikembangkan berdasarkan Permendikbud Nomor 21 Tahun 2015 tentang Penumbuhan Budi Pekerti. Gerakan Literasi Sekolah bersifat partisipatif dengan melibatkan warga sekolah seperti peserta didik, guru, kepala sekolah, tenaga kependidikan, pengawas sekolah, komite sekolah, orang tua atau wali murid, akademisi, penerbit, media massa, tokoh masyarakat, dan pemangku kepentingan di bawah koordinasi Direktorat Jenderal Pendidikan Dasar dan Menengah Kementerian Pendidikan dan Kebudayaan.',
        image_path: '/images/Prestasi-Tim-Literasi-Sekolah-SMP-Bina-Qurani-Islamic-Boarding-School-Kota-Bogor-768x768.jpeg',
        gallery_images: [
            '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor2-300x200.jpg',
            '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor3-300x200.jpg',
            '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor16-300x200.jpg',
            '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor24-300x200.jpg',
        ],
        meta_title: 'Literasi Sekolah - Imam Hafsh Islamic Boarding School',
        meta_description: 'Imam Hafsh Islamic Boarding School mendukung Gerakan Literasi Sekolah dengan 1.469+ koleksi buku di Imam Hafsh Library untuk menumbuhkan minat baca siswa.',
    };

    const literasiContent = content || defaultContent;
    
    // Split main content by paragraphs
    const contentParagraphs = literasiContent.main_content.split('\n\n');

    return (
        <PublicLayout>
            <Head 
                title={literasiContent.meta_title || literasiContent.title} 
                meta={[
                    {
                        name: 'description',
                        content: literasiContent.meta_description || literasiContent.description,
                    },
                ]}
            />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-blue-600 md:text-2xl">
                        {literasiContent.subtitle}
                    </h2>
                    <h1 className="text-2xl font-bold text-slate-800 md:text-3xl lg:text-4xl">
                        {literasiContent.title}
                    </h1>
                </div>

                {/* Content Section 1: Text + Main Image */}
                <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="space-y-6 text-justify text-slate-600">
                        {contentParagraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                    <div>
                        <img
                            src={literasiContent.image_path}
                            alt="Siswa Membaca di Perpustakaan"
                            className="h-full w-full rounded-xl object-cover shadow-lg"
                        />
                    </div>
                </div>

                {/* Features Section (if available) */}
                {content?.features && content.features.length > 0 && (
                    <div className="mb-12">
                        <h3 className="mb-8 text-2xl font-bold text-slate-800">Keunggulan Program Literasi</h3>
                        <div className="grid gap-6 md:grid-cols-3">
                            {content.features.map((feature, index) => (
                                <div key={index} className="rounded-xl bg-white p-6 shadow-lg">
                                    <div className="mb-4 text-4xl">{feature.icon}</div>
                                    <h4 className="mb-2 text-lg font-semibold text-slate-800">{feature.title}</h4>
                                    <p className="text-slate-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Statistics Section (if available) */}
                {content?.statistics && content.statistics.length > 0 && (
                    <div className="mb-12">
                        <div className="grid gap-6 md:grid-cols-3">
                            {content.statistics.map((stat, index) => (
                                <div key={index} className="rounded-xl bg-blue-50 p-6 text-center">
                                    <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                                    <div className="text-slate-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Gallery Row */}
                {literasiContent.gallery_images && literasiContent.gallery_images.length > 0 && (
                    <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {literasiContent.gallery_images.map((src, index) => (
                            <div key={index} className="overflow-hidden rounded-xl bg-slate-100 shadow-md">
                                <img
                                    src={src}
                                    alt={`Library Activity ${index + 1}`}
                                    className="h-40 w-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Additional Content Section */}
                <div className="space-y-6 text-justify text-slate-600">
                    <p>
                        Melalui BQ Library, BQ Islamic Boarding School menjalankan tahapan demi tahapan pelaksanaan literasi sekolah. Tahap pertama dari
                        pelaksanaan Gerakan Literasi Sekolah yaitu pembiasaan siswa untuk membaca buku. Pada tahap pertama, seluruh santri BQ Islamic Boarding
                        School dijadwalkan secara rutin untuk berkunjung ke BQ Library dan membaca buku selama 30 sampai 60 menit setiap harinya. Tahapan ini
                        merupakan tahap pembiasaan, agar santri terbiasa dalam berkunjung ke perpustakaan untuk membaca buku.
                    </p>
                    <p>
                        Selanjutnya yaitu tahap pengembangan, di mana pada tahap ini siswa diharapkan sudah mampu untuk meningkatkan kemampuan literasi melalui
                        kegiatan menanggapi buku-buku dan pengayaan. Kemudian pada tahapan berikutnya, yaitu tahap pembelajaran maka siswa diharapkan mampu
                        meningkatkan kemampuan literasi di semua mata pelajaran dengan menggunakan buku pengayaan dan strategi membaca di semua mata
                        pelajaran.
                    </p>
                    <p>
                        BQ Islamic Boarding School terus memberikan perhatian dan pengawasan lebih demi terlaksananya seluruh tahapan demi tahapan Gerakan
                        Literasi Sekolah. Semoga melalui Gerakan Literasi Sekolah ini akan lahir generasi-generasi penerus bangsa yang berintelektual tinggi, berbudi
                        pekerti luhur, dan memiliki adab-adab qurani.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
