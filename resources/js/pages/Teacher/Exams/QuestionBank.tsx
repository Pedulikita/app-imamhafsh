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
    BookOpen, 
    CheckSquare, 
    FileText,
    Eye,
    Edit,
    Trash2,
    Plus
} from 'lucide-react';

interface Question {
    id: number;
    exam_id: number;
    type: 'multiple_choice' | 'essay' | 'true_false' | 'short_answer';
    question_text: string;
    points: number;
    created_at: string;
    exam: {
        title: string;
        teacher_class: {
            class_name: string;
            subject: {
                name: string;
            };
        };
    };
}

interface Stats {
    total_questions: number;
    by_type: Record<string, number>;
    by_subject: Record<string, number>;
}

interface Props {
    questions: {
        data: Question[];
        links: any[];
        meta: any;
    };
    stats: Stats;
    teacherClasses: any[];
}

const QuestionBank: React.FC<Props> = ({ questions, stats, teacherClasses }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getQuestionTypeLabel = (type: string) => {
        const labels = {
            'multiple_choice': 'Multiple Choice',
            'essay': 'Essay',
            'true_false': 'True/False',
            'short_answer': 'Short Answer'
        };
        return labels[type as keyof typeof labels] || type;
    };

    const getQuestionTypeColor = (type: string) => {
        const colors = {
            'multiple_choice': 'bg-blue-100 text-blue-800',
            'essay': 'bg-green-100 text-green-800',
            'true_false': 'bg-yellow-100 text-yellow-800',
            'short_answer': 'bg-purple-100 text-purple-800'
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const truncateText = (text: string, limit: number = 100) => {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    return (
        <AppLayout>
            <Head title="Question Bank" />

            <div className="space-y-6 px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Question Bank</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage all your exam questions across subjects
                        </p>
                    </div>
                    <Link href="/teacher/exams/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Exam
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <CheckSquare className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                                    <p className="text-2xl font-bold ">{stats.total_questions}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <BookOpen className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Subjects</p>
                                    <p className="text-2xl font-bold ">
                                        {Object.keys(stats.by_subject).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Multiple Choice</p>
                                    <p className="text-2xl font-bold ">
                                        {stats.by_type.multiple_choice || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Edit className="h-8 w-8 text-orange-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Essay Questions</p>
                                    <p className="text-2xl font-bold ">
                                        {stats.by_type.essay || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter and Search */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Semua Pertanyaan</CardTitle>
                                <CardDescription>
                                    Telusuri dan kelola pertanyaan dari semua ujian Anda
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search questions..."
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
                            {questions.data.map((question) => (
                                <div
                                    key={question.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={getQuestionTypeColor(question.type)}>
                                                    {getQuestionTypeLabel(question.type)}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {question.points} pts
                                                </Badge>
                                                <span className="text-sm text-gray-500">
                                                    {question.exam.teacher_class.subject.name}
                                                </span>
                                            </div>
                                            <h3 className="font-medium  mb-2">
                                                {truncateText(question.question_text, 150)}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>Ujian: {question.exam.title}</span>
                                                <span>Kelas: {question.exam.teacher_class.class_name}</span>
                                                <span>Dibuat: {new Date(question.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Link href={`/teacher/exams/${question.exam_id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {questions.data.length === 0 && (
                                <div className="text-center py-8">
                                    <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium ">No questions found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Create your first exam to start building your question bank.
                                    </p>
                                    <div className="mt-6">
                                        <Link href="/teacher/exams/create">
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create New Exam
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {questions.data.length > 0 && questions.links && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex gap-2">
                                    {questions.links.map((link, index) => (
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

export default QuestionBank;