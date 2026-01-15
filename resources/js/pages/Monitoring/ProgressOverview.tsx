import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { exportProgressReportToPDF } from '@/utils/pdf-export';
import { 
    Users, 
    TrendingUp, 
    Award, 
    AlertCircle, 
    Search, 
    Eye, 
    Filter,
    Calendar,
    BookOpen,
    Target
} from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    student_id: string;
    class: string;
    academic_year: number;
    average_grade: number;
    attendance_rate: number;
    total_grades: number;
    status: 'excellent' | 'good' | 'satisfactory' | 'needs_attention';
}

interface Stats {
    total_students: number;
    excellent_performance: number;
    needs_attention: number;
    overall_average_grade: number;
    overall_attendance_rate: number;
}

interface ProgressOverviewProps {
    students: Student[];
    stats: Stats;
}

export default function ProgressOverview({ students, stats }: ProgressOverviewProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const handleExportToPDF = () => {
        exportProgressReportToPDF(filteredStudents, stats);
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
                            student.student_id.toLowerCase().includes(search.toLowerCase()) ||
                            student.class.toLowerCase().includes(search.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'excellent':
                return { variant: 'default' as const, className: 'bg-green-500 text-white', text: 'Excellent' };
            case 'good':
                return { variant: 'default' as const, className: 'bg-blue-500 text-white', text: 'Good' };
            case 'satisfactory':
                return { variant: 'default' as const, className: 'bg-yellow-500 text-white', text: 'Satisfactory' };
            case 'needs_attention':
                return { variant: 'destructive' as const, text: 'Needs Attention' };
            default:
                return { variant: 'outline' as const, text: status };
        }
    };

    const getGradeColor = (grade: number) => {
        if (grade >= 85) return 'text-green-600';
        if (grade >= 75) return 'text-blue-600';
        if (grade >= 65) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getAttendanceColor = (rate: number) => {
        if (rate >= 90) return 'text-green-600';
        if (rate >= 85) return 'text-blue-600';
        if (rate >= 75) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <AppLayout>
            <Head title="Progress Reports Overview - BQ Islamic Boarding School" />
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Modern Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 mb-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-blue-600/20" />
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="absolute bottom-16 left-8 w-24 h-24 bg-indigo-400/10 rounded-full blur-lg" />
                
                <div className="relative z-10 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm border border-white/20">
                                    Progress Overview
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                                Student Progress Reports
                            </h1>
                            <p className="text-purple-100 text-lg max-w-2xl">
                                Comprehensive overview of academic progress and attendance monitoring for all students
                            </p>
                        </div>
                        <div className="mt-6 lg:mt-0 flex flex-wrap gap-3">
                            <Button 
                                variant="secondary" 
                                className="bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-sm text-white"
                                onClick={handleExportToPDF}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Export Report
                            </Button>
                            <Button className="bg-white text-purple-600 hover:bg-white/90">
                                <Target className="w-4 h-4 mr-2" />
                                Set Goals
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Students</p>
                                <p className="text-3xl font-bold text-blue-900">{stats.total_students}</p>
                            </div>
                            <div className="p-3 bg-blue-600 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Excellent Performance</p>
                                <p className="text-3xl font-bold text-green-900">{stats.excellent_performance}</p>
                            </div>
                            <div className="p-3 bg-green-600 rounded-lg">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Needs Attention</p>
                                <p className="text-3xl font-bold text-orange-900">{stats.needs_attention}</p>
                            </div>
                            <div className="p-3 bg-orange-600 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Avg Attendance</p>
                                <p className="text-3xl font-bold text-purple-900">{stats.overall_attendance_rate}%</p>
                            </div>
                            <div className="p-3 bg-purple-600 rounded-lg">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 max-w-sm">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search students..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-muted-foreground"
                            >
                                <option value="all">All Status</option>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="satisfactory">Satisfactory</option>
                                <option value="needs_attention">Needs Attention</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Students Progress Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Academic Year
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Average Grade
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Attendance Rate
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map((student) => {
                                    const statusBadge = getStatusBadge(student.status);
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium ">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {student.student_id} • {student.class}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm ">
                                                {student.academic_year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium ${getGradeColor(student.average_grade)}`}>
                                                    {student.average_grade}
                                                </span>
                                                <div className="text-xs text-muted-foreground">
                                                    {student.total_grades} grades
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium ${getAttendanceColor(student.attendance_rate)}`}>
                                                    {student.attendance_rate}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge 
                                                    variant={statusBadge.variant}
                                                    className={statusBadge.className}
                                                >
                                                    {statusBadge.text}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link href={`/monitoring/students/${student.id}/progress`}>
                                                        <Eye className="w-4 h-4" />
                                                        View Detail
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium  mb-2">No students found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </Card>
            </div>
            </div>
        </AppLayout>
    );
}