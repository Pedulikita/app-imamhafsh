import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

type FacilityItem = {
    id: number;
    title: string;
    image: string;
    category:
        | 'Eksterior'
        | 'Asrama'
        | 'Kelas & Office'
        | 'BQ Mart & Resto'
        | 'BQ Arena'
        | 'Masjid'
        | 'Fasilitas Lainnya';
};

const categories: FacilityItem['category'][] = [
    'Eksterior',
    'Asrama',
    'Kelas & Office',
    'BQ Mart & Resto',
    'BQ Arena',
    'Masjid',
    'Fasilitas Lainnya',
];

const allFacilities: FacilityItem[] = [
    { id: 1, title: 'Gerbang Utama', image: '/images/PRESTAS.png', category: 'Eksterior' },
    { id: 2, title: 'Gedung Utama', image: '/images/PRESTAS.png', category: 'Eksterior' },
    { id: 3, title: 'Area Hijau', image: '/images/PRESTAS.png', category: 'Eksterior' },
    { id: 4, title: 'Asrama Putra', image: '/images/PRESTAS.png', category: 'Asrama' },
    { id: 5, title: 'Asrama Putri', image: '/images/PRESTAS.png', category: 'Asrama' },
    { id: 6, title: 'Ruang Kelas', image: '/images/PRESTAS.png', category: 'Kelas & Office' },
    { id: 7, title: 'Ruang Guru', image: '/images/PRESTAS.png', category: 'Kelas & Office' },
    { id: 8, title: 'BQ Mart', image: '/images/PRESTAS.png', category: 'BQ Mart & Resto' },
    { id: 9, title: 'Resto Santri', image: '/images/PRESTAS.png', category: 'BQ Mart & Resto' },
    { id: 10, title: 'Lapangan Serbaguna', image: '/images/PRESTAS.png', category: 'BQ Arena' },
    { id: 11, title: 'Arena Olahraga', image: '/images/PRESTAS.png', category: 'BQ Arena' },
    { id: 12, title: 'Masjid', image: '/images/PRESTAS.png', category: 'Masjid' },
    { id: 13, title: 'Perpustakaan', image: '/images/PRESTAS.png', category: 'Fasilitas Lainnya' },
    { id: 14, title: 'Laboratorium IT', image: '/images/PRESTAS.png', category: 'Fasilitas Lainnya' },
    { id: 15, title: 'Ruang Kreatif', image: '/images/PRESTAS.png', category: 'Fasilitas Lainnya' },
];

export default function Fasilitas() {
    const [activeTab, setActiveTab] = useState<FacilityItem['category']>('Eksterior');

    const filteredFacilities = useMemo(
        () => allFacilities.filter((f) => f.category === activeTab),
        [activeTab]
    );

    return (
        <PublicLayout>
            <Head title="Fasilitas - BQ Islamic Boarding School" />

            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-block rounded-full bg-blue-100 px-6 py-2 text-sm font-bold text-blue-600">
                        Facilities
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Fasilitas Imam Hafsh Islamic Boarding School
                    </h1>
                </div>

                <div className="mb-12 flex flex-wrap justify-center gap-3">
                    {categories.map((category) => {
                        const isActive = category === activeTab;
                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveTab(category)}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30'
                                }`}
                            >
                                {category}
                                <ChevronDown className="size-4 opacity-80" />
                            </button>
                        );
                    })}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredFacilities.map((item) => (
                        <div
                            key={item.id}
                            className="group overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFacilities.length === 0 && (
                    <div className="py-20 text-center text-slate-500">
                        <p>Belum ada dokumentasi untuk kategori ini.</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
