import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import {
    BadgeCheck,
    BookOpen,
    Building2,
    CalendarDays,
    Camera,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    GraduationCap,
    MessageCircle,
    ShieldCheck,
    Users,
    LucideIcon,
} from 'lucide-react';

// Icon mapper untuk convert string ke komponen
const iconMap: Record<string, LucideIcon> = {
    GraduationCap,
    ShieldCheck,
    BookOpen,
    Building2,
    ClipboardList,
    Users,
    CalendarDays,
    BadgeCheck,
    CreditCard,
    CheckCircle2,
    Camera,
    MessageCircle,
};

// Helper function untuk render icon
const getIcon = (iconName: string | LucideIcon) => {
    if (typeof iconName === 'string') {
        return iconMap[iconName] || CreditCard;
    }
    return iconName;
};

const quickPrograms = [
    {
        icon: GraduationCap,
        title: 'Tahfidz Bersanad',
        subtitle: 'Irama & langgam',
    },
    {
        icon: ShieldCheck,
        title: 'Program Leadership & Character Building',
        subtitle: 'Knowing • Being • Doing',
    },
    {
        icon: BookOpen,
        title: 'Arabic & English',
        subtitle: 'Native speaker',
    },
    {
        icon: Building2,
        title: 'IT & Sains',
        subtitle: 'Project-based learning',
    },
];

const defaultFlowSteps = [
    {
        icon: ClipboardList,
        title: 'Konsultasi & Info',
        description:
            'Tanyakan kuota, program, dan persyaratan melalui admin PPDB.',
    },
    {
        icon: Users,
        title: 'Pengisian Data',
        description:
            'Kirim data calon siswa sesuai format yang diberikan admin.',
    },
    {
        icon: CalendarDays,
        title: 'Seleksi & Observasi',
        description:
            'Jadwal seleksi/observasi diinformasikan setelah data diverifikasi.',
    },
    {
        icon: BadgeCheck,
        title: 'Pengumuman',
        description:
            'Hasil seleksi disampaikan melalui WhatsApp atau email resmi.',
    },
];

const biayaItems = [
    {
        icon: CreditCard,
        title: 'Biaya Pendaftaran',
        price: 'Hubungi admin',
        note: 'Termasuk proses administrasi & berkas.',
    },
    {
        icon: CheckCircle2,
        title: 'SPP Bulanan',
        price: 'Hubungi admin',
        note: 'Menyesuaikan program & fasilitas.',
    },
    {
        icon: Building2,
        title: 'Uang Pangkal',
        price: 'Hubungi admin',
        note: 'Pembayaran sesuai ketentuan PPDB.',
    },
];

const defaultFaqs = [
    {
        q: 'Apakah pendaftaran bisa dilakukan online?',
        a: 'Bisa. Proses awal dapat dilakukan melalui admin PPDB untuk konsultasi dan pengisian data.',
    },
    {
        q: 'Dokumen apa saja yang diperlukan?',
        a: 'Umumnya Kartu Keluarga, Akta Kelahiran, dan rapor/surat keterangan sekolah. Detail akan diinformasikan admin PPDB.',
    },
    {
        q: 'Apakah ada tes seleksi?',
        a: 'Ada tahapan seleksi/observasi sesuai program. Jadwal dan ketentuan diinformasikan setelah data diverifikasi.',
    },
    {
        q: 'Bagaimana sistem pembayaran?',
        a: 'Admin PPDB akan memberikan rincian biaya dan metode pembayaran resmi setelah proses pendaftaran berjalan.',
    },
];

const defaultGallery = [
    '/images/PRESTAS.png',
    '/images/PRESTAS.png',
    '/images/Banner-Page.png',
    '/images/Program-Unggulan.png',
    '/images/Program-Unggulan-2.png',
    '/images/Program-Unggulan-3.png',
    '/images/Program-Unggulan-4.png',
    '/images/logo.png',
];

interface Props {
    hero?: {
        title: string;
        description: string;
        registration_url: string;
        banner_image: string;
    } | null;
    programs?: {
        items: Array<{
            title: string;
            subtitle: string;
            icon: string;
        }>;
    } | null;
    flowSteps?: {
        items: Array<{
            title: string;
            description: string;
            icon: string;
        }>;
    } | null;
    fees?: {
        items: Array<{
            title: string;
            price: string;
            note: string;
            icon: string;
        }>;
    } | null;
    faqs?: {
        items: Array<{
            question: string;
            answer: string;
        }>;
    } | null;
    gallery?: {
        images: string[];
    } | null;
    welcome?: {
        badge: string;
        title: string;
        description: string;
        image: string;
        items: string[];
    } | null;
    contactWhatsapp?: string;
}

