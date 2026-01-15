import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Minus, Save, ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface TeacherClass {
    id: number;
    class_name: string;
    grade: {
        name: string;
    };
    subject: {
        id: number;
        name: string;
    };
}

interface Subject {
    id: number;
    name: string;
}

interface Template {
    id: number;
    title: string;
    learning_objectives: string;
    learning_activities: Array<{
        activity: string;
        duration: number;
    }>;
    materials_needed: string;
    assessment_methods: string;
}

interface Props {
    teacherClasses: TeacherClass[];
    subjects: Subject[];
    templates: Template[];
}

interface LearningActivity {
    activity: string;
    duration: number;
}

export default function CreateLessonPlan({ teacherClasses, subjects, templates }: Props) {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        teacher_class_id: undefined,
        subject_id: undefined,
        title: '',
        description: '',
        lesson_date: '',
        start_time: '',
        end_time: '',
        learning_objectives: '',
        materials_needed: '',
        learning_activities: [{ activity: '', duration: 30 }] as LearningActivity[],
        assessment_methods: '',
        homework_assignment: '',
        notes: '',
        status: 'draft' as 'draft' | 'published',
        is_template: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/lesson-plans');
    };

    const addActivity = () => {
        setData('learning_activities', [...data.learning_activities, { activity: '', duration: 30 }]);
    };

    const removeActivity = (index: number) => {
        const activities = data.learning_activities.filter((_, i) => i !== index);
        setData('learning_activities', activities);
    };

    const updateActivity = (index: number, field: keyof LearningActivity, value: string | number) => {
        const activities = [...data.learning_activities];
        activities[index] = { ...activities[index], [field]: value };
        setData('learning_activities', activities);
    };

    const applyTemplate = (templateId: number) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setData({
                ...data,
                title: template.title,
                learning_objectives: template.learning_objectives,
                learning_activities: template.learning_activities,
                materials_needed: template.materials_needed || '',
                assessment_methods: template.assessment_methods || '',
            });
        }
        setSelectedTemplate(null);
    };

    const calculateTotalDuration = () => {
        return data.learning_activities.reduce((total, activity) => total + activity.duration, 0);
    };

    const selectedClass = teacherClasses.find(cls => cls.id.toString() === data.teacher_class_id);

    return (
        <AppLayout>
            <Head title="Create Lesson Plan" />
            
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.visit('/teacher/lesson-plans')}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Create Lesson Plan</h1>
                            <p className="text-slate-600 mt-1">Design your lesson structure and activities</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Enter the basic details of your lesson</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="teacher_class_id">Class *</Label>
                                            <Select value={data.teacher_class_id || ''} onValueChange={(value) => {
                                                setData('teacher_class_id', value);
                                                const selectedClass = teacherClasses.find(cls => cls.id.toString() === value);
                                                if (selectedClass) {
                                                    setData('subject_id', selectedClass.subject.id.toString());
                                                }
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teacherClasses.map((cls) => (
                                                        <SelectItem key={cls.id} value={cls.id.toString()}>
                                                            {cls.class_name} - {cls.grade.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.teacher_class_id && <p className="text-sm text-red-600">{errors.teacher_class_id}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="subject_id">Subject *</Label>
                                            <Select value={data.subject_id || ''} onValueChange={(value) => setData('subject_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select subject" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects.map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id.toString()}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.subject_id && <p className="text-sm text-red-600">{errors.subject_id}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="title">Lesson Title *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter lesson title"
                                        />
                                        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Brief description of the lesson"
                                            rows={3}
                                        />
                                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Schedule */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Schedule</CardTitle>
                                    <CardDescription>Set the date and time for this lesson</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="lesson_date">Date *</Label>
                                            <Input
                                                id="lesson_date"
                                                type="date"
                                                value={data.lesson_date}
                                                onChange={(e) => setData('lesson_date', e.target.value)}
                                            />
                                            {errors.lesson_date && <p className="text-sm text-red-600">{errors.lesson_date}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="start_time">Start Time *</Label>
                                            <Input
                                                id="start_time"
                                                type="time"
                                                value={data.start_time}
                                                onChange={(e) => setData('start_time', e.target.value)}
                                            />
                                            {errors.start_time && <p className="text-sm text-red-600">{errors.start_time}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="end_time">End Time *</Label>
                                            <Input
                                                id="end_time"
                                                type="time"
                                                value={data.end_time}
                                                onChange={(e) => setData('end_time', e.target.value)}
                                            />
                                            {errors.end_time && <p className="text-sm text-red-600">{errors.end_time}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Learning Objectives */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Learning Objectives</CardTitle>
                                    <CardDescription>What should students learn from this lesson?</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={data.learning_objectives}
                                        onChange={(e) => setData('learning_objectives', e.target.value)}
                                        placeholder="List the learning objectives for this lesson..."
                                        rows={4}
                                    />
                                    {errors.learning_objectives && <p className="text-sm text-red-600">{errors.learning_objectives}</p>}
                                </CardContent>
                            </Card>

                            {/* Learning Activities */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Learning Activities</CardTitle>
                                            <CardDescription>Plan your lesson activities with time allocations</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Clock className="w-4 h-4" />
                                            <span>Total: {calculateTotalDuration()} minutes</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {data.learning_activities.map((activity, index) => (
                                        <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <Label>Activity {index + 1}</Label>
                                                <Textarea
                                                    value={activity.activity}
                                                    onChange={(e) => updateActivity(index, 'activity', e.target.value)}
                                                    placeholder="Describe the activity..."
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="w-24">
                                                <Label>Minutes</Label>
                                                <Input
                                                    type="number"
                                                    value={activity.duration}
                                                    onChange={(e) => updateActivity(index, 'duration', parseInt(e.target.value) || 0)}
                                                    min="1"
                                                />
                                            </div>
                                            {data.learning_activities.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeActivity(index)}
                                                    className="mt-6"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addActivity}
                                        className="w-full"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Activity
                                    </Button>
                                    
                                    {errors.learning_activities && <p className="text-sm text-red-600">{errors.learning_activities}</p>}
                                </CardContent>
                            </Card>

                            {/* Additional Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="materials_needed">Materials Needed</Label>
                                        <Textarea
                                            id="materials_needed"
                                            value={data.materials_needed}
                                            onChange={(e) => setData('materials_needed', e.target.value)}
                                            placeholder="List the materials and resources needed..."
                                            rows={3}
                                        />
                                        {errors.materials_needed && <p className="text-sm text-red-600">{errors.materials_needed}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="assessment_methods">Assessment Methods</Label>
                                        <Textarea
                                            id="assessment_methods"
                                            value={data.assessment_methods}
                                            onChange={(e) => setData('assessment_methods', e.target.value)}
                                            placeholder="How will you assess student learning?"
                                            rows={3}
                                        />
                                        {errors.assessment_methods && <p className="text-sm text-red-600">{errors.assessment_methods}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="homework_assignment">Homework Assignment</Label>
                                        <Textarea
                                            id="homework_assignment"
                                            value={data.homework_assignment}
                                            onChange={(e) => setData('homework_assignment', e.target.value)}
                                            placeholder="Assign homework or follow-up activities..."
                                            rows={3}
                                        />
                                        {errors.homework_assignment && <p className="text-sm text-red-600">{errors.homework_assignment}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Additional notes or reminders..."
                                            rows={3}
                                        />
                                        {errors.notes && <p className="text-sm text-red-600">{errors.notes}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Templates */}
                            {templates.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Use Template</CardTitle>
                                        <CardDescription>Start from an existing template</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Select value={selectedTemplate?.toString() || ''} onValueChange={(value) => setSelectedTemplate(parseInt(value))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {templates.map((template) => (
                                                    <SelectItem key={template.id} value={template.id.toString()}>
                                                        {template.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        
                                        {selectedTemplate && (
                                            <Button
                                                type="button"
                                                className="w-full mt-2"
                                                onClick={() => applyTemplate(selectedTemplate)}
                                            >
                                                Apply Template
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Class Info */}
                            {selectedClass && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Class Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-slate-500" />
                                                <span className="font-medium">{selectedClass.class_name}</span>
                                            </div>
                                            <div className="text-slate-600">
                                                Grade: {selectedClass.grade.name}
                                            </div>
                                            <div className="text-slate-600">
                                                Subject: {selectedClass.subject.name}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value as 'draft' | 'published')}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_template"
                                            checked={data.is_template}
                                            onCheckedChange={(checked) => setData('is_template', !!checked)}
                                        />
                                        <Label htmlFor="is_template" className="text-sm">
                                            Save as template
                                        </Label>
                                    </div>

                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Creating...' : 'Create Lesson Plan'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}