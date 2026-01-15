import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { formatArticleContent } from '@/utils/formatContent';

interface LiterasiContent {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    main_content: string;
    features_title?: string;
    features: Array<{
        title: string;
        description: string;
        icon: string;
    }>;
    statistics_title?: string;
    statistics: Array<{
        label: string;
        value: string;
    }>;
    image_path: string;
    image_url: string;
    gallery_images: string[];
    meta_title: string;
    meta_description: string;
}

interface Props {
    content: LiterasiContent | null;
}

export default function Literasi({ content }: Props) {
    // If no content, show message to admin
    if (!content) {
        return (
            <PublicLayout>
                <Head title="Literasi - Imam Hafsh Islamic Boarding School" />
                <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-800 mb-4">
                            Halaman Literasi
                        </h1>
                        <p className="text-slate-600">
                            Konten belum tersedia. Silakan tambahkan konten melalui panel admin.
                        </p>
                    </div>
                </div>
            </PublicLayout>
        );
    }
    
    return (
        <PublicLayout>
            <Head 
                title={content.meta_title || content.title} 
                meta={[
                    {
                        name: 'description',
                        content: content.meta_description || content.description,
                    },
                ]}
            />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png?v=1768396337"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12">
                    {content.subtitle && (
                        <h2 className="text-xl font-bold text-blue-600 md:text-2xl">
                            {content.subtitle}
                        </h2>
                    )}
                    <h1 className="text-2xl font-bold text-slate-800 md:text-3xl lg:text-4xl">
                        {content.title}
                    </h1>
                    {content.description && (
                        <p className="mt-4 text-lg text-slate-600">
                            {content.description}
                        </p>
                    )}
                </div>

                {/* Content Section 1: Text + Main Image */}
                <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="prose prose-lg max-w-none text-slate-600">
                        <div 
                            className="article-content space-y-6 text-justify"
                            dangerouslySetInnerHTML={{ __html: formatArticleContent(content.main_content) }} 
                        />
                    </div>
                    {content.image_path && (
                        <div>
                            <img
                                src={content.image_url || content.image_path}
                                alt={content.title}
                                className="h-full w-full rounded-xl object-cover shadow-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/Prestasi-Tim-Literasi-Sekolah-SMP-Bina-Qurani-Islamic-Boarding-School-Kota-Bogor-768x768.jpeg';
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Features Section (if available) */}
                {content.features && content.features.length > 0 && (
                    <div className="mb-12">
                        <h3 className="mb-8 text-2xl font-bold text-slate-800">
                            {content.features_title || 'Keunggulan Program Literasi'}
                        </h3>
                        <div className="grid gap-6 md:grid-cols-3">
                            {content.features.map((feature, index) => (
                                <div key={index} className="rounded-xl bg-white p-6 shadow-lg">
                                    {feature.icon && <div className="mb-4 text-4xl">{feature.icon}</div>}
                                    <h4 className="mb-2 text-lg font-semibold text-slate-800">{feature.title}</h4>
                                    <p className="text-slate-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Statistics Section (if available) */}
                {content.statistics && content.statistics.length > 0 && (
                    <div className="mb-12">
                        {content.statistics_title && (
                            <h3 className="mb-8 text-2xl font-bold text-slate-800">
                                {content.statistics_title}
                            </h3>
                        )}
                        <div className="grid gap-6 md:grid-cols-3">
                            {content.statistics.map((stat, index) => (
                                <div key={index} className="rounded-xl bg-blue-50 p-6 text-center">
                                    <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                                    <div className="text-slate-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Gallery Row */}
                {content.gallery_images && content.gallery_images.length > 0 && (
                    <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {content.gallery_images.map((src, index) => (
                            <div key={index} className="overflow-hidden rounded-xl bg-slate-100 shadow-md">
                                <img
                                    src={src}
                                    alt={`Library Activity ${index + 1}`}
                                    className="h-40 w-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Additional Content Section - Removed hardcoded content */}
            </div>
        </PublicLayout>
    );
}
