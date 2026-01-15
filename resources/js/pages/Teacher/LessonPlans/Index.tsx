import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Plus, 
    Calendar, 
    Clock, 
    BookOpen, 
    Search, 
    Filter,
    Eye,
    Edit,
    Copy,
    Trash,
    MoreVertical,
    FileText
} from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface LessonPlan {
    id: number;
    title: string;
    description: string;
    lesson_date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    status: 'draft' | 'published' | 'completed' | 'cancelled';
    teacher_class: {
        class_name: string;
        grade: {
            name: string;
        };
    };
    subject: {
        name: string;
    };
    is_template: boolean;
}

interface Props {
    lessonPlans: {
        data: LessonPlan[];
        links: any[];
        meta: any;
    };
    stats: {
        total_plans: number;
        this_week: number;
        upcoming: number;
        templates: number;
    };
}

export default function LessonPlansIndex({ lessonPlans, stats }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleDelete = (id: number) => {
        router.delete(`/teacher/lesson-plans/${id}`);
    };

    const handleDuplicate = (id: number) => {
        router.post(`/teacher/lesson-plans/${id}/duplicate`);
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

    const filteredPlans = lessonPlans.data.filter(plan => {
        const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plan.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plan.teacher_class.class_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || statusFilter === 'all' || plan.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout>
            <Head title="Lesson Plans" />
            
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Lesson Plans</h1>
                        <p className="text-slate-600 mt-1">Manage your teaching plans and materials</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/teacher/lesson-plans/calendar">
                            <Button variant="outline">
                                <Calendar className="w-4 h-4 mr-2" />
                                Calendar View
                            </Button>
                        </Link>
                        <Link href="/teacher/lesson-plans/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                New Lesson Plan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Total Plans
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_plans}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                This Week
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.this_week}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Upcoming
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.upcoming}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Templates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.templates}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Lesson Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search lesson plans..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Lesson Plans List */}
                <div className="grid gap-4">
                    {filteredPlans.map((plan) => (
                        <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-lg">{plan.title}</h3>
                                            <Badge className={getStatusColor(plan.status)}>
                                                {plan.status}
                                            </Badge>
                                            {plan.is_template && (
                                                <Badge variant="outline" className="text-purple-600">
                                                    Template
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{plan.subject.name} - {plan.teacher_class.class_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(plan.lesson_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatTime(plan.start_time)} - {formatTime(plan.end_time)}</span>
                                            </div>
                                        </div>
                                        
                                        {plan.description && (
                                            <p className="mt-2 text-slate-600 text-sm">{plan.description}</p>
                                        )}
                                    </div>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/teacher/lesson-plans/${plan.id}`}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/teacher/lesson-plans/${plan.id}/edit`}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(plan.id)}>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Trash className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Lesson Plan</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this lesson plan? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(plan.id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredPlans.length === 0 && (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="font-semibold text-slate-900 mb-2">No lesson plans found</h3>
                                <p className="text-slate-600 mb-4">
                                    {searchTerm || (statusFilter && statusFilter !== 'all') 
                                        ? "Try adjusting your search criteria." 
                                        : "Create your first lesson plan to get started."
                                    }
                                </p>
                                {!searchTerm && (!statusFilter || statusFilter === 'all') && (
                                    <Link href="/teacher/lesson-plans/create">
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create Lesson Plan
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}