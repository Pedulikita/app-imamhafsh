import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

export default function Nilai() {
    const values = [
        {
            title: 'Tarbiyah Rabbaniyah',
            icon: '/images/Tarbiyah-Rabbaniyah.png',
            points: [
                'Berilmu sebelum beramal',
                'Memberikan bimbingan kepada siswa, wali siswa, dan masyarakat',
                'Menyampaikan ilmu dan berdakwah dengan bijak',
            ],
        },
        {
            title: 'Profesional',
            icon: '/images/Profesional.png',
            points: [
                'Bekerja keras dengan ikhlas, cerdas, dan tuntas',
                'Bekerja dengan fokus dan totalitas',
                'Memberikan hasil diatas ekspektasi',
            ],
        },
        {
            title: 'Integritas',
            icon: '/images/Integritas-150x150.png',
            points: [
                'Berkomitmen tinggi dalam melaksanakan amanah pendidikan',
                'Membudayakan kejujuran akademik dan kebebasan ilmiah',
                'Menerapkan transparansi akademik',
            ],
        },
        {
            title: 'Ukhuwah',
            icon: '/images/Ukhuwwah.png',
            points: [
                'Berbagi ilmu, melatih, membimbing dan peduli',
                'Menjaga ikatan kekeluargaan dengan senantiasa tolong-menolong dalam kebaikan dan ketakwan',
                'Memberikan loyalitas terhadap pimpinan, lembaga, dan keluarga besar Bina Qurani',
            ],
        },
        {
            title: 'Pelayanan Berkualitas',
            icon: '/images/Pelayanan-Berkualitas.png',
            points: [
                'Berusaha maksimal untuk memberikan pelayanan terbaik',
                'Menjadi orang tua bagi seluruh siswa di sekolah',
                'Menjadi pelayan terbaik bagi seluruh orang tua siswa',
            ],
        },
    ];

    return (
        <PublicLayout>
            <Head title="Nilai-Nilai Inti Bina Qurani Islamic Boarding School" />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-16 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-blue-600 md:text-3xl">
                        Nilai-Nilai Inti Bina Qurani Islamic Boarding School
                    </h1>
                    <p className="text-lg font-semibold text-slate-700">
                        Sekolah Tahfidz Al-Qur'an, IT Dan Bahasa
                    </p>
                </div>

                {/* Values List */}
                <div className="space-y-12">
                    {values.map((value) => (
                        <div
                            key={value.title}
                            className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <div className="flex size-24 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100 md:size-32">
                                    <img
                                        src={value.icon}
                                        alt={value.title}
                                        className="size-16 object-contain md:size-20"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h2 className="mb-3 text-xl font-bold text-orange-500 md:text-2xl">
                                    {value.title}
                                </h2>
                                <ul className="list-inside space-y-2">
                                    {value.points.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                                            <span className="mt-2 size-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                                            <span className="leading-relaxed">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
