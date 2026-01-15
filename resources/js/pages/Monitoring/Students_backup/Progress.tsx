import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, Award, Clock, BarChart3, User, BookOpen } from 'lucide-react';
import { useMemo } from 'react';

interface Student {
    id: number;
    name: string;
    student_id: string;
    class: string;
    email: string;
}

interface Subject {
    id: number;
    name: string;
    code: string;
}

interface Grade {
    id: number;
    score: number;
    exam_type: string;
    subject: Subject;
    created_at: string;
}

interface Attendance {
    id: number;
    status: 'present' | 'absent' | 'late' | 'sick';
    date: string;
    subject: Subject;
}

interface ProgressProps {
    student: Student;
    grades: Record<string, Grade[]>;
    attendances: Record<string, Attendance[]>;
    stats: {
        total_grades: number;
        average_grade: number;
        attendance_rate: number;
        subjects_count: number;
    };
    filters: {
        academic_year: number;
        semester: string;
    };
}

export default function Progress({ student, grades, attendances, stats, filters }: ProgressProps) {
    const getGradeColor = (value: number) => {
        if (value >= 85) return 'bg-green-500';
        if (value >= 75) return 'bg-blue-500';
        if (value >= 65) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getAttendanceStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            case 'sick': return 'bg-blue-100 text-blue-800';
            case 'absent': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title={`Progress ${student.name} - BQ Islamic Boarding School`} />

        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Modern Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-8 mb-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-600/20" />
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="absolute bottom-16 left-8 w-24 h-24 bg-purple-400/10 rounded-full blur-lg" />
                
                <div className="relative z-10 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm border border-white/20">
                                    Progress Report
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                {student.name}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-lg">
                                <span className="text-indigo-100">Student ID: {student.student_id}</span>
                                <span className="text-indigo-100">•</span>
                                <span className="text-indigo-100">Class: {student.class}</span>
                                <span className="text-indigo-100">•</span>
                                <span className="text-indigo-100">Semester: {filters.semester} {filters.academic_year}</span>
                            </div>
                        </div>
                        <div className="mt-6 lg:mt-0 flex flex-wrap gap-3">
                            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm text-white">
                                <Calendar className="w-4 h-4 mr-2" />
                                Change Period
                            </Button>
                            <Button className="bg-white text-indigo-600 hover:bg-white/90">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Detailed Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Rata-rata Nilai</p>
                                <p className="text-3xl font-bold text-blue-900">{Math.round(stats.average_grade * 10) / 10}</p>
                            </div>
                            <div className="p-3 bg-blue-600 rounded-lg">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Tingkat Kehadiran</p>
                                <p className="text-3xl font-bold text-green-900">{Math.round(stats.attendance_rate * 10) / 10}%</p>
                            </div>
                            <div className="p-3 bg-green-600 rounded-lg">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Total Mata Pelajaran</p>
                                <p className="text-3xl font-bold text-purple-900">{stats.subjects_count}</p>
                            </div>
                            <div className="p-3 bg-purple-600 rounded-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Total Nilai</p>
                                <p className="text-3xl font-bold text-orange-900">{stats.total_grades}</p>
                            </div>
                            <div className="p-3 bg-orange-600 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Grades by Subject */}
                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Riwayat Nilai per Mata Pelajaran</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {Object.entries(grades).map(([subjectName, subjectGrades]) => (
                            <div key={subjectName} className="p-6 bg-slate-50 rounded-xl">
                                <h4 className="font-semibold text-lg mb-4 text-slate-900">{subjectName}</h4>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {subjectGrades.map((grade) => (
                                        <div key={grade.id} className="p-4 bg-white rounded-lg border border-slate-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-slate-600">{grade.exam_type}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {new Date(grade.created_at).toLocaleDateString('id-ID')}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-3 h-3 rounded-full ${getGradeColor(grade.score)}`}></span>
                                                <span className="text-2xl font-bold text-slate-900">{grade.score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Attendance by Subject */}
                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-600 rounded-lg">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Riwayat Kehadiran per Mata Pelajaran</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {Object.entries(attendances).map(([subjectName, subjectAttendances]) => (
                            <div key={subjectName} className="p-6 bg-slate-50 rounded-xl">
                                <h4 className="font-semibold text-lg mb-4 text-slate-900">{subjectName}</h4>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                    {subjectAttendances.slice(0, 10).map((attendance) => (
                                        <div key={attendance.id} className="p-4 bg-white rounded-lg border border-slate-200">
                                            <div className="text-sm font-medium text-slate-600 mb-2">
                                                {new Date(attendance.date).toLocaleDateString('id-ID')}
                                            </div>
                                            <Badge className={getAttendanceStatusColor(attendance.status)}>
                                                {attendance.status === 'present' ? 'Hadir' : 
                                                 attendance.status === 'late' ? 'Terlambat' : 
                                                 attendance.status === 'sick' ? 'Sakit' : 'Tidak Hadir'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                                {subjectAttendances.length > 10 && (
                                    <div className="mt-4 text-center">
                                        <Button variant="outline" size="sm">
                                            Lihat Selengkapnya ({subjectAttendances.length - 10} lainnya)
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
        </AppLayout>
    );
}