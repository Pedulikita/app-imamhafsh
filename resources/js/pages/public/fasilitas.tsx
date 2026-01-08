import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
    is_active: boolean;
};

interface Props {
    facilities: FacilityItem[];
    categories: FacilityItem['category'][];
}

export default function Fasilitas({ facilities, categories }: Props) {
    const [activeTab, setActiveTab] = useState<FacilityItem['category']>(categories[0] || 'Eksterior');
    const [selectedImage, setSelectedImage] = useState<FacilityItem | null>(null);

    const filteredFacilities = useMemo(
        () => facilities.filter((f) => f.category === activeTab),
        [activeTab, facilities]
    );

    const currentImageIndex = selectedImage ? filteredFacilities.findIndex(f => f.id === selectedImage.id) : -1;

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setSelectedImage(filteredFacilities[currentImageIndex - 1]);
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < filteredFacilities.length - 1) {
            setSelectedImage(filteredFacilities[currentImageIndex + 1]);
        }
    };

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
                            className="group overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-slate-700">{item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFacilities.length === 0 && (
                    <div className="py-20 text-center text-slate-500">
                        <p>Belum ada dokumentasi untuk kategori ini.</p>
                    </div>
                )}

                {/* Modal Lightbox */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div
                            className="relative max-h-[90vh] max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                            >
                                <X className="size-8" />
                            </button>

                            {/* Image */}
                            <div className="relative bg-black rounded-lg overflow-hidden">
                                <img
                                    src={selectedImage.image}
                                    alt={selectedImage.title}
                                    className="w-full h-auto max-h-[80vh] object-contain"
                                />

                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                                    <h3 className="text-xl font-semibold text-white">{selectedImage.title}</h3>
                                </div>

                                {/* Navigation Arrows */}
                                {currentImageIndex > 0 && (
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                                    >
                                        <ChevronLeft className="size-6" />
                                    </button>
                                )}

                                {currentImageIndex < filteredFacilities.length - 1 && (
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                                    >
                                        <ChevronRight className="size-6" />
                                    </button>
                                )}

                                {/* Image Counter */}
                                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {filteredFacilities.length}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
