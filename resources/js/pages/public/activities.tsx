import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Activity {
    id: number;
    title: string;
    image: string;
    category: string;
    order: number;
    is_active: boolean;
}

interface Props {
    activities: Activity[];
    categories: string[];
}

export default function Activities({ activities = [], categories = [] }: Props) {
    const [activeTab, setActiveTab] = useState(categories[0] || '');

    const filteredActivities = activities.filter(activity => activity.category === activeTab);

    return (
        <PublicLayout>
            <Head title="Kegiatan Siswa - BQ Islamic Boarding School" />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                {/* Title Section */}
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-block rounded-full bg-blue-100 px-6 py-2 text-sm font-bold text-blue-600">
                        Daily Activities
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Kegiatan Siswa Imam Hafsh Boarding School
                    </h1>
                </div>

                {/* Filter Tabs */}
                <div className="mb-12 flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                                activeTab === category
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Activity Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredActivities.map((activity) => (
                        <div key={activity.id} className="group overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1">
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <img
                                    src={`/${activity.image}`}
                                    alt={activity.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredActivities.length === 0 && (
                    <div className="py-20 text-center text-slate-500">
                        <p>Belum ada dokumentasi untuk kategori ini.</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
