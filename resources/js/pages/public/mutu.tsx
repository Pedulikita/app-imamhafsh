import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { BookOpen, Command, Globe, Languages, UserCheck } from 'lucide-react';

export default function Mutu() {
    const reasons = [
        'Terakreditasi A',
        'Unggul dan Berprestasi',
        'Jago Ngaji Jago Coding',
        'Tenaga Pengajar Profesional',
        'Program Unggulan Quality',
        'Lokasi yang Asri & Strategis',
        'Kurikulum IT Berbasis Projek',
        'Kegiatan Ekstrakurikuler',
        'High Quality & Hospitality',
        'Anti Bullying & LGBT',
        'Service Excellence',
        'Integrity School',
    ];

    const standards = [
        {
            number: '01',
            text: 'Memiliki jiwa leadership yang berilmu, jujur, amanah, dan cerdas',
            icon: UserCheck,
        },
        {
            number: '02',
            text: 'Mahir berbahasa Arab dan Bahasa Inggris',
            icon: Languages,
        },
        {
            number: '03',
            text: 'Menguasai seluk-beluk pembuatan website dan bahasa pemrograman',
            icon: Globe,
        },
        {
            number: '04',
            text: 'Terampil dalam desain grafis dan video editing',
            icon: Command,
        },
        {
            number: '05',
            text: "Mendapatkan sanad Al-Qur'an bersambung kepada Rasulullah SAW",
            icon: BookOpen,
        },
    ];

    return (
        <PublicLayout>
            <Head title="Standar Mutu - BQ Islamic Boarding School" />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
                {/* Section 1: Alasan Memilih */}
                <div className="mb-20 grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div>
                        <h2 className="text-xl font-bold text-blue-600 md:text-2xl">
                            Alasan Memilih BQ Islamic Boarding School
                        </h2>
                        <h3 className="mb-6 text-3xl font-bold text-orange-500 md:text-4xl">
                            Sebagai Alasan Yang Tepat
                        </h3>

                        <div className="space-y-4 text-justify text-slate-700">
                            <p>
                                Pondok Pesantren masih menjadi tempat terbaik untuk pendidikan
                                agama. Kedalaman materi agama, guru yang mumpuni, kurikulum yang
                                berjenjang, lingkungan yang mendukung, dan fokus belajar menjadi
                                perbedaan Pondok Pesantren dengan lembaga pendidikan lainnya.
                            </p>
                            <p>
                                Karenanya tidak perlu ada keraguan bagi setiap orang tua untuk
                                menyekolahkan anaknya di Pondok Pesantren. Saat ini, banyak sekali
                                Pondok Pesantren yang berdiri di berbagai wilayah di Indonesia.
                                Sehingga seringkali menyebabkan orang tua bingung memilih yang
                                terbaik untuk sekolah anaknya. Pesantren Terbaik di Bogor menjadi
                                opsi pilihan terbaik bagi orang tua yang masih bingung mencari
                                tempat sekolah anak. Mengapa Pesantren Terbaik di Bogor menjadi
                                pilihan? Tentu banyak alasan yang patut dipertimbangkan, berikut ini
                                adalah alasan memilih Bina Qurani Islamic Boarding School sebagai
                                pilihan yang tepat:
                            </p>
                        </div>

                        <ul className="mt-8 grid grid-cols-1 gap-x-4 gap-y-2 text-sm font-medium text-slate-800 sm:grid-cols-2">
                            {reasons.map((reason, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <img
                            src="/images/mutu.png"
                            alt="Siswa BQ"
                            className="max-w-full object-contain drop-shadow-xl"
                        />
                    </div>
                </div>

                {/* Section 2: Standar Mutu */}
                <div>
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-blue-600 md:text-2xl">
                            Standar Mutu Penjaminan Internal BQ Islamic Boarding School
                        </h2>
                        <h3 className="text-2xl font-bold text-slate-800 md:text-3xl">
                            Sekolah Tahfidz Al-Qur'an, IT Dan Bahasa
                        </h3>
                    </div>

                    <div className="space-y-8 pl-4 md:pl-0">
                        {standards.map((item, index) => (
                            <div key={index} className="flex items-start gap-6">
                                {/* Icon Circle */}
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-lg md:h-20 md:w-20">
                                    <item.icon className="h-8 w-8 text-white md:h-10 md:w-10" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col pt-1">
                                    <span className="text-2xl font-bold text-orange-500 md:text-3xl">
                                        {item.number}
                                    </span>
                                    <p className="text-lg font-medium text-slate-700 md:text-xl">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
