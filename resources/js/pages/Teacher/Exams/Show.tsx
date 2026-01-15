import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    ArrowLeft, 
    Edit, 
    Play, 
    Pause, 
    BarChart3, 
    FileText, 
    Users, 
    Clock, 
    CheckCircle,
    AlertTriangle,
    Plus
} from 'lucide-react';
import { format } from 'date-fns';

interface Exam {
    id: number;
    title: string;
    description?: string;
    subject: string;
    class: string;
    grade: string;
    type: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    total_questions: number;
    total_points: number;
    is_published: boolean;
    allow_retake: boolean;
    max_attempts: number;
    show_results: boolean;
    status: 'active' | 'upcoming' | 'past';
    attempts_count: number;
    students_completed: number;
}

interface Question {
    id: number;
    question_text: string;
    type: string;
    points: number;
    order: number;
}

interface RecentAttempt {
    id: number;
    student_name: string;
    status: string;
    score: number;
    percentage: number;
    submitted_at: string;
}

interface Props {
    exam: Exam;
    questions: Question[];
    recent_attempts: RecentAttempt[];
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

const getQuestionTypeLabel = (type: string) => {
    const types = {
        multiple_choice: 'Multiple Choice',
        essay: 'Essay',
        true_false: 'True/False',
        fill_blank: 'Fill in the Blank'
    };
    return types[type] || type;
};

export default function Show({ exam, questions, recent_attempts }: Props) {
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = () => {
        if (questions.length === 0) {
            alert('Please add questions before publishing the exam.');
            return;
        }

        setIsPublishing(true);
        router.post(`/teacher/exams/${exam.id}/publish`, {}, {
            onFinish: () => setIsPublishing(false)
        });
    };

    const handleUnpublish = () => {
        if (confirm('Are you sure you want to unpublish this exam?')) {
            router.post(`/teacher/exams/${exam.id}/unpublish`);
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
            router.delete(`/teacher/exams/${exam.id}`);
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.visit('/teacher/exams')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                           Kembali ke Ujian
                        </Button>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                {exam.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {exam.subject} • {exam.class} • {exam.grade}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {getStatusBadge(exam.status, exam.is_published)}
                        
                        <Link href={`/teacher/exams/${exam.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </Link>

                        {exam.is_published ? (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleUnpublish}
                                className="text-orange-600 hover:text-orange-700"
                            >
                                <Pause className="w-4 h-4 mr-2" />
                                Unpublish
                            </Button>
                        ) : (
                            <Button 
                                size="sm" 
                                onClick={handlePublish}
                                disabled={isPublishing || questions.length === 0}
                            >
                                <Play className="w-4 h-4 mr-2" />
                                {isPublishing ? 'Publishing...' : 'Publish'}
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`${exam.title} - Exam Details`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="questions">
                                Pertanyaan ({questions.length})
                            </TabsTrigger>
                            <TabsTrigger value="results">
                                Hasil ({exam.attempts_count})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Exam Details */}
                                <div className="md:col-span-2 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Informasi Ujian</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {exam.description && (
                                                <div>
                                                    <h4 className="font-medium mb-2">Deskripsi</h4>
                                                    <p className="text-gray-700">{exam.description}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">Details</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Type:</span>
                                                            <span>{getTypeLabel(exam.type)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Duration:</span>
                                                            <span>{exam.duration_minutes} minutes</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Total Points:</span>
                                                            <span>{exam.total_points}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Max Attempts:</span>
                                                            <span>{exam.max_attempts}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-2">Jadwal</h4>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Mulai:</span>
                                                            <span>{format(new Date(exam.start_time), 'PPp')}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Akhir:</span>
                                                            <span>{format(new Date(exam.end_time), 'PPp')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium mb-2">Settings</h4>
                                                <div className="flex gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        {exam.allow_retake ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                                                        )}
                                                        <span>Retakes {exam.allow_retake ? 'Allowed' : 'Not Allowed'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {exam.show_results ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                                                        )}
                                                        <span>Results {exam.show_results ? 'Shown' : 'Hidden'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Recent Attempts */}
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle>Recent Attempts</CardTitle>
                                                <Link href={`/teacher/exams/${exam.id}/results`}>
                                                    <Button variant="outline" size="sm">
                                                        <BarChart3 className="w-4 h-4 mr-2" />
                                                        View All
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {recent_attempts.length === 0 ? (
                                                <p className="text-gray-500 text-center py-4">
                                                    No attempts yet
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {recent_attempts.map((attempt) => (
                                                        <div 
                                                            key={attempt.id}
                                                            className="flex items-center justify-between p-3 border rounded-lg"
                                                        >
                                                            <div>
                                                                <p className="font-medium">{attempt.student_name}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {format(new Date(attempt.submitted_at), 'PPp')}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium">
                                                                    {attempt.score}/{exam.total_points} 
                                                                    <span className="text-sm text-gray-500 ml-1">
                                                                        ({attempt.percentage.toFixed(1)}%)
                                                                    </span>
                                                                </p>
                                                                <Badge 
                                                                    variant={attempt.status === 'graded' ? 'default' : 'secondary'}
                                                                    className="text-xs"
                                                                >
                                                                    {attempt.status}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Statistics */}
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Statistics</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-blue-600">
                                                    {exam.students_completed}
                                                </div>
                                                <p className="text-sm text-gray-500">Students Completed</p>
                                            </div>

                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-green-600">
                                                    {exam.attempts_count}
                                                </div>
                                                <p className="text-sm text-gray-500">Total Attempts</p>
                                            </div>

                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-purple-600">
                                                    {exam.total_questions}
                                                </div>
                                                <p className="text-sm text-gray-500">Questions</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Quick Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <Link href={`/teacher/exams/${exam.id}/questions`}>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Manage Questions
                                                </Button>
                                            </Link>

                                            <Link href={`/teacher/exams/${exam.id}/results`}>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <BarChart3 className="w-4 h-4 mr-2" />
                                                    View Results
                                                </Button>
                                            </Link>

                                            <Link href={`/teacher/exams/${exam.id}/analytics`}>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <BarChart3 className="w-4 h-4 mr-2" />
                                                    Analytics
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="questions" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Questions ({questions.length})</CardTitle>
                                            <CardDescription>
                                                Manage exam questions and their settings
                                            </CardDescription>
                                        </div>
                                        <Link href={`/teacher/exams/${exam.id}/questions`}>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Question
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {questions.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500 mb-4">No questions added yet</p>
                                            <Link href={`/teacher/exams/${exam.id}/questions`}>
                                                <Button>Add Your First Question</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {questions.map((question, index) => (
                                                <div 
                                                    key={question.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-sm font-medium text-gray-500">
                                                                #{index + 1}
                                                            </span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {getQuestionTypeLabel(question.type)}
                                                            </Badge>
                                                            <span className="text-sm text-gray-500">
                                                                {question.points} pts
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-900 line-clamp-2">
                                                            {question.question_text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className="pt-4 border-t">
                                                <Link href={`/teacher/exams/${exam.id}/questions`}>
                                                    <Button variant="outline" className="w-full">
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        Manage All Questions
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="results" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Exam Results</CardTitle>
                                            <CardDescription>
                                                Student attempts and performance overview
                                            </CardDescription>
                                        </div>
                                        <Link href={`/teacher/exams/${exam.id}/results`}>
                                            <Button>
                                                <BarChart3 className="w-4 h-4 mr-2" />
                                                Full Results
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {exam.attempts_count === 0 ? (
                                        <div className="text-center py-8">
                                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500 mb-2">No attempts yet</p>
                                            <p className="text-sm text-gray-400">
                                                Students will appear here after they take the exam
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {exam.attempts_count}
                                                    </div>
                                                    <p className="text-sm text-blue-700">Total Attempts</p>
                                                </div>
                                                
                                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {exam.students_completed}
                                                    </div>
                                                    <p className="text-sm text-green-700">Completed</p>
                                                </div>
                                                
                                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-purple-600">
                                                        {exam.total_points}
                                                    </div>
                                                    <p className="text-sm text-purple-700">Max Points</p>
                                                </div>
                                            </div>

                                            <Link href={`/teacher/exams/${exam.id}/results`}>
                                                <Button variant="outline" className="w-full">
                                                    <BarChart3 className="w-4 h-4 mr-2" />
                                                    View Detailed Results & Analytics
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}