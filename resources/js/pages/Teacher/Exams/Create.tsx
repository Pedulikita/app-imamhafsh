import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Settings } from 'lucide-react';

interface TeacherClass {
    id: number;
    name: string;
    subject: string;
    grade: string;
}

interface Subject {
    id: number;
    name: string;
}

interface ExamType {
    [key: string]: string;
}

interface Props {
    teacher_classes: TeacherClass[];
    subjects: Subject[];
    exam_types: ExamType;
}

export default function Create({ teacher_classes, subjects, exam_types }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        teacher_class_id: '',
        title: '',
        description: '',
        subject: '',
        type: 'quiz',
        duration_minutes: 60,
        start_time: '',
        end_time: '',
        allow_retake: false,
        max_attempts: 1,
        show_results: true,
        shuffle_questions: false,
        show_one_question: true,
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/exams');
    };

    const handleClassChange = (classId: string) => {
        const selectedClass = teacher_classes.find(c => c.id.toString() === classId);
        setData(prev => ({
            ...prev,
            teacher_class_id: classId,
            subject: selectedClass?.subject || ''
        }));
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.visit('/teacher/exams')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Ujian
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight ">
                        Buat Ujian Baru
                    </h2>
                </div>
            }
        >
            <Head title="Buat Ujian" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>
                                    Masukkan detail dasar untuk ujian Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="class">Class</Label>
                                        <Select
                                            value={data.teacher_class_id}
                                            onValueChange={handleClassChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a class" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teacher_classes.map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                                        {cls.name} - {cls.subject} ({cls.grade})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.teacher_class_id && (
                                            <p className="text-sm text-red-600">{errors.teacher_class_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Jenis Ujian</Label>
                                        <Select
                                            value={data.type}
                                            onValueChange={(value) => setData('type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(exam_types).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-red-600">{errors.type}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Ujian</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter exam title"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Mata Pelajaran</Label>
                                    <Input
                                        id="subject"
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="Subject name"
                                    />
                                    {errors.subject && (
                                        <p className="text-sm text-red-600">{errors.subject}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi (Opsional)</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Masukkan deskripsi atau instruksi ujian"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule & Duration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Jadwal & Durasi</CardTitle>
                                <CardDescription>
                                    Atur kapan siswa dapat mengikuti ujian ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Durasi (menit)</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            value={data.duration_minutes}
                                            onChange={(e) => setData('duration_minutes', parseInt(e.target.value))}
                                            min="1"
                                            max="480"
                                        />
                                        {errors.duration_minutes && (
                                            <p className="text-sm text-red-600">{errors.duration_minutes}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Waktu Mulai</Label>
                                        <Input
                                            id="start_time"
                                            type="datetime-local"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                        />
                                        {errors.start_time && (
                                            <p className="text-sm text-red-600">{errors.start_time}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">Waktu Selesai</Label>
                                        <Input
                                            id="end_time"
                                            type="datetime-local"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                        />
                                        {errors.end_time && (
                                            <p className="text-sm text-red-600">{errors.end_time}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Advanced Settings */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Pengaturan Lanjutan</CardTitle>
                                        <CardDescription>
                                            Konfigurasikan opsi ujian tambahan
                                        </CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        {showAdvanced ? 'Hide' : 'Show'}
                                    </Button>
                                </div>
                            </CardHeader>
                            {showAdvanced && (
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Izinkan Pengulangan</Label>
                                                    <p className="text-sm text-gray-500">
                                                        Siswa dapat mengulang ujian ini
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={data.allow_retake}
                                                    onCheckedChange={(checked) => setData('allow_retake', checked)}
                                                />
                                            </div>

                                            {data.allow_retake && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="max_attempts">Maksimum Percobaan</Label>
                                                    <Input
                                                        id="max_attempts"
                                                        type="number"
                                                        value={data.max_attempts}
                                                        onChange={(e) => setData('max_attempts', parseInt(e.target.value))}
                                                        min="1"
                                                        max="5"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Tampilkan Hasil</Label>
                                                    <p className="text-sm text-gray-500">
                                                        Tampilkan hasil kepada siswa setelah pengiriman
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={data.show_results}
                                                    onCheckedChange={(checked) => setData('show_results', checked)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Acak Pertanyaan</Label>
                                                    <p className="text-sm text-gray-500">
                                                        Acak urutan pertanyaan untuk setiap siswa
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={data.shuffle_questions}
                                                    onCheckedChange={(checked) => setData('shuffle_questions', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Satu Pertanyaan Per Halaman</Label>
                                                    <p className="text-sm text-gray-500">
                                                        Tampilkan satu pertanyaan dalam satu waktu
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={data.show_one_question}
                                                    onCheckedChange={(checked) => setData('show_one_question', checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/teacher/exams')}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Creating...' : 'Create Exam'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}