import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, MessageSquare, BookOpen, Calendar, User, ChevronRight } from 'lucide-react';

interface Child {
    id: number;
    name: string;
    class: string;
    gender: string;
    photo: string | null;
    relation: string;
    is_primary: boolean;
    status: string;
}

interface Props {
    children: Child[];
    stats: {
        total_children: number;
        active_children: number;
        unread_messages: number;
        recent_announcements: number;
    };
    recent_communications: any[];
    parent_info: {
        father_name: string | null;
        mother_name: string | null;
        father_phone: string | null;
        mother_phone: string | null;
    };
}

export default function Dashboard({ children, stats, recent_communications, parent_info }: Props) {
    const [selectedChild, setSelectedChild] = useState<number | null>(null);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Selamat Datang Orang Tua
                        </h1>
                        <p className="text-slate-600">
                            Pantau perkembangan anak Anda secara real-time
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Total Anak
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {stats.total_children}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {stats.active_children} aktif
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Pesan Baru
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {stats.unread_messages}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Belum dibaca
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Pengumuman Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {stats.recent_announcements}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Informasi terbaru
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Profil
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href={route('parent.profile')}>
                                    <Button variant="ghost" className="text-primary w-full justify-start pl-0">
                                        Edit Profil
                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Children Section */}
                        <div className="lg:col-span-2">
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Anak-Anak
                                    </CardTitle>
                                    <CardDescription>
                                        Pilih anak untuk melihat detail lengkap
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {children.length === 0 ? (
                                        <div className="text-center py-8">
                                            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-600">
                                                Data anak belum terdaftar
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {children.map((child) => (
                                                <Link 
                                                    key={child.id} 
                                                    href={route('parent.child.show', child.id)}
                                                    className="block"
                                                >
                                                    <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start gap-4">
                                                                {child.photo ? (
                                                                    <img 
                                                                        src={child.photo} 
                                                                        alt={child.name}
                                                                        className="w-16 h-16 rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                                        <User className="w-8 h-8 text-primary" />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <h3 className="font-semibold text-slate-900">
                                                                        {child.name}
                                                                    </h3>
                                                                    <p className="text-sm text-slate-600">
                                                                        Kelas: {child.class}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        Hubungan: {child.relation}
                                                                    </p>
                                                                    {child.status !== 'active' && (
                                                                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                                                            {child.status}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Akses Cepat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={route('parent.announcements')}>
                                            <Button variant="outline" className="w-full justify-start">
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                Pengumuman
                                            </Button>
                                        </Link>
                                        <Link href={route('parent.communications')}>
                                            <Button variant="outline" className="w-full justify-start">
                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                Pesan
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            {/* Recent Communications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Pesan Terbaru
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recent_communications.length === 0 ? (
                                        <p className="text-sm text-slate-600">
                                            Belum ada pesan
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {recent_communications.slice(0, 3).map((comm) => (
                                                <div key={comm.id} className="pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                                                    <p className="text-sm font-medium text-slate-900 line-clamp-2">
                                                        {comm.subject}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Dari: {comm.teacher?.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {new Date(comm.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <Link href={route('parent.communications')}>
                                        <Button variant="ghost" className="w-full mt-3 text-primary">
                                            Lihat Semua
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Contact Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Kontak Orang Tua</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {parent_info.father_name && (
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                Ayah
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                {parent_info.father_name}
                                            </p>
                                            {parent_info.father_phone && (
                                                <p className="text-xs text-slate-500">
                                                    {parent_info.father_phone}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {parent_info.mother_name && (
                                        <div className="pt-3 border-t border-slate-200">
                                            <p className="text-sm font-medium text-slate-900">
                                                Ibu
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                {parent_info.mother_name}
                                            </p>
                                            {parent_info.mother_phone && (
                                                <p className="text-xs text-slate-500">
                                                    {parent_info.mother_phone}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <Link href={route('parent.profile')}>
                                        <Button variant="outline" className="w-full mt-3">
                                            Edit Kontak
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
