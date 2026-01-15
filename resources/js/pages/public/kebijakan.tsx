import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Shield, ShieldCheck, Users, Heart, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';

interface KebijakanContent {
    id: number;
    hero_badge: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    hero_image_url: string;
    intro_title: string;
    intro_content: string;
    bullying_title: string;
    bullying_content: string;
    bullying_points: string[];
    bullying_image: string;
    bullying_image_url: string;
    lgbt_title: string;
    lgbt_content: string;
    lgbt_points: string[];
    lgbt_image: string;
    lgbt_image_url: string;
    environment_title: string;
    environment_content: string;
    environment_features: string[] | Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    environment_image: string;
    environment_image_url: string;
    commitment_title: string;
    commitment_content: string;
    commitment_items: string[];
}

interface Props {
    content: KebijakanContent | null;
}

const iconMap: Record<string, any> = {
    'shield-check': ShieldCheck,
    'users': Users,
    'heart': Heart,
    'book-open': BookOpen,
};

export default function Kebijakan({ content }: Props) {
    if (!content) {
        return (
            <PublicLayout>
                <Head title="Kebijakan Dan Norma" />
                <div className="container mx-auto max-w-7xl px-4 py-16">
                    <div className="text-center text-neutral-500">
                        <p>Konten kebijakan belum tersedia.</p>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={`${content.hero_title} - Imam Hafsh Islamic Boarding School`} />

            {/* Hero Section */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png?v=1768396337"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="bg-white" style={{ backgroundImage: 'none', backgroundAttachment: 'scroll' }}>
            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                {/* Hero Content */}
                <div className="mb-16 text-center">
                    <div className="mb-4 inline-block rounded-full bg-red-100 px-6 py-2 text-sm font-bold text-red-700">
                        <Shield className="mr-2 inline-block h-4 w-4" />
                        {content.hero_badge}
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
                        {content.hero_title}
                    </h1>
                    {content.hero_subtitle && (
                        <p className="mt-4 text-base text-neutral-600 md:text-lg">
                            {content.hero_subtitle}
                        </p>
                    )}
                </div>

                {/* Introduction Section */}
                {content.intro_title && (
                    <div className="mb-16 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="text-2xl font-bold text-blue-900 md:text-3xl">
                                {content.intro_title}
                            </h2>
                            <div
                                className="prose prose-lg mx-auto mt-6 text-neutral-700"
                                dangerouslySetInnerHTML={{ __html: content.intro_content }}
                            />
                        </div>
                    </div>
                )}

                {/* Anti Bullying Section */}
                <div className="mb-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-6">
                            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700">
                                <AlertTriangle className="h-4 w-4" />
                                Zero Tolerance
                            </div>
                            <h2 className="mt-4 text-2xl font-bold text-neutral-900 md:text-3xl">
                                {content.bullying_title}
                            </h2>
                            <div
                                className="prose mt-4 text-neutral-600"
                                dangerouslySetInnerHTML={{ __html: content.bullying_content }}
                            />

                            <div className="mt-8 space-y-3">
                                {content.bullying_points.map((point, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                                        <div className="text-sm font-medium text-neutral-800">
                                            {point}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
                                <img
                                    src={content.bullying_image_url || content.bullying_image || '/images/Banner-Page.png'}
                                    alt={content.bullying_title}
                                    className="h-auto w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Anti LGBT Section */}
                <div className="mb-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="order-2 lg:order-1 lg:col-span-6">
                            <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
                                <img
                                    src={content.lgbt_image_url || content.lgbt_image || '/images/PRESTAS.png'}
                                    alt={content.lgbt_title}
                                    className="h-auto w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 lg:col-span-6">
                            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
                                <Shield className="h-4 w-4" />
                                Nilai Islam
                            </div>
                            <h2 className="mt-4 text-2xl font-bold text-neutral-900 md:text-3xl">
                                {content.lgbt_title}
                            </h2>
                            <div
                                className="prose mt-4 text-neutral-600"
                                dangerouslySetInnerHTML={{ __html: content.lgbt_content }}
                            />

                            <div className="mt-8 space-y-3">
                                {content.lgbt_points.map((point, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                                        <div className="text-sm font-medium text-neutral-800">
                                            {point}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safe Environment Section */}
                <div className="mb-16 rounded-3xl bg-gradient-to-br from-sky-50 to-cyan-50 p-8 md:p-12">
                    <div className="text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-6 py-2 text-sm font-bold text-sky-700">
                            <ShieldCheck className="h-4 w-4" />
                            Safe Environment
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
                            {content.environment_title}
                        </h2>
                        <div
                            className="prose prose-lg mx-auto mt-4 text-neutral-700"
                            dangerouslySetInnerHTML={{ __html: content.environment_content }}
                        />
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {content.environment_features.map((feature, index) => {
                            // Parse feature string format: "icon|title|description"
                            const featureData = typeof feature === 'string' 
                                ? feature.split('|') 
                                : [feature.icon, feature.title, feature.description];
                            const [iconName, title, description] = featureData;
                            const Icon = iconMap[iconName] || Shield;
                            
                            return (
                                <div
                                    key={index}
                                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="mb-4 inline-flex rounded-xl bg-sky-100 p-3">
                                        <Icon className="h-6 w-6 text-sky-700" />
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900">
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm text-neutral-600">
                                        {description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Commitment Section */}
                <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-white p-8 md:p-12 shadow-md">
                    <div className="text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-6 py-2 text-sm font-bold text-blue-700">
                            <Heart className="h-4 w-4" />
                            Our Promise
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
                            {content.commitment_title}
                        </h2>
                        <div
                            className="prose prose-lg mx-auto mt-4 text-neutral-700"
                            dangerouslySetInnerHTML={{ __html: content.commitment_content }}
                        />
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {content.commitment_items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm"
                            >
                                <div className="flex-shrink-0 rounded-full bg-blue-100 p-1">
                                    <CheckCircle2 className="h-5 w-5 text-blue-700" />
                                </div>
                                <div className="text-sm font-medium text-neutral-800">
                                    {item}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-center text-white md:p-12">
                    <h3 className="text-2xl font-bold md:text-3xl">
                        Bergabunglah dengan Lingkungan Pendidikan yang Aman
                    </h3>
                    <p className="mx-auto mt-4 max-w-2xl text-white/90">
                        Kami berkomitmen penuh untuk menjaga amanah Anda dengan menciptakan
                        lingkungan pendidikan yang aman, islami, dan kondusif untuk perkembangan optimal putra-putri Anda.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href="/pendaftaran"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                        >
                            Daftar Sekarang
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </div>
            </div>
        </PublicLayout>
    );
}
