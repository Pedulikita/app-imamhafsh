import React from 'react';

interface DonationEmbed {
    id: number;
    title: string;
    description: string;
    embed_url: string;
    direct_url: string;
    collected_amount: number;
    target_amount: number;
    formatted_collected_amount: string;
    formatted_target_amount: string;
    progress_percentage: number;
    donors_count: number;
    image_url?: string;
    additional_info?: string;
}

interface DonationSectionProps {
    donationEmbeds: DonationEmbed[];
    className?: string;
}

export default function DonationSection({ donationEmbeds, className = "" }: DonationSectionProps) {
    if (!donationEmbeds || donationEmbeds.length === 0) {
        return null;
    }

    return (
        <div className={`w-full ${className}`}>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {donationEmbeds.map((embed) => (
                    <DonationCard key={embed.id} embed={embed} />
                ))}
            </div>
        </div>
    );
}

function DonationCard({ embed }: { embed: DonationEmbed }) {
    return (
        <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            {/* Header Image */}
            {embed.image_url && (
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <img
                        src={embed.image_url}
                        alt={embed.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Progress Badge */}
                    <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-sm font-semibold text-blue-600">
                                {embed.progress_percentage}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6">
                {/* Title & Description */}
                <div className="mb-5">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight mb-3 line-clamp-2">
                        {embed.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {embed.description}
                    </p>
                </div>

                {/* Progress Section 
                <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Terkumpul</span>
                        <span className="font-bold text-green-600 text-lg">
                            {embed.formatted_collected_amount}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Target</span>
                        <span className="font-semibold text-gray-800">
                            {embed.formatted_target_amount}
                        </span>
                    </div>
                    
                    {/* Modern Progress Bar 
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(embed.progress_percentage, 100)}%` }}
                        ></div>
                    </div>
                    
                    {/* Donors Count *
                    {embed.donors_count > 0 && (
                        <div className="flex items-center justify-center pt-2">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                </svg>
                                <span className="font-medium">{embed.donors_count} donatur</span>
                            </div>
                        </div>
                    )}
                </div>*/}

                {/* Additional Info */}
                {embed.additional_info && (
                    <div className="mb-5 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800 font-medium italic">
                            {embed.additional_info}
                        </p>
                    </div>
                )}

                {/* Action Button */}
                <a
                    href={embed.direct_url}
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
                        href={embed.direct_url}
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