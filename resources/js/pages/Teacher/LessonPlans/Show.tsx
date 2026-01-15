import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    ArrowLeft, 
    Edit, 
    Copy, 
    FileText, 
    Calendar, 
    Clock, 
    BookOpen, 
    Users,
    CheckCircle,
    Target,
    Package,
    ClipboardCheck,
    BookMarked,
    StickyNote
} from 'lucide-react';

interface LessonPlan {
    id: number;
    title: string;
    description: string;
    lesson_date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    learning_objectives: string;
    materials_needed: string;
    learning_activities: Array<{
        activity: string;
        duration: number;
    }>;
    assessment_methods: string;
    homework_assignment: string;
    notes: string;
    status: 'draft' | 'published' | 'completed' | 'cancelled';
    is_template: boolean;
    reflection: string;
    attendance_count: number;
    teacher_class: {
        class_name: string;
        grade: {
            name: string;
        };
    };
    subject: {
        name: string;
    };
    teacher: {
        name: string;
    };
}

interface Props {
    lessonPlan: LessonPlan;
}

export default function ShowLessonPlan({ lessonPlan }: Props) {
    const handleDuplicate = () => {
        router.post(`/teacher/lesson-plans/${lessonPlan.id}/duplicate`);
    };

    const handleMakeTemplate = () => {
        router.post(`/teacher/lesson-plans/${lessonPlan.id}/make-template`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'published': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateTotalDuration = () => {
        return lessonPlan.learning_activities.reduce((total, activity) => total + activity.duration, 0);
    };

    return (
        <AppLayout>
            <Head title={`Lesson Plan: ${lessonPlan.title}`} />
            
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.visit('/teacher/lesson-plans')}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900">{lessonPlan.title}</h1>
                                <Badge className={getStatusColor(lessonPlan.status)}>
                                    {lessonPlan.status}
                                </Badge>
                                {lessonPlan.is_template && (
                                    <Badge variant="outline" className="text-purple-600">
                                        Template
                                    </Badge>
                                )}
                            </div>
                            <p className="text-slate-600">{lessonPlan.description}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleDuplicate}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                        </Button>
                        {!lessonPlan.is_template && (
                            <Button variant="outline" onClick={handleMakeTemplate}>
                                <FileText className="w-4 h-4 mr-2" />
                                Make Template
                            </Button>
                        )}
                        <Link href={`/teacher/lesson-plans/${lessonPlan.id}/edit`}>
                            <Button>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Lesson Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-slate-700 mb-1">Class</h4>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-slate-500" />
                                            <span>{lessonPlan.teacher_class.class_name} - {lessonPlan.teacher_class.grade.name}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-700 mb-1">Subject</h4>
                                        <span>{lessonPlan.subject.name}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-700 mb-1">Date</h4>
                                        <span>{formatDate(lessonPlan.lesson_date)}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-slate-700 mb-1">Time</h4>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-500" />
                                            <span>{formatTime(lessonPlan.start_time)} - {formatTime(lessonPlan.end_time)}</span>
                                            <span className="text-slate-500">({lessonPlan.duration_minutes} min)</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Learning Objectives */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Learning Objectives
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="whitespace-pre-line text-slate-700">
                                    {lessonPlan.learning_objectives}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Learning Activities */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Learning Activities
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Clock className="w-4 h-4" />
                                        <span>Total: {calculateTotalDuration()} minutes</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {lessonPlan.learning_activities.map((activity, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-slate-900">
                                                    Activity {index + 1}
                                                </h4>
                                                <Badge variant="outline">
                                                    {activity.duration} min
                                                </Badge>
                                            </div>
                                            <p className="text-slate-700 whitespace-pre-line">
                                                {activity.activity}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Details */}
                        <div className="grid gap-6">
                            {lessonPlan.materials_needed && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="w-5 h-5" />
                                            Materials Needed
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="whitespace-pre-line text-slate-700">
                                            {lessonPlan.materials_needed}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {lessonPlan.assessment_methods && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ClipboardCheck className="w-5 h-5" />
                                            Assessment Methods
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="whitespace-pre-line text-slate-700">
                                            {lessonPlan.assessment_methods}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {lessonPlan.homework_assignment && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookMarked className="w-5 h-5" />
                                            Homework Assignment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="whitespace-pre-line text-slate-700">
                                            {lessonPlan.homework_assignment}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Lesson Reflection */}
                        {(lessonPlan.status === 'completed' && lessonPlan.reflection) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <StickyNote className="w-5 h-5" />
                                        Lesson Reflection
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="whitespace-pre-line text-slate-700">
                                        {lessonPlan.reflection}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Teacher Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Teacher Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Teacher:</span> {lessonPlan.teacher.name}</p>
                                    <p><span className="font-medium">Created:</span> {new Date(lessonPlan.lesson_date).toLocaleDateString('id-ID')}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lesson Statistics */}
                        {(lessonPlan.status === 'completed' && lessonPlan.attendance_count !== null) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lesson Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm">Attendance</span>
                                            </div>
                                            <span className="font-medium">{lessonPlan.attendance_count} students</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notes */}
                        {lessonPlan.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="whitespace-pre-line text-slate-700 text-sm">
                                        {lessonPlan.notes}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href={`/teacher/lesson-plans/${lessonPlan.id}/edit`}>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Lesson Plan
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" className="w-full" onClick={handleDuplicate}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate Lesson
                                </Button>
                                {!lessonPlan.is_template && (
                                    <Button variant="outline" size="sm" className="w-full" onClick={handleMakeTemplate}>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Save as Template
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}