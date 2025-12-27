import PublicLayout from '@/layouts/public-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { defaultContent } from '@/data/defaultContent';
import { defaultPrograms, programThemes } from '@/data/programs';
import DonationSection from '@/components/DonationSection';
import {
    ArrowRight,
    Camera,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Instagram,
    Languages,
    Laptop,
    Newspaper,
    ShieldCheck,
    Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';

 export default function Home() {
     const { heroSlides: dbHeroSlides, homeSections, latestArticles, testimonies, mentors: dbMentors, activities: dbActivities, donationEmbeds } = usePage<{ 
         heroSlides: Array<{
             id: number;
             title: string;
             subtitle: string | null;
             image: string;
             button_text: string | null;
             button_link: string | null;
             order: number;
             is_active: boolean;
         }>;
         latestArticles: Array<{
             id: number;
             title: string;
             slug: string;
             excerpt: string | null;
             image: string | null;
             category: string | null;
             published_at: string;
             author: string | null;
         }>;
         testimonies: Array<{
             id: number;
             name: string;
             role: string;
             content: string;
             rating: number;
             image: string | null;
             is_active: boolean;
         }>;
         mentors: Array<{
             id: number;
             name: string;
             title: string;
             quote: string;
             img: string;
             category: string;
         }>;
         activities: Array<{
             id: number;
             title: string;
             src: string;
             category: string;
         }>;
         donationEmbeds: Array<{
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
         }>;
         homeSections: {
             about?: {
                 id: number;
                 title: string;
                 subtitle: string | null;
                 content: string | null;
                 image: string | null;
                 image_alt: string | null;
                 badge_text: string | null;
                 button_text: string | null;
                 button_link: string | null;
                 meta: any;
             };
             alasan?: {
                 id: number;
                 title: string;
                 subtitle: string | null;
                 content: string | null;
                 image: string | null;
                 image_alt: string | null;
                 badge_text: string | null;
                 button_text: string | null;
                 button_link: string | null;
                 meta: any;
             };
             pendidikan?: {
                 id: number;
                 title: string;
                 subtitle: string | null;
                 content: string | null;
                 image: string | null;
                 image_alt: string | null;
                 badge_text: string | null;
                 button_text: string | null;
                 button_link: string | null;
                 meta: any;
             };
             galeri?: {
                 id: number;
                 title: string;
                 subtitle: string | null;
                 content: string | null;
                 image: string | null;
                 image_alt: string | null;
                 badge_text: string | null;
                 button_text: string | null;
                 button_link: string | null;
                 meta: any;
             };
             artikel?: {
                 id: number;
                 title: string;
                 subtitle: string | null;
                 content: string | null;
                 image: string | null;
                 image_alt: string | null;
                 badge_text: string | null;
                 button_text: string | null;
                 button_link: string | null;
                 meta: any;
             };
         };
     }>().props;

     const [activeHeroSlide, setActiveHeroSlide] = useState(0);
     const [currentTestimonial, setCurrentTestimonial] = useState(0);
     const [itemsPerScreen, setItemsPerScreen] = useState(1);
     const [currentMentor, setCurrentMentor] = useState(0);
     const [facilityPerScreen, setFacilityPerScreen] = useState(1);
     const [currentFacility, setCurrentFacility] = useState(0);

     // Auto slide hero
     useEffect(() => {
         if (!dbHeroSlides || dbHeroSlides.length <= 1) return;
         
         const interval = setInterval(() => {
             setActiveHeroSlide((prev) => (prev + 1) % dbHeroSlides.length);
         }, 5000); // Change slide every 5 seconds

         return () => clearInterval(interval);
     }, [dbHeroSlides]);

     useEffect(() => {
         const handleResize = () => {
             if (window.innerWidth >= 1024) setItemsPerScreen(3);
             else if (window.innerWidth >= 640) setItemsPerScreen(2);
             else setItemsPerScreen(1);
         };

         handleResize();
         window.addEventListener('resize', handleResize);
         return () => window.removeEventListener('resize', handleResize);
     }, []);

     useEffect(() => {
         const handleResizeFacilities = () => {
             if (window.innerWidth >= 1024) setFacilityPerScreen(4);
             else if (window.innerWidth >= 640) setFacilityPerScreen(2);
             else setFacilityPerScreen(1);
         };
 
         handleResizeFacilities();
         window.addEventListener('resize', handleResizeFacilities);
         return () => window.removeEventListener('resize', handleResizeFacilities);
     }, []);

     const nextTestimonial = () => {
        const testimonialList = testimonies && testimonies.length > 0 ? testimonies : defaultContent.fallbacks.testimonials;
         setCurrentTestimonial((prev) => (prev + 1) % testimonialList.length);
     };

     const prevTestimonial = () => {
        const testimonialList = testimonies && testimonies.length > 0 ? testimonies : defaultContent.fallbacks.testimonials;
         setCurrentTestimonial(
             (prev) => (prev - 1 + testimonialList.length) % testimonialList.length,
         );
     };

     const nextMentor = () => {
        const mentorList = (dbMentors && dbMentors.length > 0 ? dbMentors : defaultContent.fallbacks.mentors);
         if (mentorList.length === 0) return;
         setCurrentMentor((prev) => (prev + 1) % mentorList.length);
     };
     const prevMentor = () => {
        const mentorList = (dbMentors && dbMentors.length > 0 ? dbMentors : defaultContent.fallbacks.mentors);
         setCurrentMentor((prev) => (prev - 1 + mentorList.length) % mentorList.length);
     };
 
     const nextFacility = () => {
        const activityList = (dbActivities && dbActivities.length > 0 ? dbActivities : defaultContent.fallbacks.activities);
         if (activityList.length === 0) return;
         setCurrentFacility((prev) => (prev + 1) % activityList.length);
     };
     const prevFacility = () => {
        const activityList = (dbActivities && dbActivities.length > 0 ? dbActivities : defaultContent.fallbacks.activities);
         setCurrentFacility((prev) => (prev - 1 + activityList.length) % activityList.length);
     };

    return (
        <PublicLayout>
            <Head title="Home">
                <link rel="preconnect" href="https://temenbaik.com" />
                <link rel="dns-prefetch" href="https://temenbaik.com" />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500">
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:20px_20px]" />
                <div className="relative mx-auto grid min-h-[560px] max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 lg:min-h-[640px] lg:grid-cols-12 lg:py-16">
                    <div className="order-2 lg:order-1 lg:col-span-6">
                        {dbHeroSlides && dbHeroSlides.length > 0 ? (
                            <>
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
                                    <span className="h-2 w-2 rounded-full bg-amber-300" />
                                    Penerimaan Santri Baru
                                </div>

                                <h1 className="mt-5 text-4xl font-extrabold leading-tight text-amber-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:text-5xl lg:text-6xl">
                                    {dbHeroSlides[activeHeroSlide]?.title || 'IMAM HAFSH BOARDING SCHOOL'}
                                </h1>

                                {dbHeroSlides[activeHeroSlide]?.subtitle && (
                                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                                        {dbHeroSlides[activeHeroSlide].subtitle}
                                    </p>
                                )}

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    {dbHeroSlides[activeHeroSlide]?.button_text && dbHeroSlides[activeHeroSlide]?.button_link ? (
                                        dbHeroSlides[activeHeroSlide].button_link.startsWith('http') || dbHeroSlides[activeHeroSlide].button_link.startsWith('#') ? (
                                            <a
                                                href={dbHeroSlides[activeHeroSlide].button_link}
                                                className="relative z-10 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-amber-300 cursor-pointer"
                                                {...(dbHeroSlides[activeHeroSlide].button_link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                                onClick={(e) => {
                                                    console.log('Button clicked!', dbHeroSlides[activeHeroSlide].button_link);
                                                }}
                                            >
                                                {dbHeroSlides[activeHeroSlide].button_text}
                                            </a>
                                        ) : (
                                            <Link
                                                href={dbHeroSlides[activeHeroSlide].button_link}
                                                className="relative z-10 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-amber-300 cursor-pointer"
                                            >
                                                {dbHeroSlides[activeHeroSlide].button_text}
                                            </Link>
                                        )
                                    ) : (
                                        <a
                                            href="#program"
                                            className="relative z-10 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-amber-300 cursor-pointer"
                                        >
                                            Daftar Sekarang
                                        </a>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
                                    <span className="h-2 w-2 rounded-full bg-amber-300" />
                                    {defaultContent.hero.badge}
                                </div>

                                <h1 className="mt-5 text-4xl font-extrabold leading-tight text-amber-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] sm:text-5xl lg:text-6xl">
                                    {defaultContent.hero.title.split('\n').map((line, i) => (
                                        <span key={i}>
                                            {line}
                                            {i === 0 && <br />}
                                        </span>
                                    ))}
                                </h1>

                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                                    {defaultContent.hero.subtitle}
                                </p>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <a
                                        href="#program"
                                        className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-amber-300"
                                    >
                                        {defaultContent.hero.button}
                                    </a>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="order-1 lg:order-2 lg:col-span-6">
                        <div className="relative overflow-hidden">
                            <div className="relative h-[280px] w-full sm:h-[360px] lg:h-[520px]">
                                {dbHeroSlides && dbHeroSlides.length > 0 ? (
                                    dbHeroSlides.map((slide, idx) => (
                                        <img
                                            key={slide.id}
                                            src={slide.image}
                                            alt={slide.title}
                                            className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-700 ${
                                                idx === activeHeroSlide
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            }`}
                                        />
                                    ))
                                ) : (
                                    <img
                                        src="/images/Program-Unggulan.png"
                                        alt="Hero"
                                        className="h-full w-full object-contain object-center"
                                    />
                                )}
                            </div>

                            {dbHeroSlides && dbHeroSlides.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
                                    {dbHeroSlides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() =>
                                                setActiveHeroSlide(idx)
                                            }
                                            className={`h-2.5 w-2.5 rounded-full transition ${
                                                idx === activeHeroSlide
                                                    ? 'bg-white'
                                                    : 'bg-white/40 hover:bg-white/70'
                                            }`}
                                            aria-label={`Slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        
                {/* end hero section */}
            </section>
            {/* way as section */}
            <section>
                <img src="/images/Banner-begarund.png" alt="" />
            </section>

            <section id="program" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                            Welcome
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                            Program Unggulan
                        </h2>
                        <p className="mt-2 text-sm font-medium text-gray-900 sm:text-base">
                             IMAM HAFSH Islamic Boarding School Kota Bogor
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {defaultPrograms.map((item, index) => {
                            const theme = programThemes[index] ?? programThemes[0];

                            return (
                            <div
                                key={item.id}
                                className={`group relative overflow-hidden rounded-[34px] ${theme.card} p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
                            >
                                <div className={`pointer-events-none absolute -right-10 -top-10 size-44 rounded-full ${theme.halo} blur-2xl`} />
                                <div className="relative">
                                    <div className="mx-auto flex size-28 items-center justify-center">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-300 w-300 object-contain"
                                                loading="lazy"
                                            />
                                        ) : null}
                                    </div>

                                    <div className={`mt-6 text-center text-lg font-semibold leading-snug ${theme.accent}`}>
                                        {item.title}
                                    </div>
                                    <div className="mx-auto mt-3 max-w-[18rem] text-center text-sm leading-relaxed text-neutral-600">
                                        {item.description}
                                    </div>

                                    <div className="mt-6 flex items-center justify-center">
                                        <div className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold ${theme.button}`}>
                                            <ArrowRight className="size-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="about" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-6">
                            <div className="mx-auto max-w-lg">
                                <img
                                    src={homeSections?.about?.image ? `/${homeSections.about.image}` : "/images/PRESTAS.png"}
                                    alt={homeSections?.about?.image_alt || "Prestasi santri"}
                                    className="h-auto w-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                                {homeSections?.about?.badge_text || 'About Us'}
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                                {homeSections?.about?.title || 'Imam Hafsh Islamic Boarding School'}
                            </h2>
                            {homeSections?.about?.subtitle && (
                                <p className="mt-3 text-base font-medium text-neutral-700">
                                    {homeSections.about.subtitle}
                                </p>
                            )}
                            {homeSections?.about?.content ? (
                                <div 
                                    className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base"
                                    dangerouslySetInnerHTML={{ __html: homeSections.about.content }}
                                />
                            ) : (
                                <>
                                    <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
                                        Imam Hafsh Islamic Boarding School adalah pondok pesantren
                                        yang berpemahaman Ahlussunnah wal Jama�ah sebagai
                                        landasan utama dalam seluruh kegiatan pembelajaran
                                        dan pengasuhan. Para santri diajarkan untuk
                                        memahami Alquran dan As-Sunnah secara mendalam,
                                        serta berpegang teguh pada ajaran Islam yang benar.
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
                                        Imam Hafsh Islamic Boarding School merupakan lembaga
                                        pendidikan formal berasrama jenjang SMP putera
                                        sederajat, yang telah <span className="font-semibold text-neutral-800">Terakreditasi A</span> berdasarkan
                                        surat keputusan no.267/BAN-PDM/SK/2024. Memiliki
                                        fasilitas terbaik untuk menunjang kenyamanan dan
                                        kesuksesan proses pembelajaran peserta didik.
                                    </p>
                                </>
                            )}

                            {homeSections?.about?.button_text && homeSections?.about?.button_link && (
                                <div className="mt-7">
                                    {homeSections.about.button_link.startsWith('http') ? (
                                        <a
                                            href={homeSections.about.button_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                                        >
                                            {homeSections.about.button_text}
                                            <ArrowRight className="size-4" />
                                        </a>
                                    ) : (
                                        <Link
                                            href={homeSections.about.button_link}
                                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                                        >
                                            {homeSections.about.button_text}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section id="alasan" className="bg-neutral-50">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-6">
                            <div className="mx-auto max-w-xl">
                                <img
                                    src={homeSections?.alasan?.image ? `/${homeSections.alasan.image}` : "/images/PRESTAS.png"}
                                    alt={homeSections?.alasan?.image_alt || "Santri berprestasi"}
                                    className="h-auto w-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                                {homeSections?.alasan?.badge_text || defaultContent.alasan.badge}
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                                {homeSections?.alasan?.title || defaultContent.alasan.title}
                            </h2>
                            {homeSections?.alasan?.subtitle && (
                                <p className="mt-3 text-base font-medium text-neutral-700">
                                    {homeSections.alasan.subtitle}
                                </p>
                            )}
                            
                            <div 
                                className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base"
                                dangerouslySetInnerHTML={{ 
                                    __html: homeSections?.alasan?.content || `<p>${defaultContent.alasan.content}</p>`
                                }}
                            />

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {(homeSections?.alasan?.meta?.list_items && Array.isArray(homeSections.alasan.meta.list_items) && homeSections.alasan.meta.list_items.length > 0
                                    ? homeSections.alasan.meta.list_items
                                    : defaultContent.alasan.list
                                ).map((text) => (
                                    <div
                                        key={text}
                                        className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                                        <div className="text-sm font-semibold text-neutral-800">
                                            {text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* about as section */}

            <section id="pendidikan" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="order-2 lg:order-1 lg:col-span-6">
                            <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                                {homeSections?.pendidikan?.badge_text || 'Kebijakan Dan Norma'}
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                                {homeSections?.pendidikan?.title || 'Imam Hafsh Tanpa Bullying & LGBT'}
                            </h2>
                            {homeSections?.pendidikan?.subtitle ? (
                                <p className="mt-3 text-base font-medium text-neutral-700">
                                    {homeSections.pendidikan.subtitle}
                                </p>
                            ) : (
                                <div className="mt-3 text-sm font-semibold text-neutral-700">
                                    #BQAgainstBullying #SafeSchoolEnvironment
                                </div>
                            )}
                            
                            {homeSections?.pendidikan?.content ? (
                                <div 
                                    className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base"
                                    dangerouslySetInnerHTML={{ __html: homeSections.pendidikan.content }}
                                />
                            ) : (
                                <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
                                    Dengan penuh keyakinan dan keteguhan, BQ Islamic
                                    Boarding School menegaskan komitmennya untuk
                                    melawan segala bentuk bullying dan aktivitas
                                    menyimpang LGBT. Kami menempatkan keamanan dan
                                    kenyamanan siswa sebagai prioritas utama. Langkah
                                    nyata serta tindakan kami terkait masalah ini
                                    adalah kampanye pendidikan anti bullying yang
                                    dimulai sejak masa Pengenalan Lingkungan Sekolah,
                                    serta pengawalan penuh selama siswa berada di BQ
                                    Islamic Boarding School.
                                </p>
                            )}

                            {homeSections?.pendidikan?.button_text && homeSections?.pendidikan?.button_link && (
                                <div className="mt-7">
                                    {homeSections.pendidikan.button_link.startsWith('http') ? (
                                        <a
                                            href={homeSections.pendidikan.button_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                                        >
                                            {homeSections.pendidikan.button_text}
                                            <ArrowRight className="size-4" />
                                        </a>
                                    ) : (
                                        <Link
                                            href={homeSections.pendidikan.button_link}
                                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                                        >
                                            {homeSections.pendidikan.button_text}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="order-1 lg:order-2 lg:col-span-6">
                            <div className="relative mx-auto max-w-xl">
                                <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-amber-200/60 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-12 -left-10 size-52 rounded-full bg-sky-200/70 blur-3xl" />
                                <div className="relative overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm">
                                    <img
                                        src={homeSections?.pendidikan?.image ? `/${homeSections.pendidikan.image}` : "/images/Pendidikan.jpg"}
                                        alt={homeSections?.pendidikan?.image_alt || "Lingkungan pendidikan"}
                                        className="h-auto w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* way as section */}
            <section
                id="galeri"
                className="relative overflow-hidden bg-gradient-to-r from-sky-100 via-white to-indigo-100"
            >
                <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_1px_1px,rgba(37,99,235,0.18)_1px,transparent_0)] [background-size:22px_22px]" />
                <div className="pointer-events-none absolute -left-24 top-10 size-[420px] rounded-full bg-sky-200/60 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full bg-indigo-200/60 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-16">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                            {homeSections?.galeri?.badge_text || 'Project Galleries'}
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                            {homeSections?.galeri?.title || 'Project Siswa SMP Imam Hafsh'}
                        </h2>
                        {homeSections?.galeri?.subtitle && (
                            <p className="mt-3 text-base font-medium text-neutral-700">
                                {homeSections.galeri.subtitle}
                            </p>
                        )}
                    </div>

                    <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-6">
                            {homeSections?.galeri?.content ? (
                                <div 
                                    className="text-sm leading-relaxed text-neutral-600 sm:text-base"
                                    dangerouslySetInnerHTML={{ __html: homeSections.galeri.content }}
                                />
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold text-blue-700 sm:text-2xl">
                                        Project Siswa
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
                                        Project siswa merupakan karya santri Bina Qurani,
                                        fokus dalam proyek ini adalah bertujuan agar setiap
                                        peserta didik dapat mengembangkan minat dan bakat,
                                        serta keterampilan melalui proses perencanaan dan
                                        perancangan project siswa dengan terlibat secara
                                        langsung melalui produk yang nyata.
                                    </p>
                                </>
                            )}

                            {homeSections?.galeri?.button_text && homeSections?.galeri?.button_link && (
                                <div className="mt-7">
                                    {homeSections.galeri.button_link.startsWith('http') ? (
                                        <a
                                            href={homeSections.galeri.button_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                                        >
                                            {homeSections.galeri.button_text}
                                            <ArrowRight className="size-4" />
                                        </a>
                                    ) : (
                                        <Link
                                            href={homeSections.galeri.button_link}
                                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
                                        >
                                            {homeSections.galeri.button_text}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-6">
                            <div className="relative mx-auto flex max-w-xl items-center justify-center">
                                <div className="relative h-[300px] w-full sm:h-[360px]">
                                    <div className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-200/70" />
                                    <div className="absolute left-1/2 top-1/2 size-[236px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sky-200/70 to-indigo-200/70" />
                                    <div className="absolute left-1/2 top-1/2 size-[188px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/70 bg-white shadow-sm">
                                        <img
                                            src={homeSections?.galeri?.image ? `/${homeSections.galeri.image}` : "/images/PRESTAS.png"}
                                            alt={homeSections?.galeri?.image_alt || "Project siswa"}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="absolute left-6 top-10 flex items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-neutral-200">
                                        <Laptop className="size-5 text-blue-700" />
                                    </div>
                                    <div className="absolute right-10 top-6 flex items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-neutral-200">
                                        <GraduationCap className="size-5 text-blue-700" />
                                    </div>
                                    <div className="absolute bottom-10 left-10 flex items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-neutral-200">
                                        <Camera className="size-5 text-blue-700" />
                                    </div>
                                    <div className="absolute bottom-8 right-6 flex items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-neutral-200">
                                        <Languages className="size-5 text-blue-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="donasi" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                            Donasi
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                            Program Donasi
                        </h2>
                        <p className="mt-3 text-base text-neutral-600">
                            Mari berpartisipasi dalam kegiatan sosial dan berbagi kebaikan
                        </p>
                    </div>

                    <div className="mt-12">
                        <DonationSection 
                            donationEmbeds={donationEmbeds} 
                            className="flex justify-center"
                        />
                    </div>
                </div>
            </section>

           <section id="artikel" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-6">
                            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
                                <img
                                    src={homeSections?.artikel?.image ? `/${homeSections.artikel.image}` : "/images/PRESTAS.png"}
                                    alt={homeSections?.artikel?.image_alt || "Artikel pilihan"}
                                    className="h-auto w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                                        <Newspaper className="size-4" />
                                        {homeSections?.artikel?.badge_text || 'Artikel Terbaru'}
                                    </div>
                                    <h2 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-3xl">
                                        {homeSections?.artikel?.title || 'Inspiring Articles'}
                                    </h2>
                                </div>
                                {homeSections?.artikel?.button_link && (
                                    <a
                                        href={homeSections.artikel.button_link}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                                    >
                                        {homeSections?.artikel?.button_text || 'See More'} <ArrowRight className="size-4" />
                                    </a>
                                )}
                            </div>
                            <div className="mt-8 space-y-4">
                                {latestArticles && latestArticles.length > 0 ? (
                                    latestArticles.map((article) => (
                                        <div
                                            key={article.id}
                                            className="flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md"
                                        >
                                            <div className="aspect-[4/3] w-32 overflow-hidden rounded-2xl bg-neutral-100">
                                                <img
                                                    src={article.image || '/images/PRESTAS.png'}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    {article.category && (
                                                        <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                            {article.category}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-neutral-500">
                                                        {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-sm font-semibold text-neutral-900 sm:text-base">
                                                    {article.title}
                                                </div>
                                                {article.excerpt && (
                                                    <div className="mt-1 text-sm text-neutral-600">
                                                        {article.excerpt}
                                                    </div>
                                                )}
                                                <a href={`/articles/${article.slug}`} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                                                    Read <ArrowRight className="size-4" />
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-neutral-500 py-8">
                                        Belum ada artikel tersedia
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section id="testimoni" className="bg-neutral-50">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                            Testimoni
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                            Apa Kata Mereka
                        </h2>
                    </div>

                    <div className="relative mt-12">
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{
                                    transform: `translateX(-${currentTestimonial * (100 / itemsPerScreen)}%)`,
                                }}
                            >
                                {(testimonies && testimonies.length > 0 ? testimonies : defaultContent.fallbacks.testimonials).map((item, index) => (
                                    <div
                                        key={index}
                                        className="w-full flex-shrink-0 px-3 sm:w-1/2 lg:w-1/3"
                                    >
                                        <div className="flex h-full flex-col justify-between rounded-3xl border border-blue-100 bg-blue-50/50 p-8 transition-all hover:bg-white hover:shadow-lg">
                                            <div>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 overflow-hidden rounded-full bg-neutral-200">
                                                            <img
                                                                src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=random`}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="flex gap-0.5 text-yellow-400">
                                                                {[...Array(item.rating || 5)].map(
                                                                    (_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className="size-3 fill-current"
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                            <div className="mt-1 font-semibold text-blue-700">
                                                                {item.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Instagram className="size-5 text-rose-500" />
                                                </div>
                                                <blockquote className="mt-6 text-sm leading-relaxed text-neutral-600">
                                                    "{item.content}"
                                                </blockquote>
                                            </div>
                                            <div className="mt-4 text-xs font-medium text-neutral-400">
                                                {item.role}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={prevTestimonial}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-blue-50 lg:-left-12"
                        >
                            <ChevronLeft className="size-6 text-blue-700" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-blue-50 lg:-right-12"
                        >
                            <ChevronRight className="size-6 text-blue-700" />
                        </button>
                    </div>
                </div>
            </section>

            <section id="mentor" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12">
                    {dbMentors && dbMentors.length > 0 ? (
                        <>
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-200 via-cyan-100 to-teal-100 p-6 sm:p-10">
                                <div className="grid items-center gap-6 lg:grid-cols-12">
                                    <div className="lg:col-span-7">
                                        <div className="text-2xl font-bold text-blue-800 sm:text-3xl">
                                            {dbMentors[currentMentor].name}
                                        </div>
                                        <div className="mt-1 text-sm font-medium text-blue-700 sm:text-base">
                                            {dbMentors[currentMentor].title}
                                        </div>
                                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-700 sm:text-base">
                                            {dbMentors[currentMentor].quote}
                                        </p>
                                    </div>
                                    <div className="relative lg:col-span-5">
                                        <div className="relative mx-auto size-52 overflow-hidden rounded-full bg-white/70 ring-1 ring-white/50 sm:size-64 lg:size-72">
                                            <img
                                                src={dbMentors[currentMentor].img || '/images/PRESTAS.png'}
                                                alt={dbMentors[currentMentor].name}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="absolute -right-2 -top-2 rounded-2xl bg-lime-400/90 p-2 shadow-sm">
                                            <ShieldCheck className="size-5 text-white" />
                                        </div>
                                        <div className="absolute -left-2 bottom-4 rounded-2xl bg-amber-400/90 p-2 shadow-sm">
                                            <Laptop className="size-5 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {dbMentors.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevMentor}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md ring-1 ring-white hover:bg-blue-50"
                                            aria-label="Prev mentor"
                                        >
                                            <ChevronLeft className="size-5 text-blue-700" />
                                        </button>
                                        <button
                                            onClick={nextMentor}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md ring-1 ring-white hover:bg-blue-50"
                                            aria-label="Next mentor"
                                        >
                                            <ChevronRight className="size-5 text-blue-700" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {dbMentors.length > 1 && (
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    {dbMentors.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentMentor(i)}
                                            className={`size-2 rounded-full ${i === currentMentor ? 'bg-blue-700' : 'bg-blue-200'}`}
                                            aria-label={`Slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-neutral-500 py-12">
                            <p>Data mentor belum tersedia</p>
                        </div>
                    )}
                </div>
            </section>

            <section id="kegiatan" className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                            Daily Activities
                        </div>
                        <h2 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
                            SMP  IMAM HAFSHIslamic Boarding School
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-start">
                        <div className="lg:col-span-6">
                            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
                                <img
                                    src="/images/PRESTAS.png"
                                    alt="Profil kegiatan BQ"
                                    className="h-auto w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-neutral-500">
                                    Galeri Harian
                                </div>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                                >
                                    See More <ArrowRight className="size-4" />
                                </a>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                {(dbActivities && dbActivities.length > 0 ? dbActivities.slice(0, 9) : []).map((item) => (
                                    <div
                                        key={item.id}
                                        className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                                    >
                                        <img
                                            src={item.src ? `/${item.src}` : '/images/PRESTAS.png'}
                                            alt={item.title || `Aktivitas ${item.id}`}
                                            className="aspect-[4/3] h-auto w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
