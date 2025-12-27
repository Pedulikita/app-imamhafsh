import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Star, Quote, Youtube } from 'lucide-react';

type Testimony = {
    id: number;
    name: string;
    role: string;
    text: string;
    rating: number;
    avatar: string | null;
    platform: string | null;
    is_featured: boolean;
    order: number;
    is_active: boolean;
};

interface Props {
    testimonies: Testimony[];
    featured: Testimony | null;
}

const Stars = ({ count }: { count: number }) => (
    <div className="flex gap-1 text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < count ? 'fill-yellow-400' : 'fill-transparent'}`} />
        ))}
    </div>
);

export default function Testimoni({ testimonies = [], featured }: Props) {
    return (
        <PublicLayout>
            <Head title="Testimonial - BQ Islamic Boarding School" />

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
                        Testimonial
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Apa Kata Mereka Tentang Kami?
                    </h1>
                </div>

                {featured && (
                    <div className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 p-6 shadow">
                        <div className="grid items-center gap-6 md:grid-cols-2">
                            <div>
                                <div className="mb-2 text-lg font-semibold text-slate-900">{featured.name}</div>
                                <div className="mb-3 text-sm text-slate-600">{featured.role}</div>
                                <Stars count={featured.rating} />
                                <div className="mt-4 flex items-start gap-2 text-slate-700">
                                    <Quote className="mt-0.5 h-5 w-5 text-blue-600" />
                                    <p>{featured.text}</p>
                                </div>
                                {featured.platform === 'youtube' && (
                                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">
                                        <Youtube className="h-4 w-4" />
                                        Video Testimoni
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center md:justify-end">
                                <img 
                                    src={featured.avatar ? `/${featured.avatar}` : '/images/logo.png'} 
                                    alt={featured.name} 
                                    className="h-40 w-40 rounded-2xl object-cover" 
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonies.map((t) => (
                        <div key={t.id} className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <img 
                                    src={t.avatar ? `/${t.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`} 
                                    alt={t.name} 
                                    className="h-10 w-10 rounded-full object-cover" 
                                />
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                                    <div className="text-xs text-slate-600">{t.role}</div>
                                </div>
                                {t.platform === 'youtube' && (
                                    <div className="ml-auto">
                                        <Youtube className="h-4 w-4 text-red-600" />
                                    </div>
                                )}
                            </div>
                            <Stars count={t.rating} />
                            <div className="mt-3 flex items-start gap-2 text-slate-700">
                                <Quote className="mt-0.5 h-4 w-4 text-blue-600" />
                                <p className="text-sm">{t.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
