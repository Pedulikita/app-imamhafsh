import PublicLayout from '@/layouts/public-layout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { MessageCircle, Printer, Twitter } from 'lucide-react';

interface ProfilePage {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  hero_image: string | null;
  content_image: string | null;
  content_thumbnail: string | null;
  sidebar_image: string | null;
  sidebar_bg_color: string | null;
  sidebar_header_color: string | null;
  sidebar_title: string | null;
  is_active: boolean;
}

interface PageProps extends InertiaPageProps {
  page?: ProfilePage;
  siteSettings?: {
    contact: Array<{key: string, value: string, label: string}> | null;
    social: Array<{key: string, value: string, label: string}> | null;
  } | null;
}

export default function About() {
    const { page, siteSettings } = usePage<PageProps>().props;
    
    // Helper function to get setting value by key with proper error handling
    const getSetting = (group: 'contact' | 'social', key: string, fallback = '') => {
        try {
            if (!siteSettings || !siteSettings[group] || !Array.isArray(siteSettings[group])) {
                return fallback;
            }
            const setting = siteSettings[group]?.find(item => item && item.key === key);
            return setting?.value || fallback;
        } catch (error) {
            console.warn(`Error getting setting ${group}.${key}:`, error);
            return fallback;
        }
    };
    
    // Dynamic Image Functions with Fallback System
    const getHeroImage = () => {
        return page?.hero_image || page?.image || "/images/Banner-Page.png";
    };
    
    const getContentImage = () => {
        return page?.content_image || page?.image || "/images/default-content.png";
    };
    
    const getContentThumbnail = () => {
        return page?.content_thumbnail || page?.content_image || page?.image || "/images/default-thumb.png";
    };
    
    const getSidebarImage = () => {
        return page?.sidebar_image || page?.image || "/images/PRESTAS.png";
    };
    
    const getSidebarConfig = () => {
        return {
            bgColor: page?.sidebar_bg_color || 'blue-50',
            headerColor: page?.sidebar_header_color || 'blue-600',
            title: page?.sidebar_title || page?.title || 'Profile Sekolah'
        };
    };
    
    return (
        <PublicLayout>
            <Head title={page?.title || "Profile Imam Hafsh Islamic School"} />
            
            {/* Hero Image */}
            <div className="w-full">
                <img 
                    src={getHeroImage()} 
                    alt="Banner" 
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                {/* Title Section */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
                    <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                        {page?.title || "Profile Imam Hafsh Islamic School"}
                    </h1>
                    <div className="flex gap-2">
                        <button className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
                            <Printer className="size-5" />
                        </button>
                        <button className="rounded-full bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200">
                            <Twitter className="size-5" />
                        </button>
                        <button className="rounded-full bg-green-100 p-2 text-green-600 transition hover:bg-green-200">
                            <MessageCircle className="size-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {/* Dynamic Content Section */}
                        <section className="mb-12">
                            {(page?.content_image || page?.image) && (
                                <div className="mb-8 overflow-hidden rounded-xl shadow-lg">
                                    <img 
                                        src={getContentImage()} 
                                        alt={page?.title || 'Content Image'} 
                                        className="h-auto w-full object-cover"
                                    />
                                </div>
                            )}
                            
                            {page?.content ? (
                                <div className="space-y-4 text-slate-600">
                                    <div 
                                        className="prose prose-slate max-w-none leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: page.content }}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4 text-slate-600">
                                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
                                        <p className="text-yellow-800">
                                            Konten belum tersedia. Silakan tambahkan konten melalui admin panel.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8">
                            {/* Dynamic Sidebar Content */}
                            {page ? (
                                <>
                                    {/* Profile Info Card with Dynamic Styling */}
                                    <div className={`overflow-hidden rounded-xl bg-${getSidebarConfig().bgColor} text-center shadow-lg`}>
                                        <div className={`bg-${getSidebarConfig().headerColor} py-3 text-white`}>
                                            <h3 className="font-bold">{getSidebarConfig().title}</h3>
                                        </div>
                                        <div className="p-6">
                                            {(page.sidebar_image || page.image) && (
                                                <img 
                                                    src={getSidebarImage()} 
                                                    alt={page.title} 
                                                    className="mx-auto mb-4 h-full w-full rounded-lg object-cover"
                                                />
                                            )}
                                            <div 
                                                className="text-sm text-slate-600"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: page.content ? page.content.substring(0, 150) + '...' : 'Konten tidak tersedia' 
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Default Content */}
                                    <div className="overflow-hidden rounded-xl bg-blue-50 text-center shadow-lg">
                                        <div className="bg-blue-600 py-2 text-white">
                                            <h3 className="font-bold">Penerimaan Peserta Didik Baru</h3>
                                            <p className="text-sm">2025-2026</p>
                                        </div>
                                        <div className="p-6">
                                            <img 
                                                src="/images/PRESTAS.png" 
                                                alt="PPDB Student" 
                                                className="mx-auto mb-4 h-48 object-contain"
                                            />
                                            <p className="mb-4 text-sm text-slate-600">
                                                Bergabunglah bersama kami di Imam Hafsh Islamic Boarding School.
                                            </p>
                                            <button className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                                                Daftar Sekarang
                                            </button>
                                        </div>
                                    </div>

                                    {/* Achievement Banner */}
                                    <div className="overflow-hidden rounded-xl bg-emerald-50 text-center shadow-lg">
                                        <div className="bg-emerald-600 py-2 text-white">
                                            <h3 className="font-bold">Selamat & Sukses</h3>
                                        </div>
                                        <div className="p-4">
                                            <img 
                                                src="/images/PRESTAS.png" 
                                                alt="Achievement" 
                                                className="mx-auto mb-4 h-64 object-contain"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Section (Map & Contact) */}
                <div className="mt-12 rounded-xl border bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Map Placeholder */}
                        <div className="h-64 overflow-hidden rounded-lg bg-slate-100 md:h-full">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.033486546374!2d106.7766!3d-6.6433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzgnMzUuOSJTIDEwNsKwNDYnMzUuOCJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen 
                                loading="lazy"
                            ></iframe>
                        </div>

                        {/* Contact Details */}
                        <div className="flex flex-col justify-center space-y-6">
                            <h3 className="text-2xl font-bold text-orange-500">Contact Details</h3>
                            <p className="text-slate-600">
                                Lokasi strategis boarding school sangat strategis dan asri, dengan dikelilingi sawah, bukit, dan view gunung Salak Bogor.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="mb-1 font-bold text-blue-600">Find Us</h4>
                                    <p className="text-sm text-slate-600">
                                        {getSetting('contact', 'contact_address', 'Jl. Pinus, RT. 01/RW. 06, Kelurahan Margajaya, Kecamatan Bogor Barat, Kota Bogor, Jawa Barat, 16116.')}
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="mb-1 font-bold text-blue-600">Our Mail</h4>
                                    <p className="text-sm text-slate-600">
                                        {getSetting('contact', 'contact_email', 'imamhafsh.bogor@gmail.com')}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="mb-1 font-bold text-blue-600">Call Center</h4>
                                    <p className="text-sm text-slate-600">
                                        {getSetting('contact', 'contact_phone', '0812-3456-7890')}
                                    </p>
                                </div>

                                {getSetting('contact', 'contact_whatsapp') && (
                                    <div>
                                        <h4 className="mb-1 font-bold text-blue-600">WhatsApp</h4>
                                        <p className="text-sm text-slate-600">
                                            {getSetting('contact', 'contact_whatsapp')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
