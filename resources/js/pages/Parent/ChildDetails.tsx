import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, BookOpen, Calendar, Percent } from 'lucide-react';

interface Grade {
    id: number;
    subject: string;
    score: number;
    grade: string;
    date: string;
    assessment_type: string;
}

interface Attendance {
    id: number;
    date: string;
    status: string;
    time_in: string | null;
    time_out: string | null;
}

interface Props {
    child: {
        id: number;
        name: string;
        email: string;
        gender: string;
        class: string;
        photo: string | null;
        birth_date: string;
        status: string;
        enrollment_date: string;
        address: string;
        phone: string;
    };
    relation: string;
    grades: Grade[];
    attendances: Attendance[];
    attendance_percentage: number;
    average_grade: number;
}

export default function ChildDetails({ child, relation, grades, attendances, attendance_percentage, average_grade }: Props) {
    const getAttendanceColor = (status: string) => {
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

    const getGradeColor = (score: number) => {
        if (score >= 85) return 'bg-green-100 text-green-800';
        if (score >= 75) return 'bg-blue-100 text-blue-800';
        if (score >= 65) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Back Button */}
                    <Link href={route('parent.dashboard')}>
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Dashboard
                        </Button>
                    </Link>

                    {/* Child Header */}
                    <div className="mb-8">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-6">
                                    {child.photo ? (
                                        <img 
                                            src={child.photo} 
                                            alt={child.name}
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-12 h-12 text-primary" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                            {child.name}
                                        </h1>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-slate-600">Kelas</p>
                                                <p className="font-semibold text-slate-900">{child.class}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600">Jenis Kelamin</p>
                                                <p className="font-semibold text-slate-900">
                                                    {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600">Hubungan</p>
                                                <p className="font-semibold text-slate-900">{relation}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-600">Status</p>
                                                <p className="font-semibold text-slate-900">
                                                    <span className={`px-2 py-1 rounded text-sm ${child.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {child.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Rata-rata Nilai
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {average_grade.toFixed(2)}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Dari {grades.length} penilaian
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                    <Percent className="w-4 h-4" />
                                    Kehadiran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {attendance_percentage}%
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Dari {attendances.length} hari
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Informasi Kontak
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-900">
                                    <span className="font-medium">Email:</span> {child.email}
                                </p>
                                <p className="text-sm text-slate-900 mt-2">
                                    <span className="font-medium">Telepon:</span> {child.phone || '-'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Grades Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen className="w-5 h-5" />
                                            Nilai Terbaru
                                        </CardTitle>
                                        <CardDescription>
                                            5 nilai terakhir
                                        </CardDescription>
                                    </div>
                                    <Link href={route('parent.child.grades', child.id)}>
                                        <Button variant="ghost" size="sm">
                                            Lihat Semua
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {grades.length === 0 ? (
                                    <p className="text-sm text-slate-600 text-center py-4">
                                        Belum ada nilai
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {grades.map((grade) => (
                                            <div key={grade.id} className="p-3 border border-slate-200 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-slate-900">
                                                        {grade.subject}
                                                    </h4>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getGradeColor(grade.score)}`}>
                                                        {grade.score}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-600">
                                                    <span>{grade.assessment_type}</span>
                                                    <span>{grade.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Attendance Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            Kehadiran Terbaru
                                        </CardTitle>
                                        <CardDescription>
                                            30 hari terakhir
                                        </CardDescription>
                                    </div>
                                    <Link href={route('parent.child.attendance', child.id)}>
                                        <Button variant="ghost" size="sm">
                                            Lihat Semua
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {attendances.length === 0 ? (
                                    <p className="text-sm text-slate-600 text-center py-4">
                                        Belum ada data kehadiran
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {attendances.slice(0, 5).map((attendance) => (
                                            <div key={attendance.id} className="p-3 border border-slate-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {attendance.date}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getAttendanceColor(attendance.status)}`}>
                                                        {attendance.status === 'present' ? 'Hadir' : 
                                                         attendance.status === 'absent' ? 'Absen' : 
                                                         attendance.status === 'late' ? 'Terlambat' : attendance.status}
                                                    </span>
                                                </div>
                                                {attendance.time_in && (
                                                    <p className="text-xs text-slate-600 mt-1">
                                                        Masuk: {attendance.time_in} 
                                                        {attendance.time_out && ` | Pulang: ${attendance.time_out}`}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Full Contact Information */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Informasi Lengkap</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-slate-600">Tanggal Lahir</p>
                                    <p className="font-semibold text-slate-900">
                                        {new Date(child.birth_date).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Tanggal Pendaftaran</p>
                                    <p className="font-semibold text-slate-900">
                                        {new Date(child.enrollment_date).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-slate-600">Alamat</p>
                                    <p className="font-semibold text-slate-900">
                                        {child.address || '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
