import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface EkstrakurikulerItem {
    id: number;
    name: string;
    order: number;
    is_active: boolean;
}

interface Event {
    id: number;
    title: string;
    image: string;
    category: string;
    order: number;
    is_active: boolean;
}

interface Props {
    items: EkstrakurikulerItem[];
    events: Event[];
    categories: string[];
    content: {
        hero_title?: string;
        hero_subtitle?: string;
        content_description?: string;
        gallery_title?: string;
        gallery_subtitle?: string;
        collage_image_1?: string;
        collage_image_2?: string;
        collage_image_3?: string;
        collage_image_4?: string;
    };
}

export default function Ekstrakurikuler({ items = [], events = [], categories = [], content = {} }: Props) {
    const [activeCategory, setActiveCategory] = useState(categories[0] || 'All');

    const filteredEvents = activeCategory === 'All' 
        ? events 
        : events.filter(event => event.category === activeCategory);
    return (
        <PublicLayout>
            <Head title="Ekstrakurikuler - Imam Hafsh Islamic Boarding School" />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png?v=1768396337"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Column: Text Content */}
                    <div>
                        <h1 className="mb-2 text-2xl font-bold text-blue-600 md:text-3xl">
                            {content.hero_title || 'Imam Hafsh Islamic Boarding School'}
                        </h1>
                        <p className="mb-8 text-lg font-medium text-slate-600">
                            {content.hero_subtitle || 'Sekolah Tahfidz Al-Qur\'an, IT Dan Bahasa'}
                        </p>

                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: content.content_description || '' }} />

                        <ul className="mt-8 space-y-2 pl-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-center text-slate-700">
                                    <span className="mr-3 h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: Collage Image */}
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <img 
                                    src={content.collage_image_1 || '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor21-300x200.jpg'}
                                    alt="Student Activity 1" 
                                    className="rounded-lg shadow-md mt-12"
                                />
                                <img 
                                    src={content.collage_image_2 || '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor24-300x200.jpg'}
                                    alt="Student Activity 2" 
                                    className="rounded-lg shadow-md"
                                />
                                <img 
                                    src={content.collage_image_3 || '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor2-300x200.jpg'}
                                    alt="Student Activity 3" 
                                    className="rounded-lg shadow-md -mt-12"
                                />
                                 <img 
                                    src={content.collage_image_4 || '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor3-300x200.jpg'}
                                    alt="Student Activity 4" 
                                    className="rounded-lg shadow-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Section with Filter */}
                <div className="mt-20">
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">
                            {content.gallery_title || 'Dokumentasi Kegiatan Ekstrakurikuler'}
                        </h2>
                        <p className="text-slate-600">
                            {content.gallery_subtitle || 'Berbagai kegiatan dan prestasi siswa'}
                        </p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="mb-8 flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => setActiveCategory('All')}
                            className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                                activeCategory === 'All'
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30'
                            }`}
                        >
                            Semua
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                                    activeCategory === category
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Event Grid */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src={`/${event.image}`}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <p className="text-sm font-semibold text-white">{event.title}</p>
                                            <span className="mt-1 inline-block rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                                                {event.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredEvents.length === 0 && (
                        <div className="py-12 text-center text-slate-500">
                            <p>Belum ada dokumentasi untuk kategori ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
