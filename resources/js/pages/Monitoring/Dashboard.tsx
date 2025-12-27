import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Calendar, TrendingUp, Award, Clock, Plus, Download, BarChart3 } from 'lucide-react';

interface DashboardStats {
    total_students: number;
    total_subjects: number;
    attendance_today: number;
    grades_this_month: number;
}

interface DashboardProps {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
    const statCards = [
        {
            title: 'Total Siswa',
            value: stats.total_students,
            icon: Users,
            color: 'bg-blue-500',
            href: '/monitoring/students'
        },
        {
            title: 'Mata Pelajaran',
            value: stats.total_subjects,
            icon: BookOpen,
            color: 'bg-green-500',
            href: '/monitoring/subjects'
        },
        {
            title: 'Presensi Hari Ini',
            value: stats.attendance_today,
            icon: Calendar,
            color: 'bg-orange-500',
            href: '/monitoring/attendance'
        },
        {
            title: 'Nilai Bulan Ini',
            value: stats.grades_this_month,
            icon: Award,
            color: 'bg-purple-500',
            href: '/monitoring/grades'
        }
    ];

    return (
        <AppLayout>
            <Head title="Dashboard Monitoring - Imam Hafsh Islamic Boarding School" />
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Modern Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 mb-8 px-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-600/20" />
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="absolute bottom-16 left-8 w-24 h-24 bg-blue-400/10 rounded-full blur-lg" />
                
                <div className="relative z-10 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm border border-white/20 mb-4">
                                Dashboard Monitoring
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                                Sistem Monitoring Akademik
                            </h1>
                            <p className="text-blue-100 text-lg max-w-2xl">
                                Platform terpadu untuk monitoring perkembangan akademik siswa BQ Islamic Boarding School secara real-time
                            </p>
                        </div>
                        <div className="mt-6 lg:mt-0 flex flex-wrap gap-3">
                            <Button variant="secondary" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm text-white" onClick={() => alert('Fitur Laporan Real-time akan segera tersedia!')}>
                                <Clock className="w-4 h-4" />
                                Laporan Real-time
                            </Button>
                            <Button className="flex items-center gap-2 bg-white text-blue-600 hover:bg-white/90" asChild>
                                <Link href="/monitoring/progress">
                                    <TrendingUp className="w-4 h-4" />
                                    Analisis Perkembangan
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={index} className="relative p-6 overflow-hidden bg-muted/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-200/50">
                                <a href={stat.href} className="block">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-2xl" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-xl ${stat.color} text-white  shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <div className="text-2xl font-bold text-slate-400/50 group-hover:text-blue-400 transition-colors">
                                                #{index + 1}
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-600 mb-2">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-orange-500 group-hover:text-blue-600 transition-colors">
                                            {stat.value.toLocaleString()}
                                        </p>
                                        <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full ${stat.color} group-hover:w-full transition-all duration-1000`} style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </a>
                            </Card>
                        );
                    })}
                </div>

                {/* Enhanced Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Student Management Card */}
                    <Card className="relative p-8 overflow-hidden bg-gradient-to-br from-blue-100 via-white to-indigo-50 border border-blue-100 hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Manajemen Siswa
                                    </h3>
                                    <p className="text-sm text-blue-600 font-medium">
                                        Data & Profil Siswa
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-600 mb-6">
                                Kelola data siswa, lihat profil lengkap, dan monitor perkembangan akademik individual dengan sistem terintegrasi.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" asChild>
                                    <Link href="/monitoring/students">
                                        <Users className="w-4 h-4" />
                                        Daftar Siswa
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" asChild>
                                    <Link href="/monitoring/students/create">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Siswa
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => alert('Fitur Import Data akan segera tersedia!')}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Import Data
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Academic Performance Card */}
                    <Card className="relative p-8 overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 border border-green-100 hover:shadow-xl transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-green-600 rounded-xl shadow-lg">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Performa Akademik
                                    </h3>
                                    <p className="text-sm text-green-600 font-medium">
                                        Monitoring & Analisis
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-600 mb-6">
                                Monitor nilai, kehadiran, dan progress belajar siswa secara real-time dengan dashboard analitik yang komprehensif.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button size="sm" className="flex items-center gap-2 bg-green-600 hover:bg-green-700" asChild>
                                    <Link href="/monitoring/progress">
                                        <BarChart3 className="w-4 h-4" />
                                        Analisis Nilai
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50" asChild>
                                    <Link href="/monitoring/progress">
                                        <TrendingUp className="w-4 h-4 mr-2" />
                                        Laporan Bulanan
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50" onClick={() => alert('Fitur Export Data akan segera tersedia!')}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Data
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Enhanced Recent Activity */}
                <Card className="relative p-8 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-100/30 to-blue-100/30 rounded-full blur-3xl" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-900 rounded-xl shadow-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Aktivitas Terbaru
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Update sistem dalam 24 jam terakhir
                                    </p>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="hover:bg-slate-50" asChild>
                                <Link href="/monitoring">
                                    Lihat Semua
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-50/30 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300">
                                <div className="p-3 bg-blue-600 rounded-xl shadow-md">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900 mb-1">
                                        Data siswa baru berhasil ditambahkan
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Ahmad Fauzan - Kelas VIII A • Student ID: BQ2025001
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                        Baru
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        2 jam lalu
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-green-50/30 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300">
                                <div className="p-3 bg-green-600 rounded-xl shadow-md">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900 mb-1">
                                        Nilai ujian tengah semester telah diinput
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Matematika - Kelas IX B • 25 siswa
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        Selesai
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        5 jam lalu
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-orange-50/30 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-300">
                                <div className="p-3 bg-orange-600 rounded-xl shadow-md">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900 mb-1">
                                        Laporan kehadiran harian telah diperbarui
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Presensi 24 Desember 2025 • 98% kehadiran
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                        Update
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        1 hari lalu
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            </div>
        </AppLayout>
    );
}