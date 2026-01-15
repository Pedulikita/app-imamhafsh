import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

interface GradeLevel {
    id: number;
    name: string;
}

interface Subject {
    id: number;
    name: string;
}

interface Teacher {
    id: number;
    name: string;
}

interface Props {
    grades: GradeLevel[];
    subjects: Subject[];
    teachers: Teacher[];
}

export default function CreateClass({ grades, subjects, teachers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        grade_id: '',
        subject_id: '',
        teacher_id: '',
        academic_year: '2024/2025',
        semester: '1',
        description: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teacher Dashboard',
            href: '/teacher/dashboard',
        },
        {
            title: 'Classes',
            href: '/teacher/classes',
        },
        {
            title: 'Create Class',
            href: '/teacher/classes/create',
        },
    ];

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/teacher/classes');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Class" />
            
            <div className="space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Buat Kelas Baru</h1>
                        <p className="text-muted-foreground">Buat kelas baru untuk mengajar dan mengelola siswa</p>
                    </div>
                    <Link href="/teacher/classes">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Kelas
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Kelas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Class Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Kelas *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. Grade 7A Mathematics"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Grade Level */}
                                <div className="space-y-2">
                                    <Label htmlFor="grade_id">Tingkat Kelas *</Label>
                                    <Select value={data.grade_id} onValueChange={(value) => setData('grade_id', value)}>
                                        <SelectTrigger className={errors.grade_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih tingkat kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {grades.map((grade) => (
                                                <SelectItem key={grade.id} value={grade.id.toString()}>
                                                    {grade.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.grade_id && (
                                        <p className="text-sm text-red-600">{errors.grade_id}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <Label htmlFor="subject_id">Mata Pelajaran *</Label>
                                    <Select value={data.subject_id} onValueChange={(value) => setData('subject_id', value)}>
                                        <SelectTrigger className={errors.subject_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih mata pelajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                                    {subject.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.subject_id && (
                                        <p className="text-sm text-red-600">{errors.subject_id}</p>
                                    )}
                                </div>

                                {/* Teacher */}
                                <div className="space-y-2">
                                    <Label htmlFor="teacher_id">Teacher *</Label>
                                    <Select value={data.teacher_id} onValueChange={(value) => setData('teacher_id', value)}>
                                        <SelectTrigger className={errors.teacher_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select teacher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                    {teacher.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.teacher_id && (
                                        <p className="text-sm text-red-600">{errors.teacher_id}</p>
                                    )}
                                </div>

                                {/* Academic Year */}
                                <div className="space-y-2">
                                    <Label htmlFor="academic_year">Tahun Akademik *</Label>
                                    <Input
                                        id="academic_year"
                                        value={data.academic_year}
                                        onChange={e => setData('academic_year', e.target.value)}
                                        placeholder="2024/2025"
                                        className={errors.academic_year ? 'border-red-500' : ''}
                                    />
                                    {errors.academic_year && (
                                        <p className="text-sm text-red-600">{errors.academic_year}</p>
                                    )}
                                </div>

                                {/* Semester */}
                                <div className="space-y-2">
                                    <Label htmlFor="semester">Semester *</Label>
                                    <Select value={data.semester} onValueChange={(value) => setData('semester', value)}>
                                        <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Semester 1</SelectItem>
                                            <SelectItem value="2">Semester 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.semester && (
                                        <p className="text-sm text-red-600">{errors.semester}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Deskripsi opsional untuk kelas ini..."
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Link href="/teacher/classes">
                                    <Button type="button" variant="outline" disabled={processing}>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        'Creating...'
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Buat Kelas
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}