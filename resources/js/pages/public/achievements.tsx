import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

interface Achievement {
    id: number;
    title: string;
    image: string;
}

interface Props {
    achievements: Achievement[];
}

export default function Achievements({ achievements = [] }: Props) {
    return (
        <PublicLayout>
            <Head title="Achievements - BQ Islamic Boarding School" />

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
                        Achievements
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Prestasi Santri Imam Hafsh Islamic Boarding School
                    </h1>
                </div>

                {/* Achievements Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {achievements.map((item) => (
                        <div
                            key={item.id}
                            className="group overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                                <img
                                    src={`/${item.image}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
