import PublicLayout from '@/layouts/public-layout';
import OptimizedImage from '@/components/OptimizedImage';
import { Head } from '@inertiajs/react';
import { Calendar, Eye, User, Share2, Facebook, Twitter, MessageCircle, ArrowLeft, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { formatArticleContent } from '@/utils/formatContent';

type Article = {
    id: number;
    title: string;
    slug?: string;
    content: string;
    featured_image: string;
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
    article: Article;
    popularArticles: Article[];
    trendingArticles: Article[];
    latestArticles: Article[];
    relatedArticles: Article[];
}

export default function ArticleDetail({
    article,
    popularArticles = [],
    trendingArticles = [],
    latestArticles = [],
    relatedArticles = []
}: Props) {
    const [activeTab, setActiveTab] = useState('popular');
    const [copied, setCopied] = useState(false);
    
    // Use proper URL construction for server-side rendering
    const baseUrl = 'https://imamhafsh.com';
    const shareUrl = `${baseUrl}/articles/${article.slug || article.id}`;
    const shareTitle = article.title;
    
    // Construct proper absolute URL for image sharing
    const getShareImageUrl = () => {
        // For social media sharing, we need a direct, accessible image URL
        // Facebook/WhatsApp crawlers need a direct, publicly accessible image URL
        
        const baseUrl = 'https://imamhafsh.com';
        
        if (article.featured_image && article.featured_image.trim()) {
            const image = article.featured_image.trim();
            
            // If already absolute URL, validate it
            if (image.startsWith('http://') || image.startsWith('https://')) {
                return image;
            }
            
            // For relative paths, ensure they start with /
            const imagePath = image.startsWith('/')
                ? image
                : `/${image}`;
            
            // Construct full URL
            const fullUrl = `${baseUrl}${imagePath}`;
            return fullUrl;
        }
        
        // Fallback to logo if no featured image
        return `${baseUrl}/images/logo.png`;
    };
    
    // Get the share image URL
    const shareImageUrl = getShareImageUrl();
    
    // Debug: Log sharing URLs (only in development)
    if (typeof window !== 'undefined') {
        console.log('Article sharing DEBUG:', {
            title: article.title,
            url: shareUrl,
            image: shareImageUrl,
            featured_image_raw: article.featured_image,
            hasFeatureImage: !!article.featured_image,
            env: process.env.NODE_ENV
        });
    }

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const sidebarArticles = {
        popular: popularArticles,
        trending: trendingArticles,
        latest: latestArticles,
    };

    return (
        <PublicLayout>
            <Head title={`${article.title} - Imam Hafsh Islamic Boarding School`}>
                {/* Basic Meta Tags */}
                <meta name="description" content={article.excerpt || article.title} />
                <meta name="keywords" content={article.tags?.join(', ') || article.title} />
                <link rel="canonical" href={shareUrl} />
                
                {/* Open Graph Meta Tags (Facebook, LinkedIn, etc.) */}
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt || article.title} />
                <meta property="og:image" content={shareImageUrl} />
                <meta property="og:image:secure_url" content={shareImageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={article.title} />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Imam Hafsh Islamic Boarding School" />
                <meta property="og:locale" content="id_ID" />
                
                <meta property="article:author" content={article.authorName || 'Imam Hafsh'} />
                <meta property="article:published_time" content={article.date} />
                <meta property="article:section" content={article.category || 'Artikel'} />
                <meta property="article:tag" content={article.tags?.join(', ') || article.title} />
                
                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.title} />
                <meta name="twitter:description" content={article.excerpt || article.title} />
                <meta name="twitter:image" content={shareImageUrl} />
                <meta name="twitter:image:alt" content={article.title} />
                <meta name="twitter:site" content="@imamhafsh" />
                <meta name="twitter:creator" content="@imamhafsh" />
                
                {/* Additional Meta Tags */}
                <meta name="author" content={article.authorName} />
                <meta name="robots" content="index, follow" />
                <meta name="article:modified_time" content={article.date} />
                
                {/* WhatsApp and other social platforms */}
                <meta property="og:image:url" content={shareImageUrl} />
                <meta name="image" content={shareImageUrl} />
                <meta name="thumbnail" content={shareImageUrl} />
                
                {/* Schema.org structured data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": article.title,
                        "image": [shareImageUrl],
                        "author": {
                            "@type": "Person",
                            "name": article.authorName,
                            "url": `${baseUrl}/team`
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Imam Hafsh Islamic Boarding School",
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${baseUrl}/images/logo.png`
                            }
                        },
                        "datePublished": article.date,
                        "dateModified": article.date,
                        "description": article.excerpt,
                        "articleSection": article.category,
                        "keywords": article.tags.join(', '),
                        "url": shareUrl,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": shareUrl
                        }
                    })}
                </script>
            </Head>

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-8">
                    <button 
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Artikel</span>
                    </button>
                </div>

                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <article className="prose prose-lg max-w-none">
                            {/* Article Header */}
                            <div className="mb-8">
                                <div className="mb-4">
                                    <span className="inline-block rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                        {article.category}
                                    </span>
                                </div>
                                
                                <h1 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl">
                                    {article.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{article.authorName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{article.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span>{article.views} views</span>
                                    </div>
                                    <div className="text-slate-500">
                                        {article.readTime}
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="mb-8">
                                <OptimizedImage
                                    src={article.featured_image}
                                    alt={article.title}
                                    metadata={article.image_metadata}
                                    className="w-full rounded-xl h-64 md:h-80 lg:h-96 object-cover"
                                    size="medium"
                                    lazy={false}
                                />
                            </div>

                            {/* Article Content */}
                            <div className="prose prose-lg max-w-none text-slate-700 space-y-4">
                                <div 
                                    className="content-wrapper"
                                    dangerouslySetInnerHTML={{ __html: formatArticleContent(article.content) }} 
                                />
                            </div>

                            {/* Tags */}
                            <div className="mt-8 flex flex-wrap gap-2">
                                {article.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Share Section */}
                            <div className="mt-8 border-t border-slate-200 pt-8">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                                    <Share2 className="h-5 w-5" />
                                    Bagikan Artikel
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href={shareLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        <Facebook className="h-4 w-4" />
                                        Facebook
                                    </a>
                                    <a
                                        href={shareLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 transition-colors"
                                    >
                                        <Twitter className="h-4 w-4" />
                                        Twitter
                                    </a>
                                    <a
                                        href={shareLinks.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </a>
                                    <a
                                        href={shareLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                        LinkedIn
                                    </a>
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                                        {copied ? 'Tersalin!' : 'Salin Link'}
                                    </button>
                                </div>
                            </div>
                        </article>

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <div className="mt-12">
                                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                                    Artikel Terkait
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {relatedArticles.slice(0, 4).map((relatedArticle) => (
                                        <a
                                            key={relatedArticle.id}
                                            href={`/articles/${relatedArticle.slug || relatedArticle.id}`}
                                            className="block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg hover:no-underline"
                                        >
                                            <article className="h-full">
                                                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                                                    <OptimizedImage
                                                        src={relatedArticle.featured_image || '/images/logo.png'}
                                                        alt={relatedArticle.title}
                                                        metadata={relatedArticle.image_metadata}
                                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                        size="small"
                                                        lazy={false}
                                                        placeholder={true}
                                                    />
                                                    <div className="absolute left-3 top-3 rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                                                        {relatedArticle.category || 'Umum'}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="mb-2 line-clamp-2 text-sm font-bold text-slate-900">
                                                        {relatedArticle.title}
                                                    </h3>
                                                    <p className="mb-2 line-clamp-2 text-xs text-slate-600">
                                                        {relatedArticle.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-500">
                                                            {relatedArticle.date}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            👁 {relatedArticle.views}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* Sidebar Navigation */}
                            <div className="mb-6">
                                <div className="flex rounded-lg bg-slate-100 p-1">
                                    {[
                                        { id: 'popular', label: 'Populer' },
                                        { id: 'trending', label: 'Trending' },
                                        { id: 'latest', label: 'Terbaru' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Articles */}
                            <div className="space-y-4">
                                {sidebarArticles[activeTab as keyof typeof sidebarArticles]?.slice(0, 5).map((sidebarArticle, index) => (
                                    <article
                                        key={sidebarArticle.id}
                                        className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:shadow-md"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-slate-900">
                                                {sidebarArticle.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{sidebarArticle.date}</span>
                                                <span>•</span>
                                                <span>👁 {sidebarArticle.views}</span>
                                            </div>
                                        </div>
                                    </article>
                                )) || (
                                    <div className="text-center text-slate-500">
                                        Tidak ada artikel {activeTab}
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