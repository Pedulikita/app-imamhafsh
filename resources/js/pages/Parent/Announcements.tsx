import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, User, Search, Megaphone } from 'lucide-react';

interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string;
    author: string;
    category: string;
}

interface Props {
    announcements: Announcement[];
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export default function Announcements({ announcements, pagination }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setategoryFilter] = useState('');

    const categories = [...new Set(announcements.map(a => a.category))].filter(Boolean);

    const filteredAnnouncements = announcements.filter(ann => {
        const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ann.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ann.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || ann.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'akademik': 'bg-blue-100 text-blue-800',
            'kegiatan': 'bg-green-100 text-green-800',
            'penting': 'bg-red-100 text-red-800',
            'umum': 'bg-slate-100 text-slate-800',
        };
        return colors[category.toLowerCase()] || 'bg-slate-100 text-slate-800';
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Megaphone className="w-8 h-8" />
                            Pengumuman Sekolah
                        </h1>
                        <p className="text-slate-600">
                            Total {pagination.total} pengumuman
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex gap-3 flex-col md:flex-row">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari pengumuman..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                {categories.length > 0 && (
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setategoryFilter(e.target.value)}
                                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Semua Kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Announcements List */}
                    {filteredAnnouncements.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-600">
                                        {searchTerm || categoryFilter ? 'Tidak ada pengumuman yang cocok' : 'Belum ada pengumuman'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredAnnouncements.map((announcement) => (
                                <Card 
                                    key={announcement.id}
                                    className="hover:shadow-md transition-shadow border-l-4 border-l-primary"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-bold text-lg text-slate-900 flex-1 pr-4">
                                                {announcement.title}
                                            </h3>
                                            {announcement.category && (
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getCategoryColor(announcement.category)}`}>
                                                    {announcement.category}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-slate-700 mb-4 line-clamp-3">
                                            {announcement.content}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(announcement.date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                {announcement.author && (
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        {announcement.author}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {pagination.current_page > 1 && (
                                <Link href={route('parent.announcements', {page: pagination.current_page - 1})}>
                                    <Button variant="outline">
                                        Sebelumnya
                                    </Button>
                                </Link>
                            )}
                            
                            <span className="px-4 py-2 text-sm">
                                Halaman {pagination.current_page} dari {pagination.last_page}
                            </span>

                            {pagination.current_page < pagination.last_page && (
                                <Link href={route('parent.announcements', {page: pagination.current_page + 1})}>
                                    <Button variant="outline">
                                        Selanjutnya
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
