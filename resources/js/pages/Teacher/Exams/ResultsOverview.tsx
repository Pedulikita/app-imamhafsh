import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    Filter, 
    BarChart3, 
    TrendingUp, 
    Users,
    FileText,
    Eye,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar
} from 'lucide-react';

interface ExamAttempt {
    id: number;
    exam_id: number;
    student_id: number;
    score: number | null;
    status: string;
    submitted_at: string;
    exam: {
        title: string;
        total_points: number;
        teacher_class: {
            class_name: string;
            subject: {
                name: string;
            };
        };
    };
    student: {
        name: string;
        student_id: string;
    };
}

interface Stats {
    total_attempts: number;
    average_score: number;
    pending_grading: number;
    completion_rate: number;
}

interface Props {
    attempts: {
        data: ExamAttempt[];
        links: any[];
        meta: any;
    };
    stats: Stats;
    teacherClasses: any[];
}

const ResultsOverview: React.FC<Props> = ({ attempts, stats, teacherClasses }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getScoreColor = (score: number | null, totalPoints: number) => {
        if (score === null) return 'text-gray-500';
        const percentage = (score / totalPoints) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScorePercentage = (score: number | null, totalPoints: number) => {
        if (score === null) return 'Pending';
        return `${Math.round((score / totalPoints) * 100)}%`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title="Results & Analytics" />

            <div className="space-y-6 px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Hasil & Analisis</h1>
                        <p className="text-muted-foreground mt-1">
                            Pantau kinerja ujian dan kemajuan siswa
                        </p>
                    </div>
                    <Link href="/teacher/exams">
                        <Button>
                            <Eye className="w-4 h-4 mr-2" />
                            View All Exams
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Pengiriman</p>
                                    <p className="text-2xl font-bold ">{stats.total_attempts}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <BarChart3 className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Skor Rata-rata</p>
                                    <p className="text-2xl font-bold ">
                                        {stats.average_score ? Math.round(stats.average_score) : 0}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-orange-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Penilaian Tertunda</p>
                                    <p className="text-2xl font-bold ">{stats.pending_grading}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Tingkat Penyelesaian</p>
                                    <p className="text-2xl font-bold ">{stats.completion_rate}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Submissions */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Pengiriman Terbaru</CardTitle>
                                <CardDescription>
                                    Pengiriman ujian terbaru dari semua kelas Anda
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search submissions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {attempts.data.map((attempt) => (
                                <div
                                    key={attempt.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium ">
                                                    {attempt.student.name}
                                                </h3>
                                                <Badge variant="outline">
                                                    {attempt.student.student_id}
                                                </Badge>
                                                {attempt.score !== null ? (
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4 text-orange-600" />
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Ujian</p>
                                                    <p className="font-medium">{attempt.exam.title}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Mata Pelajaran & Kelas</p>
                                                    <p className="font-medium">
                                                        {attempt.exam.teacher_class.subject.name} - {attempt.exam.teacher_class.class_name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Dikirim</p>
                                                    <p className="font-medium flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                        {formatDate(attempt.submitted_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 ml-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Skor</p>
                                                <p className={`text-lg font-bold ${getScoreColor(attempt.score, attempt.exam.total_points)}`}>
                                                    {getScorePercentage(attempt.score, attempt.exam.total_points)}
                                                </p>
                                                {attempt.score !== null && (
                                                    <p className="text-xs text-gray-500">
                                                        {attempt.score}/{attempt.exam.total_points} pts
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Link href={`/teacher/exams/${attempt.exam_id}/results`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {attempts.data.length === 0 && (
                                <div className="text-center py-8">
                                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada pengiriman ditemukan</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Pengiriman siswa akan muncul di sini setelah mereka menyelesaikan ujian.
                                    </p>
                                    <div className="mt-6">
                                        <Link href="/teacher/exams">
                                            <Button>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Lihat Semua Ujian
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {attempts.data.length > 0 && attempts.links && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex gap-2">
                                    {attempts.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 text-sm rounded-md border ${
                                                link.active
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default ResultsOverview;