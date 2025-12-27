import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

type EventItem = {
    id: number;
    title: string;
    image: string;
    category: 'Event' | 'Poster';
    order: number;
    is_active: boolean;
};

const tabs: Array<EventItem['category']> = ['Event', 'Poster'];

interface Props {
    events: EventItem[];
}

export default function Events({ events = [] }: Props) {
    const [activeTab, setActiveTab] = useState<EventItem['category']>('Event');

    const filtered = events.filter((item) => item.category === activeTab);

    return (
        <PublicLayout>
            <Head title="Event Galleries - BQ Islamic Boarding School" />

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
                        Galleries
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Galeri Kegiatan Imam Hafsh Islamic Boarding School
                    </h1>
                </div>

                <div className="mb-12 flex flex-wrap justify-center gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                                activeTab === tab
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filtered.map((item) => (
                        <div key={item.id} className="group overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1">
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <img
                                    src={`/${item.image}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`rounded-full px-2 py-1 text-xs font-bold text-white ${item.category === 'Event' ? 'bg-orange-500' : 'bg-blue-600'}`}>
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="py-20 text-center text-slate-500">
                        <p>Belum ada dokumentasi untuk kategori ini.</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
