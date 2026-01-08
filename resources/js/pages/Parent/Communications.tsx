import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, Filter, Mail, CheckCheck } from 'lucide-react';

interface Communication {
    id: number;
    teacher_name: string;
    student_name: string;
    subject: string;
    message: string;
    date: string;
    is_read: boolean;
    status: string;
}

interface Props {
    communications: Communication[];
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export default function Communications({ communications, pagination }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredCommunications = communications.filter(comm => {
        const matchesSearch = comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            comm.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            comm.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || 
                             (statusFilter === 'unread' && !comm.is_read) ||
                             (statusFilter === 'read' && comm.is_read);
        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <MessageSquare className="w-8 h-8" />
                            Komunikasi Orang Tua-Guru
                        </h1>
                        <p className="text-slate-600">
                            Total {pagination.total} pesan
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan guru, subjek, atau isi pesan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="unread">Belum Dibaca</option>
                                    <option value="read">Sudah Dibaca</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Communications List */}
                    {filteredCommunications.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-600">
                                        {searchTerm || statusFilter ? 'Tidak ada pesan yang cocok' : 'Belum ada pesan'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredCommunications.map((comm) => (
                                <Card 
                                    key={comm.id}
                                    className={`hover:shadow-md transition-shadow ${!comm.is_read ? 'border-l-4 border-l-primary bg-blue-50' : ''}`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-slate-900 text-lg">
                                                        {comm.subject}
                                                    </h3>
                                                    {!comm.is_read && (
                                                        <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                                                    )}
                                                </div>
                                                
                                                <p className="text-sm text-slate-600 mb-3">
                                                    <span className="font-medium">Dari:</span> {comm.teacher_name}
                                                    {comm.student_name && (
                                                        <> • <span className="font-medium">Tentang:</span> {comm.student_name}</>
                                                    )}
                                                </p>

                                                <p className="text-slate-700 mb-3 line-clamp-2">
                                                    {comm.message}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span>{new Date(comm.date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</span>
                                                    {comm.status && (
                                                        <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs">
                                                            {comm.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="ml-4">
                                                {!comm.is_read && (
                                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                                                        Baru
                                                    </span>
                                                )}
                                                {comm.is_read && (
                                                    <CheckCheck className="w-5 h-5 text-slate-400" />
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
                                <Link href={route('parent.communications', {page: pagination.current_page - 1})}>
                                    <Button variant="outline">
                                        Sebelumnya
                                    </Button>
                                </Link>
                            )}
                            
                            <span className="px-4 py-2 text-sm">
                                Halaman {pagination.current_page} dari {pagination.last_page}
                            </span>

                            {pagination.current_page < pagination.last_page && (
                                <Link href={route('parent.communications', {page: pagination.current_page + 1})}>
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