export default function Pendaftaran({ hero, programs, flowSteps, fees, faqs, gallery: galleryData, welcome, contactWhatsapp }: Props) {
    // Use data from backend, or fallback to hardcoded values
    const heroContent = hero || {
        title: 'Penerimaan Peserta Didik Baru',
        description: 'Bergabung bersama IMAM HAFSH Islamic Boarding School. Proses pendaftaran dibantu admin PPDB untuk memastikan data dan jadwal seleksi rapi.',
        registration_url: 'https://kolaborasitemanbaik.com/ppdb/imam-hafsh-p6swYI',
        banner_image: '/images/Banner-Page.png',
    };

    const programsData = programs?.items || quickPrograms;
    const flowStepsData = flowSteps?.items || defaultFlowSteps;
    const feesData = fees?.items || biayaItems;
    const faqsData = faqs?.items || defaultFaqs;
    const galleryImages = galleryData?.images || defaultGallery;
    const welcomeContent = welcome || {
        badge: 'Sambutan',
        title: 'Selamat Datang di IMAM HAFSH',
        description: 'Kami berkomitmen menghadirkan pendidikan yang menumbuhkan cinta Al-Qur\'an, adab, dan prestasi. PPDB disiapkan agar orang tua mendapatkan informasi yang jelas sebelum bergabung.',
        image: '/images/logo.png',
        items: [
            'Pendampingan harian di asrama',
            'Program Leadership & Character Building',
            'Kegiatan akademik dan non-akademik',
            'Lingkungan aman dan kondusif',
        ],
    };
    
    return (
        <PublicLayout>
            <Head title="PPDB - Imam Hafsh Islamic Boarding School" />

            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500">
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:20px_20px]" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-12 lg:items-center lg:py-20">
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
                            <span className="h-2 w-2 rounded-full bg-amber-300" />
                            PPDB Tahun Ajaran Baru
                        </div>
                        <h1 className="mt-5 text-3xl font-extrabold leading-tight text-amber-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:text-4xl lg:text-5xl">
                            {heroContent.title}
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                            {heroContent.description}
                        </p>

                        <div className="relative z-10 mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button
                                asChild
                                className="relative cursor-pointer rounded-full bg-amber-400 px-6 py-6 text-sm font-semibold text-neutral-900 hover:bg-amber-300"
                                onClick={() => console.log('Button pendaftaran clicked')}
                            >
                                <a href={heroContent.registration_url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">Mulai Pendaftaran</a>
                            </Button>
                            <Button
                                asChild
                                variant="secondary"
                                className="relative cursor-pointer rounded-full bg-white/10 px-6 py-6 text-sm font-semibold text-white hover:bg-white/15"
                                onClick={() => console.log('Button biaya clicked')}
                            >
                                <a href="#biaya" className="cursor-pointer">Lihat Biaya</a>
                            </Button>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {programsData.map((item: any) => {
                                const IconComponent = getIcon(item.icon);
                                return (
                                <div
                                    key={item.title}
                                    className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-white/15">
                                        <IconComponent className="size-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">
                                            {item.title}
                                        </div>
                                        <div className="text-xs text-white/75">
                                            {item.subtitle}
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="relative">
                            <div className="absolute -left-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -bottom-10 -right-10 size-52 rounded-full bg-amber-300/20 blur-2xl" />
                            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5">
                                <img
                                    src={heroContent.banner_image}
                                    alt="Banner PPDB"
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {[
                                    'Asrama nyaman & aman',
                                    'Pembinaan adab & karakter',
                                    'Tahfidz terstruktur',
                                    'Kurikulum terpadu',
                                ].map((t) => (
                                    <div
                                        key={t}
                                        className="flex items-start gap-2 rounded-xl bg-white/10 p-3 text-white"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-4 text-emerald-200" />
                                        <div className="text-xs font-semibold">
                                            {t}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="pendaftaran" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-6">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                                <MessageCircle className="size-4" />
                                Mulai Sekarang
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                                Alur Pendaftaran PPDB
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
                                Kami menjaga proses pendaftaran agar jelas dan
                                terarah. Tim admin PPDB akan membantu dari tahap
                                konsultasi sampai pengumuman.
                            </p>

                            <div className="mt-7 grid gap-4">
                                {flowStepsData.map((step: any) => {
                                    const IconComponent = getIcon(step.icon);
                                    return (
                                    <div
                                        key={step.title}
                                        className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                            <IconComponent className="size-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">
                                                {step.title}
                                            </div>
                                            <div className="mt-1 text-sm text-slate-600">
                                                {step.description}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            <div className="relative z-10 mt-8">
                                <Button asChild className="cursor-pointer rounded-full bg-green-600 hover:bg-green-700">
                                    <a 
                                        href={`https://wa.me/${contactWhatsapp?.replace(/\D/g, '') || '6281234567890'}?text=${encodeURIComponent('Halo, saya ingin bertanya tentang PPDB IMAM HAFSH')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer flex items-center gap-2"
                                    >
                                        <MessageCircle className="size-4" />
                                        Hubungi Admin PPDB
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                {[
                                    {
                                        icon: Camera,
                                        title: 'Lingkungan Asri',
                                        desc: 'Belajar nyaman dengan suasana yang mendukung.',
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: 'Pendampingan',
                                        desc: 'Pembinaan adab dan karakter harian.',
                                    },
                                    {
                                        icon: BookOpen,
                                        title: 'Program Qurani',
                                        desc: 'Tahfidz, tahsin, dan murojaah terarah.',
                                    },
                                    {
                                        icon: GraduationCap,
                                        title: 'Akademik',
                                        desc: 'Kurikulum terstruktur dan project-based.',
                                    },
                                ].map((c) => {
                                    const IconComponent = getIcon(c.icon);
                                    return (
                                    <div
                                        key={c.title}
                                        className="rounded-3xl bg-gradient-to-b from-blue-50 to-white p-6 ring-1 ring-blue-100"
                                    >
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                            <IconComponent className="size-5" />
                                        </div>
                                        <div className="mt-4 text-sm font-semibold text-slate-900">
                                            {c.title}
                                        </div>
                                        <div className="mt-1 text-sm text-slate-600">
                                            {c.desc}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="biaya" className="bg-neutral-50">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                            Informasi Biaya
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                            Rincian Biaya PPDB
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
                            Rincian biaya dapat berubah mengikuti kebijakan.
                            Untuk angka terbaru, silakan hubungi admin PPDB.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {feesData.map((b: any) => {
                            const IconComponent = getIcon(b.icon);
                            return (
                            <div
                                key={b.title}
                                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                        <IconComponent className="size-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {b.title}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            {b.note}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
                                    <div className="text-xs font-semibold text-slate-600">
                                        Estimasi
                                    </div>
                                    <div className="mt-1 text-lg font-semibold text-slate-900">
                                        {b.price}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="relative z-10 w-full cursor-pointer rounded-full hover:bg-green-50 hover:text-green-700"
                                    >
                                        <a 
                                            href={`https://wa.me/${contactWhatsapp?.replace(/\D/g, '') || '6281234567890'}?text=${encodeURIComponent('Halo, saya ingin menanyakan tentang biaya ' + b.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cursor-pointer"
                                        >
                                            Tanya Admin
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-5">
                            <div className="overflow-hidden rounded-3xl bg-slate-100">
                                <img
                                    src={welcomeContent.image}
                                    alt={welcomeContent.badge}
                                    className="h-72 w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                                {welcomeContent.badge}
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
                                {welcomeContent.title}
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                                {welcomeContent.description}
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {welcomeContent.items.map((t) => (
                                    <div
                                        key={t}
                                        className="flex items-start gap-2 rounded-2xl bg-neutral-50 p-4"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
                                        <div className="text-sm font-semibold text-slate-800">
                                            {t}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-neutral-50">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                            Galeri
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                            Suasana Sekolah & Asrama
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {galleryImages.map((src: string) => (
                            <div
                                key={src}
                                className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src={src}
                                        alt="Galeri"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="faq" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                                FAQ
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                                Pertanyaan yang Sering Ditanyakan
                            </h2>
                            <p className="mt-3 text-sm text-neutral-600 sm:text-base">
                                Jika pertanyaan kamu belum terjawab, langsung
                                hubungi admin PPDB.
                            </p>
                            <div className="relative z-10 mt-6 space-y-3">
                                <Button asChild className="cursor-pointer rounded-full bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                                    <a 
                                        href={`https://wa.me/${contactWhatsapp?.replace(/\D/g, '') || '6281234567890'}?text=${encodeURIComponent('Halo Admin PPDB, saya ingin bertanya tentang pendaftaran')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="size-4" />
                                        Chat WhatsApp
                                    </a>
                                </Button>
                                <div className="text-sm text-neutral-600">
                                    <span className="font-semibold">WhatsApp:</span> {contactWhatsapp || '+62 812-3456-7890'}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="rounded-3xl border bg-white p-6 shadow-sm">
                                <Accordion type="single" collapsible>
                                    {faqsData.map((f: any) => (
                                        <AccordionItem
                                            key={f.question}
                                            value={f.question}
                                        >
                                            <AccordionTrigger className="text-slate-900">
                                                {f.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-600">
                                                {f.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

