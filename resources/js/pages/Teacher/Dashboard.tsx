import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { Users, BookOpen, TrendingUp, Plus, Eye, Info, Lock, Eye as EyeIcon } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Statistics {
    total_classes: number;
    total_students: number;
    average_attendance: number;
}

interface ClassData {
    id: number;
    name: string;
    grade_name: string;
    subject_name: string;
    total_students: number;
    attendance_rate: number;
    status: string;
}

interface Props {
    user: User;
    statistics: Statistics;
    classes: ClassData[];
    recent_activities: any[];
    canManageClasses: boolean;
}

export default function TeacherDashboard({ 
    user, 
    statistics, 
    classes, 
    canManageClasses 
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teacher Dashboard',
            href: '/teacher/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold ">
                            Welcome, {user.name}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {user.role} Dashboard
                        </p>
                    </div>
                    {canManageClasses && (
                        <Link href="/teacher/classes/create">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Class
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Total Classes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.total_classes}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active classes you're teaching
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                Total Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.total_students}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Students across all your classes
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Average Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.average_attendance}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Overall attendance rate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Student Management Permissions Info */}
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                        <strong>Student Management Access:</strong> As a teacher, you can view student information for monitoring purposes. 
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                                <EyeIcon className="h-3 w-3 text-green-600" />
                                <span className="text-sm">View student lists and information</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <EyeIcon className="h-3 w-3 text-green-600" />
                                <span className="text-sm">Access student statistics and reports</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="h-3 w-3 text-orange-600" />
                                <span className="text-sm">Create, edit, delete students - Admin only</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="h-3 w-3 text-orange-600" />
                                <span className="text-sm">Bulk operations and import/export - Admin only</span>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>

                {/* My Classes */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>My Classes</CardTitle>
                            <Link href="/teacher/classes">
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {classes.length > 0 ? (
                            <div className="space-y-4">
                                {classes.slice(0, 5).map((classItem) => (
                                    <div 
                                        key={classItem.id}
                                        className="flex justify-between items-center p-3 border rounded-lg"
                                    >
                                        <div>
                                            <h3 className="font-medium">
                                                {classItem.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {classItem.grade_name} • {classItem.subject_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">
                                                {classItem.total_students} students
                                            </div>
                                            <Badge 
                                                variant={classItem.attendance_rate >= 80 ? "default" : "secondary"}
                                            >
                                                {classItem.attendance_rate}% attendance
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <BookOpen className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                                <p>No classes assigned yet.</p>
                                {canManageClasses && (
                                    <Link href="/teacher/classes/create" className="mt-2">
                                        <Button variant="outline">Create Your First Class</Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}