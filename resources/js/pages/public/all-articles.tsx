import PublicLayout from '@/layouts/public-layout';
import OptimizedImage from '@/components/OptimizedImage';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

type Article = {
    id: number;
    title: string;
    slug: string;
    featured_image: string | null;
    image_metadata?: string;
    category: string;
    date: string;
    excerpt: string;
    authorName: string;
    authorAvatar: string;
    readTime: string;
    tags: string[];
    views: number;
};

interface Props {
    articles: Article[];
}

export default function AllArticles({ articles = [] }: Props) {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 12;

    // Debug: Log articles data
    console.log('Articles data:', articles);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return articles;
        return articles.filter(
            (a) =>
                a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q) ||
                a.tags.some((t) => t.toLowerCase().includes(q)) ||
                a.category.toLowerCase().includes(q)
        );
    }, [query, articles]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const currentItems = filtered.slice((page - 1) * perPage, page * perPage);

    const goTo = (p: number) => {
        const next = Math.min(totalPages, Math.max(1, p));
        setPage(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <PublicLayout>
            <Head title="Inspiring Articles - BQ Islamic Boarding School" />

            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <div className="mb-4 inline-block rounded-full bg-blue-100 px-6 py-2 text-sm font-bold text-blue-600">
                        Latest News
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Inspiring Articles
                    </h1>
                </div>

                <div className="mx-auto mb-8 max-w-2xl">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Search Inspiring Articles
                    </label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Cari artikel..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-3 text-sm outline-none ring-blue-200 focus:ring-4"
                        />
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {currentItems.map((a) => (
                        <article
                            key={a.id}
                            className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg"
                        >
                            <div className="relative h-40 w-full overflow-hidden bg-slate-100 sm:h-48">
                                <OptimizedImage
                                    src={a.featured_image || "/images/logo.png"}
                                    alt={a.title}
                                    metadata={a.image_metadata}
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    size="medium"
                                    lazy={false}
                                />
                                <div className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                    {a.category}
                                </div>
                            </div>
                            <div className="space-y-3 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-slate-600">
                                        {a.date}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <span>👁</span>
                                        <span>{a.views || 0}</span>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                                        {a.category}
                                    </span>
                                </div>
                                <h3 className="line-clamp-2 text-base font-bold text-slate-900">
                                    {a.title}
                                </h3>
                                <p className="line-clamp-3 text-sm text-slate-700">
                                    {a.excerpt}
                                </p>
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={a.authorAvatar}
                                            alt={a.authorName}
                                            className="size-6 rounded-full"
                                        />
                                        <div className="text-xs text-slate-700">
                                            {a.authorName}
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        {a.readTime}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {a.tags.slice(0, 3).map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-2">
                                    <a
                                        href={`/articles/${a.slug || a.id}`}
                                        className="text-sm font-semibold text-blue-700 hover:underline"
                                    >
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {currentItems.length === 0 && (
                    <div className="py-20 text-center text-slate-500">
                        Tidak ada artikel yang cocok dengan pencarian.
                    </div>
                )}

                <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() => goTo(page - 1)}
                        disabled={page === 1}
                        className="rounded-md px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const p = i + 1;
                        const active = p === page;
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => goTo(p)}
                                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                    active
                                        ? 'bg-blue-600 text-white'
                                        : 'text-blue-700 hover:bg-blue-50'
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => goTo(page + 1)}
                        disabled={page === totalPages}
                        className="rounded-md px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ›
                    </button>
                </div>
            </div>
        </PublicLayout>
    );
}
