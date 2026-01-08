import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { about, achievements, activities, articles, events, ekstrakurikuler, fasilitas, home, kurikulum, literasi, login, mutu, nilai, project, register, team, testimoni } from '@/routes';
import { type InertiaLinkProps, Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, ExternalLink } from 'lucide-react';
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
    { label: 'Donasi', href: 'https://temenbail.com', type: 'external' },
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
    } | null;

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

            <footer id="kontak" className=" text-white border-t bg-gradient-to-r from-blue-900 via-blue-700 to-sky-500">
                <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:20px_20px]" />
                <div className="mx-auto max-w-7xl px-4 py-12">
                    <div className="grid gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <div className="flex items-center gap-3">
                                <img src="/images/logo.png" alt="Logo" className="size-10 rounded-xl" />
                                <div>
                                    <div className="text-base font-semibold">
                                        SMP Imam Hafsh Islamic Boarding School
                                    </div>
                                    <div className="text-sm text-white/70">
                                        Pendidikan, adab, dan prestasi.
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
                               Imam Hafsh Islamic Boarding School adalah pondok pesantren dengan Aqidah Ahlussunnah wal Jama'ah. Pembelajaran dan pengasuhan terarah untuk memahami Alquran dan As-Sunnah secara mendalam
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
                            <div>
                                <div className="text-sm font-semibold">Menu</div>
                                <div className="mt-3 grid gap-2 text-sm text-white/75">
                                    <a href="#program" className="hover:text-white">
                                        Program
                                    </a>
                                    <a href="#profil" className="hover:text-white">
                                        Profil
                                    </a>
                                    <a href="#berita" className="hover:text-white">
                                        Berita
                                    </a>
                                    <a href="#galeri" className="hover:text-white">
                                        Galeri
                                    </a>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-semibold">Kontak</div>
                                <div className="mt-3 grid gap-2 text-sm text-white/75">
                                    {getSetting('contact', 'contact_address') && (
                                        <div>Alamat: {getSetting('contact', 'contact_address', 'Bandung, Jawa Barat')}</div>
                                    )}
                                    {getSetting('contact', 'contact_phone') && (
                                        <div>Telepon: {getSetting('contact', 'contact_phone', '+62 8xx-xxxx-xxxx')}</div>
                                    )}
                                    {getSetting('contact', 'contact_whatsapp') && (
                                        <div>WhatsApp: {getSetting('contact', 'contact_whatsapp', '+62 8xx-xxxx-xxxx')}</div>
                                    )}
                                    {getSetting('contact', 'contact_email') && (
                                        <div>Email: {getSetting('contact', 'contact_email', 'info@imamhafsh.com')}</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-semibold">Sosial</div>
                                <div className="mt-3 grid gap-2 text-sm text-white/75">
                                    {hasSocialLink('social_instagram') && (
                                        <a 
                                            href={getSetting('social', 'social_instagram')} 
                                            className="hover:text-white flex items-center gap-1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Instagram
                                            <ExternalLink className="size-3" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_youtube') && (
                                        <a 
                                            href={getSetting('social', 'social_youtube')} 
                                            className="hover:text-white flex items-center gap-1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            YouTube
                                            <ExternalLink className="size-3" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_facebook') && (
                                        <a 
                                            href={getSetting('social', 'social_facebook')} 
                                            className="hover:text-white flex items-center gap-1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Facebook
                                            <ExternalLink className="size-3" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_twitter') && (
                                        <a 
                                            href={getSetting('social', 'social_twitter')} 
                                            className="hover:text-white flex items-center gap-1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Twitter
                                            <ExternalLink className="size-3" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_linkedin') && (
                                        <a 
                                            href={getSetting('social', 'social_linkedin')} 
                                            className="hover:text-white flex items-center gap-1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            LinkedIn
                                            <ExternalLink className="size-3" />
                                        </a>
                                    )}
                                    {hasSocialLink('social_tiktok') && (
                                        <a 
                                            href={getSetting('social', 'social_tiktok')} 
                                            className="hover:text-white flex items-center gap-1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            TikTok
                                            <ExternalLink className="size-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            © {new Date().getFullYear()} IMAM HAFSH ISLAMIC BOARDING SCHOOL. All rights
                            reserved.
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="#" className="hover:text-white">
                                Kebijakan Privasi
                            </a>
                            <span className="text-white/20">•</span>
                            <a href="#" className="hover:text-white">
                                Syarat & Ketentuan
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
