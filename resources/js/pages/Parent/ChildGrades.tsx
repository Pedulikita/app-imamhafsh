import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Filter } from 'lucide-react';

interface Grade {
    id: number;
    subject: string;
    score: number;
    grade: string;
    assessment_type: string;
    date: string;
    teacher: string;
}

interface Props {
    child: {
        id: number;
        name: string;
        class: string;
    };
    grades: Grade[];
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export default function ChildGrades({ child, grades, pagination }: Props) {
    const [selectedAssessment, setSelectedAssessment] = useState('');

    const getGradeColor = (score: number) => {
        if (score >= 85) return 'bg-green-100 text-green-800';
        if (score >= 75) return 'bg-blue-100 text-blue-800';
        if (score >= 65) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const assessmentTypes = [...new Set(grades.map(g => g.assessment_type))];
    const filteredGrades = selectedAssessment 
        ? grades.filter(g => g.assessment_type === selectedAssessment)
        : grades;

    const averageScore = grades.length > 0 
        ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(2)
        : 0;

    const highestScore = grades.length > 0 ? Math.max(...grades.map(g => g.score)) : 0;
    const lowestScore = grades.length > 0 ? Math.min(...grades.map(g => g.score)) : 0;

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
                            Nilai {child.name}
                        </h1>
                        <p className="text-slate-600">
                            Kelas {child.class}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Total Penilaian
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {pagination.total}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Rata-rata Nilai
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {averageScore}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Nilai Tertinggi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {highestScore}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    Nilai Terendah
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {lowestScore}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grades List */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Daftar Nilai
                                    </CardTitle>
                                    <CardDescription>
                                        Total {filteredGrades.length} penilaian
                                    </CardDescription>
                                </div>
                                {assessmentTypes.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-slate-600" />
                                        <select 
                                            value={selectedAssessment}
                                            onChange={(e) => setSelectedAssessment(e.target.value)}
                                            className="text-sm border border-slate-300 rounded px-3 py-1"
                                        >
                                            <option value="">Semua Jenis</option>
                                            {assessmentTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredGrades.length === 0 ? (
                                <p className="text-sm text-slate-600 text-center py-8">
                                    Tidak ada nilai yang cocok
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {filteredGrades.map((grade) => (
                                        <div 
                                            key={grade.id}
                                            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-slate-900">
                                                    {grade.subject}
                                                </h4>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-600">
                                                    <span>{grade.assessment_type}</span>
                                                    <span>{grade.date}</span>
                                                    {grade.teacher && (
                                                        <span>Guru: {grade.teacher}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className={`px-3 py-1 rounded font-bold text-sm ${getGradeColor(grade.score)}`}>
                                                        {grade.score}
                                                    </div>
                                                </div>
                                            </div>
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
                                <Link href={route('parent.child.grades', {student: child.id, page: pagination.current_page - 1})}>
                                    <Button variant="outline">
                                        Sebelumnya
                                    </Button>
                                </Link>
                            )}
                            
                            <span className="px-4 py-2">
                                Halaman {pagination.current_page} dari {pagination.last_page}
                            </span>

                            {pagination.current_page < pagination.last_page && (
                                <Link href={route('parent.child.grades', {student: child.id, page: pagination.current_page + 1})}>
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
