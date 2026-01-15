import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Exam {
    id: number;
    title: string;
    subject: string;
    class: string;
    type: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    total_questions: number;
    total_points: number;
    is_published: boolean;
    status: 'active' | 'upcoming' | 'past';
    attempts_count: number;
    students_completed: number;
}

interface TeacherClass {
    id: number;
    name: string;
    subject: string;
    grade: string;
}

interface Statistics {
    total_exams: number;
    active_exams: number;
    upcoming_exams: number;
    total_attempts: number;
}

interface Props {
    exams: Exam[];
    teacher_classes: TeacherClass[];
    statistics: Statistics;
}

const getStatusBadge = (status: string, isPublished: boolean) => {
    if (!isPublished) {
        return <Badge variant="secondary">Draft</Badge>;
    }
    
    switch (status) {
        case 'active':
            return <Badge variant="default" className="bg-green-500">Active</Badge>;
        case 'upcoming':
            return <Badge variant="outline">Upcoming</Badge>;
        case 'past':
            return <Badge variant="secondary">Completed</Badge>;
        default:
            return <Badge variant="secondary">Unknown</Badge>;
    }
};

const getTypeLabel = (type: string) => {
    const types = {
        quiz: 'Quiz',
        mid_exam: 'Ujian Tengah Semester',
        final_exam: 'Ujian Akhir Semester',
        assignment: 'Tugas'
    };
    return types[type] || type;
};

export default function Index({ exams, teacher_classes, statistics }: Props) {
    const handleDelete = (examId: number) => {
        if (confirm('Are you sure you want to delete this exam?')) {
            router.delete(`/teacher/exams/${examId}`);
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manajemen Ujian
                    </h2>
                    <Link href="/teacher/exams/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Buat Ujian Baru
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Exam Management" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Ujian</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.total_exams}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ujian Aktif</CardTitle>
                                <AlertCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{statistics.active_exams}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Akan Datang</CardTitle>
                                <Clock className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{statistics.upcoming_exams}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Percobaan</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.total_attempts}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Exams List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ujian Anda</CardTitle>
                            <CardDescription>
                                Kelola ujian Anda dan lihat kemajuan siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {exams.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 mb-4">Belum ada ujian yang dibuat</div>
                                    <Link href="/teacher/exams/create">
                                        <Button>Buat Ujian Pertama Anda</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {exams.map((exam) => (
                                        <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg mb-1">
                                                            {exam.title}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {exam.subject} • {exam.class}
                                                        </CardDescription>
                                                    </div>
                                                    {getStatusBadge(exam.status, exam.is_published)}
                                                </div>
                                            </CardHeader>
                                            
                                            <CardContent>
                                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                    <div className="flex justify-between">
                                                        <span>Type:</span>
                                                        <span>{getTypeLabel(exam.type)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Duration:</span>
                                                        <span>{exam.duration_minutes} min</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Questions:</span>
                                                        <span>{exam.total_questions}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Points:</span>
                                                        <span>{exam.total_points}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Attempts:</span>
                                                        <span>{exam.students_completed}/{exam.attempts_count}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Start:</span>
                                                        <span>{format(new Date(exam.start_time), 'MMM dd, HH:mm')}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link href={`/teacher/exams/${exam.id}`}>
                                                        <Button variant="outline" size="sm" className="flex-1">
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                    
                                                    <Link href={`/teacher/exams/${exam.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="flex-1">
                                                            <Edit className="w-3 h-3 mr-1" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(exam.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}