import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { projectPageContent } from '@/data/projectContent';
import { contentUtils } from '@/utils/contentUtils';

interface Project {
    id: number;
    title: string;
    subtitle: string | null;
    image: string;
    category: string;
    badge: string;
    order: number;
    is_active: boolean;
}

interface Props {
    projects: Project[];
    categories: string[];
}

export default function Project({ projects = [], categories = [] }: Props) {
    const [activeTab, setActiveTab] = useState<'latest' | 'all'>('all');
    
    // Use fallback data when props are empty
    const displayProjects = contentUtils.getFallbackData(projects, projectPageContent.fallbacks.projects);
    const displayCategories = contentUtils.getFallbackData(categories, projectPageContent.fallbacks.categories);
    
    // Filter projects based on active tab
    const filteredProjects = useMemo(() => {
        const activeProjects = contentUtils.filterByStatus(displayProjects);
        const sortedProjects = contentUtils.sortByOrder(activeProjects);
        
        if (activeTab === 'latest') {
            return contentUtils.getLatestItems(sortedProjects, 6);
        }
        return sortedProjects;
    }, [displayProjects, activeTab]);
    
    // Get icon for category
    const getCategoryIcon = (category: string) => {
        return contentUtils.getIcon(
            category, 
            projectPageContent.categoryIcons, 
            projectPageContent.sections.categories.defaultIcon
        );
    };

    // Check if icon is an image path
    const isImageIcon = (icon: string) => {
        return icon.startsWith('/') || icon.startsWith('http');
    };

    return (
        <PublicLayout>
            <Head title={projectPageContent.hero.title} />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src={projectPageContent.hero.bannerImage}
                    alt={projectPageContent.hero.bannerAlt}
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                {/* Section 1: Categories */}
                <div className="mb-20 text-center">
                    <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
                        {projectPageContent.sections.categories.badge}
                    </div>
                    <h1 className="mb-12 text-3xl font-bold text-slate-800 md:text-4xl">
                        {projectPageContent.sections.categories.title}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-8">
                        {displayCategories.map((cat, index) => {
                            const icon = getCategoryIcon(cat);
                            return (
                            <div key={index} className="flex w-40 flex-col items-center">
                                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl p-4 shadow-sm bg-blue-100">
                                    {isImageIcon(icon) ? (
                                        <img
                                            src={icon}
                                            alt={cat}
                                            className="h-12 w-12 object-contain"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="text-3xl">{icon}</span>
                                    )}
                                </div>
                                <h3 className="mb-1 text-sm font-bold text-blue-600">{cat}</h3>
                            </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Description */}
                <div className="mb-20 text-center">
                    <h2 className="mb-6 text-2xl font-bold text-blue-600">{projectPageContent.sections.description.title}</h2>
                    <div className="mx-auto max-w-4xl space-y-4 text-slate-600">
                        {projectPageContent.sections.description.content.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                {/* Section 3: Project Gallery */}
                <div>
                    <div className="mb-10 flex items-center justify-between">
                        <button
                            onClick={() => setActiveTab('latest')}
                            className={`rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
                                activeTab === 'latest'
                                    ? 'border-2 border-orange-400 text-orange-400'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {projectPageContent.sections.gallery.tabs.latest}
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700`}
                        >
                            {projectPageContent.sections.gallery.tabs.all}
                        </button>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project, index) => (
                            <div key={project.id || index} className="group overflow-hidden rounded-xl bg-white shadow-lg transition-transform hover:-translate-y-1">
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src={`/${project.image}`}
                                        alt={project.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute left-4 top-4 rounded bg-yellow-400 px-2 py-1 text-xs font-bold text-slate-900">
                                        {project.badge}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                         <h3 className="mb-1 text-lg font-bold leading-tight">{project.title}</h3>
                                         <p className="text-sm opacity-90">{project.subtitle}</p>
                                    </div>
                                </div>
                                <div className="p-4">
                                   <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-blue-600">{project.category}</span>
                                        <button className="text-xs text-slate-400 hover:text-blue-600">
                                            {projectPageContent.sections.gallery.readMore}
                                        </button>
                                   </div>
                                </div>
                            </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-slate-500">
                                <p>Belum ada project yang tersedia</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
