import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { about, achievements, activities, articles, events, ekstrakurikuler, fasilitas, home, kurikulum, literasi, login, mutu, nilai, privacy, project, register, team, terms, testimoni } from '@/routes';
import { type InertiaLinkProps, Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, ExternalLink, Instagram, Youtube, Facebook, Twitter, Linkedin, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { type PropsWithChildren } from 'react';

type NavItem =
    | {
          label: string;
          href: string;
          type: 'anchor';
      }
    | {
          label: string;
          href: NonNullable<InertiaLinkProps['href']>;
          type: 'route';
      }
    | {
          label: string;
          href: string;
          type: 'external';
      }
    | {
          label: string;
          type: 'dropdown';
          children: (
              | {
                    label: string;
                    href: string;
                    type: 'anchor' | 'external';
                }
              | {
                    label: string;
                    href: NonNullable<InertiaLinkProps['href']>;
                    type: 'route';
                }
          )[];
      };

const navItems: NavItem[] = [
    { label: 'Beranda', href: home(), type: 'route' },
    {
        label: 'About Us',
        type: 'dropdown',
        children: [
            { label: 'Profile Imam Hafsh', href: about(), type: 'route' },
            { label: 'Nilai-Nilai Inti Imam Hafsh', href: nilai(), type: 'route' },
            { label: 'Standar Mutu', href: mutu(), type: 'route' },
            { label: 'Curriculum & Programs', href: kurikulum(), type: 'route' },
            { label: 'Our Team', href: team(), type: 'route' },
        ],
    },
    {
        label: 'Daily Activities',
        type: 'dropdown',
        children: [
            { label: 'Project Siswa', href: project(), type: 'route' },
            { label: 'Aktivitas Harian', href: activities(), type: 'route' },
            { label: 'Ekstrakurikuler', href: ekstrakurikuler(), type: 'route' },
            { label: 'Achievements', href: achievements(), type: 'route' },
            { label: 'Literasi Sekolah', href: literasi(), type: 'route' },
        ],
    },
    {
        label: 'Galleries',
        type: 'dropdown',
        children: [
            { label: 'Fasilitas', href: fasilitas(), type: 'route' },
            { label: 'Inspiring Articles', href: articles(), type: 'route' },
            { label: 'Event Galleries', href: events(), type: 'route' },
            { label: 'Testimoni', href: testimoni(), type: 'route' },
        ],
    },
    {
        label: 'PPDB',
        type: 'dropdown',
        children: [
            { label: 'Pendaftaran Siswa Baru', href: '/pendaftaran#pendaftaran', type: 'anchor' },
            { label: 'Informasi Biaya', href: '/pendaftaran#biaya', type: 'anchor' },
            { label: 'FAQ', href: '/pendaftaran#faq', type: 'anchor' },
        ],
    },
    { label: 'Donasi', href: '/alldonasi', type: 'external' },
];

function PublicLogo() {
    return (
        <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Logo" className="size-9 rounded-xl" />
            <div className="leading-tight">
                <div className="text-sm font-semibold text-white">IMAM HAFSH</div>
                <div className="text-[11px] text-white/80">Islamic Boarding School</div>
            </div>
        </div>
    );
}

function NavLink({ item }: { item: NavItem }) {
    const page = usePage();

    const baseClassName =
        'rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white';

    if (item.type === 'dropdown') {
        // Check if any child is active to highlight the parent
        const isActive = item.children.some(
            (child) => child.type === 'route' && isSameUrl(page.url, child.href)
        );

        return (
            <DropdownMenu>
                <DropdownMenuTrigger
                    className={cn(
                        baseClassName,
                        'flex items-center gap-1 outline-none data-[state=open]:bg-white/10 data-[state=open]:text-white',
                        isActive && 'bg-white/15 text-white'
                    )}
                >
                    {item.label}
                    <ChevronDown className="size-4 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2">
                    {item.children.map((child) => {
                         if (child.type === 'route') {
                            return (
                                <DropdownMenuItem key={child.label} asChild>
                                    <Link href={child.href} className="w-full cursor-pointer">
                                        {child.label}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        }
                        return (
                            <DropdownMenuItem key={child.label} asChild>
                                <a href={child.href} className="w-full cursor-pointer">
                                    {child.label}
                                </a>
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    const isActive =
        item.type === 'route' ? isSameUrl(page.url, item.href) : false;

    const className = cn(baseClassName, isActive && 'bg-white/15 text-white');

    if (item.type === 'anchor') {
        return (
            <a href={item.href} className={className}>
                {item.label}
            </a>
        );
    }

    if (item.type === 'external') {
        return (
            <a
                href={item.href}
                className={className}
                target="_blank"
                rel="noreferrer"
            >
                {item.label}
            </a>
        );
    }

    return (
        <Link href={item.href} prefetch className={className}>
            {item.label}
        </Link>
    );
}

export default function PublicLayout({ children }: PropsWithChildren) {
    const { props } = usePage();
    const siteSettings = props.siteSettings as {
        contact: Array<{key: string, value: string, label: string}> | null;
        social: Array<{key: string, value: string, label: string}> | null;
        general: Array<{key: string, value: string, label: string}> | null;
    } | null;

    // Helper function to get setting value by key with proper error handling
    const getSetting = (group: 'contact' | 'social' | 'general', key: string, fallback = '') => {
        try {
            if (!siteSettings || !siteSettings[group] || !Array.isArray(siteSettings[group])) {
                return fallback;
            }
            const setting = siteSettings[group]?.find(item => item && item.key === key);
            const value = setting?.value || fallback;
            return value;
        } catch (error) {
            console.warn(`Error getting setting ${group}.${key}:`, error);
            return fallback;
        }
    };

    // Helper function to check if social link exists and is not empty
    const hasSocialLink = (key: string) => {
        try {
            const value = getSetting('social', key);
            return value && value !== '#' && value.trim() !== '';
        } catch (error) {
            console.warn(`Error checking social link ${key}:`, error);
            return false;
        }
    };

    return (
        <div className="min-h-svh bg-white text-neutral-900">
            <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-500">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
                    <Link href={home()} className="flex items-center gap-2">
                        <PublicLogo />
                    </Link>

                    <nav className="hidden items-center gap-1 lg:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={`${item.type}-${item.label}`}
                                item={item}
                            />
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2 sm:flex">
                            <Button asChild size="sm" variant="secondary" className="rounded-full bg-white/15 text-white hover:bg-white/20">
                                <Link href={login()} prefetch>
                                    Masuk
                                </Link>
                            </Button>
                            <Button asChild size="sm" className="rounded-full bg-amber-400 text-neutral-900 hover:bg-amber-300">
                                <Link href={register()} prefetch>
                                    Daftar
                                </Link>
                            </Button>
                        </div>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="rounded-full text-white hover:bg-white/10 lg:hidden"
                                >
                                    <Menu className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 flex flex-col gap-2">
                                    {navItems.map((item) => {
                                        if (item.type === 'dropdown') {
                                            return (
                                                <div key={item.label} className="space-y-1">
                                                    <div className="px-3 py-2 text-sm font-semibold text-neutral-900">
                                                        {item.label}
                                                    </div>
                                                    <div className="ml-4 flex flex-col gap-1 border-l pl-2">
                                                        {item.children.map((child) => (
                                                            child.type === 'route' ? (
                                                                <Link
                                                                    key={child.label}
                                                                    href={child.href}
                                                                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            ) : (
                                                                <a
                                                                    key={child.label}
                                                                    href={child.href}
                                                                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                                                >
                                                                    {child.label}
                                                                </a>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        if (item.type === 'anchor') {
                                            return (
                                                <a
                                                    key={`${item.type}-${item.href}-${item.label}`}
                                                    href={item.href}
                                                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                                >
                                                    {item.label}
                                                </a>
                                            );
                                        }

                                        if (item.type === 'external') {
                                            return (
                                                <a
                                                    key={`${item.type}-${item.href}-${item.label}`}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                                >
                                                    {item.label}
                                                </a>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={`${item.type}-${resolveUrl(item.href)}-${item.label}`}
                                                href={item.href}
                                                prefetch
                                                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                                            >
                                                {item.label}
                                            </Link>
                                        );
                                    })}

                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <Button asChild variant="secondary" className="w-full">
                                            <Link href={login()} prefetch>
                                                Masuk
                                            </Link>
                                        </Button>
                                        <Button asChild className="w-full">
                                            <Link href={register()} prefetch>
                                                Daftar
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main>{children}</main>

            <footer id="kontak" className="relative bg-slate-900 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                <div className="relative mx-auto max-w-7xl px-4 py-16">
                    {/* Main Footer Content */}
                    <div className="grid gap-12 lg:grid-cols-12">
                        {/* School Info */}
                        <div className="lg:col-span-5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <img 
                                        src={getSetting('general', 'site_logo', '/images/logo.png')} 
                                        alt="Logo" 
                                        className="size-14 rounded-2xl shadow-lg ring-2 ring-white/10" 
                                    />
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl opacity-20 blur"></div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                        {getSetting('general', 'site_name', 'Imam Hafsh Islamic Boarding School')}
                                    </h3>
                                    <p className="text-slate-400 font-medium">
                                        {getSetting('general', 'site_tagline', 'Pendidikan, Adab, dan Prestasi')}
                                    </p>
                                </div>
                            </div>
                            
                            <p className="text-slate-300 leading-relaxed max-w-lg mb-8">
                                {getSetting('general', 'site_description', 'Pondok pesantren dengan Aqidah Ahlussunnah wal Jama\'ah. Pembelajaran dan pengasuhan terarah untuk memahami Alquran dan As-Sunnah secara mendalam.')}
                            </p>

                            {/* Social Media */}
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-white">Ikuti Kami</h4>
                                <div className="flex gap-3">
                                    {hasSocialLink('social_instagram') && (
                                        <a 
                                            href={getSetting('social', 'social_instagram')} 
                                            className="group flex items-center justify-center size-12 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Instagram"
                                        >
                                            <Instagram className="size-5 text-white" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_youtube') && (
                                        <a 
                                            href={getSetting('social', 'social_youtube')} 
                                            className="group flex items-center justify-center size-12 bg-gradient-to-br from-red-600 to-red-500 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="YouTube"
                                        >
                                            <Youtube className="size-5 text-white" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_facebook') && (
                                        <a 
                                            href={getSetting('social', 'social_facebook')} 
                                            className="group flex items-center justify-center size-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Facebook"
                                        >
                                            <Facebook className="size-5 text-white" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_twitter') && (
                                        <a 
                                            href={getSetting('social', 'social_twitter')} 
                                            className="group flex items-center justify-center size-12 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-sky-500/25"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Twitter"
                                        >
                                            <Twitter className="size-5 text-white" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_linkedin') && (
                                        <a 
                                            href={getSetting('social', 'social_linkedin')} 
                                            className="group flex items-center justify-center size-12 bg-gradient-to-br from-blue-700 to-blue-600 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-blue-600/25"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="LinkedIn"
                                        >
                                            <Linkedin className="size-5 text-white" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_tiktok') && (
                                        <a 
                                            href={getSetting('social', 'social_tiktok')} 
                                            className="group flex items-center justify-center size-12 bg-gradient-to-br from-black to-slate-800 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-slate-800/25"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="TikTok"
                                        >
                                            <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.138-.86c-.532-.606-.832-1.347-.832-2.088V2.4h-2.8v8.736c0 .706-.306 1.347-.832 1.728-.526.38-1.2.506-1.832.338-.632-.168-1.138-.632-1.32-1.264a2.4 2.4 0 0 1 .612-2.472c.337-.338.78-.506 1.236-.506v-2.8c-1.074 0-2.115.38-2.904 1.056-.79.675-1.284 1.62-1.356 2.694-.072 1.074.253 2.147.904 2.976.65.829 1.584 1.347 2.592 1.44 1.008.094 2.016-.168 2.8-.728.784-.56 1.284-1.389 1.39-2.304V7.872c.506.38 1.074.632 1.674.758.6.126 1.236.126 1.836 0V6.832c-.506 0-1.012-.126-1.474-.38-.462-.253-.874-.632-1.2-1.074V5.562h.006z"/>
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation and Contact */}
                        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
                            {/* Quick Links */}
                            <div>
                                <h4 className="text-lg font-semibold mb-6 text-white">Menu Utama</h4>
                                <div className="space-y-3">
                                    <Link href={home()} className="block text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform">
                                        Beranda
                                    </Link>
                                    <Link href={about()} className="block text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform">
                                        Tentang Kami
                                    </Link>
                                    <Link href={articles()} className="block text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform">
                                        Artikel
                                    </Link>
                                    <Link href={activities()} className="block text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform">
                                        Aktivitas
                                    </Link>
                                    <Link href={fasilitas()} className="block text-slate-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform">
                                        Fasilitas
                                    </Link>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h4 className="text-lg font-semibold mb-6 text-white">Hubungi Kami</h4>
                                <div className="space-y-4">
                                    {getSetting('contact', 'contact_address') && (
                                        <div className="flex items-start gap-3 group">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <MapPin className="size-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-slate-300 leading-relaxed">
                                                    {getSetting('contact', 'contact_address')}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {getSetting('contact', 'contact_phone') && (
                                        <div className="flex items-center gap-3 group">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Phone className="size-4 text-white" />
                                            </div>
                                            <a 
                                                href={`tel:${getSetting('contact', 'contact_phone')}`}
                                                className="text-slate-300 hover:text-white transition-colors"
                                            >
                                                {getSetting('contact', 'contact_phone')}
                                            </a>
                                        </div>
                                    )}

                                    {getSetting('contact', 'contact_whatsapp') && (
                                        <div className="flex items-center gap-3 group">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <MessageCircle className="size-4 text-white" />
                                            </div>
                                            <a 
                                                href={`https://wa.me/${getSetting('contact', 'contact_whatsapp').replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-300 hover:text-white transition-colors"
                                            >
                                                WhatsApp: {getSetting('contact', 'contact_whatsapp')}
                                            </a>
                                        </div>
                                    )}

                                    {getSetting('contact', 'contact_email') && (
                                        <div className="flex items-center gap-3 group">
                                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Mail className="size-4 text-white" />
                                            </div>
                                            <a 
                                                href={`mailto:${getSetting('contact', 'contact_email')}`}
                                                className="text-slate-300 hover:text-white transition-colors"
                                            >
                                                {getSetting('contact', 'contact_email')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-12 pt-8 border-t border-slate-700">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="text-slate-400">
                                © {new Date().getFullYear()} <span className="font-semibold text-white">{getSetting('general', 'site_name', 'Imam Hafsh Islamic Boarding School')}</span>. 
                                All rights reserved.
                            </div>
                            <div className="flex items-center gap-6">
                                <Link href={privacy()} className="text-slate-400 hover:text-white transition-colors text-sm">
                                    Kebijakan Privasi
                                </Link>
                                <span className="text-slate-600">•</span>
                                <Link href={terms()} className="text-slate-400 hover:text-white transition-colors text-sm">
                                    Syarat & Ketentuan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
