import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { BookOpen, Calendar, TrendingUp, FileText, Users, Clock, Award, Target } from 'lucide-react';

interface StudentUser {
    id: number;
    name: string;
    email: string;
    student?: {
        id: number;
        student_id: string;
        class: string;
        academic_year: string;
    };
}

interface StudentStats {
    total_assignments: number;
    completed_assignments: number;
    attendance_rate: number;
    current_grades: number;
    upcoming_exams: number;
}

interface Assignment {
    id: number;
    title: string;
    subject: string;
    due_date: string;
    status: 'pending' | 'submitted' | 'graded';
    grade?: number;
}

interface Exam {
    id: number;
    title: string;
    subject: string;
    date: string;
    time: string;
    duration: number;
}

interface Props {
    user: StudentUser;
    stats: StudentStats;
    recent_assignments: Assignment[];
    upcoming_exams: Exam[];
}

export default function StudentDashboard({ 
    user, 
    stats, 
    recent_assignments = [], 
    upcoming_exams = [] 
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Student Dashboard',
            href: '/student/dashboard',
        },
    ];

    const getAssignmentStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            pending: { variant: "destructive", text: "Pending" },
            submitted: { variant: "default", text: "Submitted" },
            graded: { variant: "secondary", text: "Graded" }
        };
        return variants[status] || variants.pending;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold  mb-2">
                               Selamat datang, {user.name}!
                            </h1>
                            <p className="text-muted-foreground">
                                {user.student ? (
                                    <>ID Siswa: {user.student.student_id} • Kelas: {user.student.class} • Tahun Akademik: {user.student.academic_year}</>
                                ) : (
                                    'Dasbor pembelajaran Anda'
                                )}
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <Button asChild>
                                <Link href="/student/assignments">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Lihat Semua Tugas
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Tugas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.completed_assignments}/{stats.total_assignments}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tugas selesai
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Kehadiran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.attendance_rate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tingkat kehadiran bulan ini
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Award className="h-4 w-4 mr-2" />
                                Nilai Saat Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.current_grades}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tugas yang dinilai
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Target className="h-4 w-4 mr-2" />
                                Ujian Mendatang
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.upcoming_exams}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ujian minggu ini
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Assignments */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Tugas Terbaru</CardTitle>
                                <Link href="/student/assignments">
                                    <Button variant="outline" size="sm">
                                        Lihat Semua
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recent_assignments.length > 0 ? (
                                <div className="space-y-4">
                                    {recent_assignments.slice(0, 5).map((assignment) => (
                                        <div 
                                            key={assignment.id}
                                            className="flex justify-between items-center p-3 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {assignment.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {assignment.subject} • Due: {new Date(assignment.due_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge {...getAssignmentStatusBadge(assignment.status)}>
                                                    {getAssignmentStatusBadge(assignment.status).text}
                                                </Badge>
                                                {assignment.grade && (
                                                    <span className="text-sm font-medium text-green-600">
                                                        {assignment.grade}/100
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                                    <p>Belum ada tugas.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Exams */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Upcoming Exams</CardTitle>
                                <Link href="/student/exams">
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {upcoming_exams.length > 0 ? (
                                <div className="space-y-4">
                                    {upcoming_exams.slice(0, 5).map((exam) => (
                                        <div 
                                            key={exam.id}
                                            className="flex justify-between items-center p-3 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {exam.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {exam.subject}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(exam.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {exam.time} ({exam.duration} min)
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                Upcoming
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                                    <p>No upcoming exams.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/student/assignments" className="flex flex-col items-center gap-2">
                                    <FileText className="w-6 h-6" />
                                    <span className="text-sm">My Assignments</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/student/grades" className="flex flex-col items-center gap-2">
                                    <Award className="w-6 h-6" />
                                    <span className="text-sm">My Grades</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/student/schedule" className="flex flex-col items-center gap-2">
                                    <Calendar className="w-6 h-6" />
                                    <span className="text-sm">Class Schedule</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-auto p-4">
                                <Link href="/student/attendance" className="flex flex-col items-center gap-2">
                                    <Users className="w-6 h-6" />
                                    <span className="text-sm">My Attendance</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}