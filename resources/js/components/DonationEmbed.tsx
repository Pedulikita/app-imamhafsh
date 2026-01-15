import { useState, useEffect } from 'react';

interface DonationEmbedProps {
    src: string;
    width?: string | number;
    height?: string | number;
    className?: string;
}

export default function DonationEmbed({ 
    src, 
    width = "400", 
    height = "500", 
    className = "" 
}: DonationEmbedProps) {
    const [showFallback, setShowFallback] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set timer untuk mendeteksi jika iframe gagal load
        const timer = setTimeout(() => {
            setIsLoading(false);
            setShowFallback(true);
        }, 3000); // 3 detik timeout

        return () => clearTimeout(timer);
    }, []);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setShowFallback(true);
    };

    const getDirectUrl = (embedUrl: string) => {
        return embedUrl.replace('/embed/', '/');
    };

    // Jika showFallback true atau masih loading, tampilkan fallback card
    if (showFallback || isLoading) {
        return (
            <div className={`${className}`} style={{ width, height: `${height}px` }}>
                <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 rounded-lg h-full">
                    <div className="text-center p-6 max-w-sm">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-blue-800 mb-2">
                            Campaign Donasi
                        </h3>
                        <p className="text-blue-700 font-semibold mb-1">
                            Temani Perjuangan Lansia 80thn
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            Jual Opak Keliling - Mari berdonasi untuk membantu Abah Jajang
                        </p>
                        
                        <div className="space-y-3">
                            <div className="bg-white/70 rounded-lg p-3 text-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">Terkumpul:</span>
                                    <span className="font-semibold text-blue-700">Rp 106.000</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Target:</span>
                                    <span className="font-semibold">Rp 25.000.000</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '0.4%'}}></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">0.4% tercapai</p>
                            </div>
                            
                            <a
                                href={getDirectUrl(src)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-lg"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Donasi Sekarang
                            </a>
                        </div>
                        
                        {isLoading && (
                            <div className="mt-3 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                <span className="text-xs text-gray-500">Loading widget...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Link alternatif di bawah */}
                <div className="mt-3 text-center">
                    <a
                        href={getDirectUrl(src)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Lihat detail campaign
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} style={{ width, height: `${height}px` }}>
            <iframe
                src={src}
                width={width}
                height={height}
                frameBorder="0"
                scrolling="no"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
                title="Donasi Campaign - Bantu Abah Jajang"
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    width: "100%",
                    height: "100%",
                    minHeight: height
                }}
            />
            
            {/* Link alternatif di bawah */}
            <div className="mt-3 text-center">
                <a
                    href={getDirectUrl(src)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Buka halaman donasi
                </a>
            </div>
        </div>
    );
}