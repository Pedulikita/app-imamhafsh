import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Heart, Users, Target, TrendingUp } from 'lucide-react';

interface Donation {
    id: number;
    title: string;
    description: string;
    embed_url: string;
    direct_url: string;
    collected_amount: number;
    target_amount: number;
    currency: string;
    donors_count: number;
    image_url: string | null;
    progress_percentage: number;
    additional_info: string | null;
    formatted_collected_amount: string;
    formatted_target_amount: string;
}

interface Props {
    donations: Donation[];
}

export default function AllDonasi({ donations }: Props) {
    const formatCurrency = (amount: number, currency: string = 'IDR') => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <PublicLayout>
            <Head title="Program Donasi - Imam Hafsh Islamic Boarding School" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500">
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:20px_20px]" />
                <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 mb-6">
                            <Heart className="size-4" />
                            Berbagi Kebaikan
                        </div>
                        <h1 className="text-3xl font-extrabold leading-tight text-amber-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:text-4xl lg:text-5xl">
                            Program Donasi
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                            Dukung pendidikan Islam berkualitas dan bantu santri meraih impian mereka. 
                            Setiap donasi Anda adalah investasi untuk masa depan generasi Qurani.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section *
            <section className="bg-white py-12">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6 ring-1 ring-blue-100">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                                    <Target className="size-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-700">
                                        {donations.length}
                                    </div>
                                    <div className="text-sm text-slate-600">Program Aktif</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-white p-6 ring-1 ring-green-100">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-green-600 text-white">
                                    <Users className="size-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-700">
                                        {donations.reduce((sum, d) => sum + d.donors_count, 0)}
                                    </div>
                                    <div className="text-sm text-slate-600">Total Donatur</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-6 ring-1 ring-amber-100">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-600 text-white">
                                    <Heart className="size-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-amber-700">
                                        {formatCurrency(donations.reduce((sum, d) => sum + d.collected_amount, 0))}
                                    </div>
                                    <div className="text-sm text-slate-600">Terkumpul</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-white p-6 ring-1 ring-purple-100">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                                    <TrendingUp className="size-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-purple-700">
                                        {formatCurrency(donations.reduce((sum, d) => sum + d.target_amount, 0))}
                                    </div>
                                    <div className="text-sm text-slate-600">Target Total</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Donations List */}
            <section className="bg-neutral-50 py-16">
                <div className="mx-auto max-w-7xl px-4">
                    {donations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex size-20 items-center justify-center rounded-full bg-slate-100 mb-4">
                                <Heart className="size-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">Belum Ada Program Donasi</h3>
                            <p className="mt-2 text-slate-600">Program donasi akan segera hadir. Terima kasih atas perhatian Anda.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {donations.map((donation) => (
                                <DonationCard key={donation.id} donation={donation} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-blue-600 to-emerald-500 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Mari Bersama Membangun Generasi Qurani
                    </h2>
                    <p className="mt-4 text-white/90">
                        Setiap donasi Anda sangat berarti untuk kemajuan pendidikan Islam di Indonesia. 
                        Jazakumullah khairan katsiran atas dukungan Anda.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}

function DonationCard({ donation }: { donation: Donation }) {
    return (
        <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            {/* Header Image */}
            {donation.image_url && (
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <img
                        src={donation.image_url}
                        alt={donation.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Progress Badge */}
                    <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-sm font-semibold text-blue-600">
                                {donation.progress_percentage}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6">
                {/* Title & Description */}
                <div className="mb-5">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight mb-3 line-clamp-2">
                        {donation.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {donation.description}
                    </p>
                </div>

                {/* Progress Section *
                <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Terkumpul</span>
                        <span className="font-bold text-green-600 text-lg">
                            {donation.formatted_collected_amount}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Target</span>
                        <span className="font-semibold text-gray-800">
                            {donation.formatted_target_amount}
                        </span>
                    </div>
                    
                    {/* Modern Progress Bar *
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(donation.progress_percentage, 100)}%` }}
                        ></div>
                    </div>
                    
                    {/* Donors Count *
                    {donation.donors_count > 0 && (
                        <div className="flex items-center justify-center pt-2">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                </svg>
                                <span className="font-medium">{donation.donors_count} donatur</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                {donation.additional_info && (
                    <div className="mb-5 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800 font-medium italic">
                            {donation.additional_info}
                        </p>
                    </div>
                )}

                {/* Action Button */}
                <a
                    href={donation.direct_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Donasi Sekarang
                </a>

                {/* Secondary Link */}
                <div className="mt-4 text-center">
                    <a
                        href={donation.direct_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Lihat detail campaign
                    </a>
                </div>
            </div>
        </div>
    );
}
