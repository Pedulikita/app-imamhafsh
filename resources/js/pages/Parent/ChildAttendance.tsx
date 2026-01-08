import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, Percent } from 'lucide-react';

interface Attendance {
    id: number;
    date: string;
    status: string;
    time_in: string | null;
    time_out: string | null;
    notes: string | null;
}

interface Props {
    child: {
        id: number;
        name: string;
        class: string;
    };
    attendances: Attendance[];
    statistics: {
        total: number;
        present: number;
        absent: number;
        late: number;
        percentage: number;
    };
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export default function ChildAttendance({ child, attendances, statistics, pagination }: Props) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'absent':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'late':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            default:
                return <Calendar className="w-5 h-5 text-slate-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present':
                return 'bg-green-100 text-green-800';
            case 'absent':
                return 'bg-red-100 text-red-800';
            case 'late':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'present':
                return 'Hadir';
            case 'absent':
                return 'Absen';
            case 'late':
                return 'Terlambat';
            default:
                return status;
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <Link href={route('parent.child.show', child.id)}>
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Kehadiran {child.name}
                        </h1>
                        <p className="text-slate-600">
                            Kelas {child.class}
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Total Hari
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {statistics.total}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-green-200 bg-green-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Hadir
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {statistics.present}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-red-200 bg-red-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Absen
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {statistics.absent}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-yellow-200 bg-yellow-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Terlambat
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {statistics.late}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    <Percent className="w-4 h-4" />
                                    Persentase
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${statistics.percentage >= 80 ? 'text-green-600' : statistics.percentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {statistics.percentage}%
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Daftar Kehadiran
                            </CardTitle>
                            <CardDescription>
                                Riwayat kehadiran {pagination.total} hari
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {attendances.length === 0 ? (
                                <p className="text-sm text-slate-600 text-center py-8">
                                    Tidak ada data kehadiran
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {attendances.map((attendance) => (
                                        <div 
                                            key={attendance.id}
                                            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                {getStatusIcon(attendance.status)}
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {new Date(attendance.date).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                    {(attendance.time_in || attendance.time_out) && (
                                                        <p className="text-sm text-slate-600">
                                                            {attendance.time_in && `Masuk: ${attendance.time_in}`}
                                                            {attendance.time_in && attendance.time_out && ' | '}
                                                            {attendance.time_out && `Pulang: ${attendance.time_out}`}
                                                        </p>
                                                    )}
                                                    {attendance.notes && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Catatan: {attendance.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(attendance.status)}`}>
                                                {getStatusLabel(attendance.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {pagination.current_page > 1 && (
                                <Link href={route('parent.child.attendance', {student: child.id, page: pagination.current_page - 1})}>
                                    <Button variant="outline">
                                        Sebelumnya
                                    </Button>
                                </Link>
                            )}
                            
                            <span className="px-4 py-2">
                                Halaman {pagination.current_page} dari {pagination.last_page}
                            </span>

                            {pagination.current_page < pagination.last_page && (
                                <Link href={route('parent.child.attendance', {student: child.id, page: pagination.current_page + 1})}>
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
