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
} from 'lucide-react';

const quickPrograms = [
    {
        icon: GraduationCap,
        title: 'Tahfidz Bersanad',
        subtitle: 'Irama & langgam',
    },
    {
        icon: ShieldCheck,
        title: 'Internalisasi Adab',
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

const flowSteps = [
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

const faqs = [
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

const gallery = [
    '/images/PRESTAS.png',
    '/images/PRESTAS.png',
    '/images/Banner-Page.png',
    '/images/Program-Unggulan.png',
    '/images/Program-Unggulan-2.png',
    '/images/Program-Unggulan-3.png',
    '/images/Program-Unggulan-4.png',
    '/images/logo.png',
];

export default function Pendaftaran() {
    return (
        <PublicLayout>
            <Head title="PPDB - Pendaftaran Siswa Baru" />

            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500">
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:20px_20px]" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-12 lg:items-center lg:py-20">
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
                            <span className="h-2 w-2 rounded-full bg-amber-300" />
                            PPDB Tahun Ajaran Baru
                        </div>
                        <h1 className="mt-5 text-3xl font-extrabold leading-tight text-amber-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:text-4xl lg:text-5xl">
                            Penerimaan Peserta Didik Baru
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                            Bergabung bersama IMAM HAFSH Islamic Boarding School.
                            Proses pendaftaran dibantu admin PPDB untuk memastikan
                            data dan jadwal seleksi rapi.
                        </p>

                        <div className="relative z-10 mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button
                                asChild
                                className="relative cursor-pointer rounded-full bg-amber-400 px-6 py-6 text-sm font-semibold text-neutral-900 hover:bg-amber-300"
                                onClick={() => console.log('Button pendaftaran clicked')}
                            >
                                <a href="https://kolaborasitemanbaik.com/ppdb/imam-hafsh-p6swYI" target="_blank" rel="noopener noreferrer" className="cursor-pointer">Mulai Pendaftaran</a>
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
                            {quickPrograms.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-white"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-white/15">
                                        <item.icon className="size-5" />
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
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="relative">
                            <div className="absolute -left-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -bottom-10 -right-10 size-52 rounded-full bg-amber-300/20 blur-2xl" />
                            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5">
                                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white/10">
                                    <img
                                        src="/images/Banner-Page.png"
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
                                {flowSteps.map((step) => (
                                    <div
                                        key={step.title}
                                        className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                            <step.icon className="size-5" />
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
                                ))}
                            </div>

                            <div className="relative z-10 mt-8">
                                <Button asChild className="cursor-pointer rounded-full">
                                    <a href="#kontak" className="cursor-pointer">Hubungi Admin PPDB</a>
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
                                ].map((c) => (
                                    <div
                                        key={c.title}
                                        className="rounded-3xl bg-gradient-to-b from-blue-50 to-white p-6 ring-1 ring-blue-100"
                                    >
                                        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                            <c.icon className="size-5" />
                                        </div>
                                        <div className="mt-4 text-sm font-semibold text-slate-900">
                                            {c.title}
                                        </div>
                                        <div className="mt-1 text-sm text-slate-600">
                                            {c.desc}
                                        </div>
                                    </div>
                                ))}
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
                        {biayaItems.map((b) => (
                            <div
                                key={b.title}
                                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                                        <b.icon className="size-5" />
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
                                        className="relative z-10 w-full cursor-pointer rounded-full"
                                    >
                                        <a href="#kontak" className="cursor-pointer">Tanya Admin</a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-5">
                            <div className="overflow-hidden rounded-3xl bg-slate-100">
                                <img
                                    src="/images/logo.png"
                                    alt="Sambutan"
                                    className="h-72 w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                                Sambutan
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
                                Selamat Datang di IMAM HAFSH
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                                Kami berkomitmen menghadirkan pendidikan yang
                                menumbuhkan cinta Al-Qur’an, adab, dan prestasi.
                                PPDB disiapkan agar orang tua mendapatkan
                                informasi yang jelas sebelum bergabung.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {[
                                    'Pendampingan harian di asrama',
                                    'Pembiasaan ibadah dan adab',
                                    'Kegiatan akademik dan non-akademik',
                                    'Lingkungan aman dan kondusif',
                                ].map((t) => (
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
                        {gallery.map((src) => (
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
                            <div className="relative z-10 mt-6">
                                <Button asChild className="cursor-pointer rounded-full">
                                    <a href="#kontak" className="cursor-pointer">Kontak Admin</a>
                                </Button>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="rounded-3xl border bg-white p-6 shadow-sm">
                                <Accordion type="single" collapsible>
                                    {faqs.map((f) => (
                                        <AccordionItem
                                            key={f.q}
                                            value={f.q}
                                        >
                                            <AccordionTrigger className="text-slate-900">
                                                {f.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-600">
                                                {f.a}
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

