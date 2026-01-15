import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Student {
    id: number;
    name: string;
    nis: string;
    nisn?: string;
    grade_level: string;
    class: string;
}

interface Grade {
    id: number;
    student_id: number;
    subject: string;
    assessment_type: string;
    score: number;
    assessment_date: string;
    notes?: string;
    student: Student;
}

interface TeacherClass {
    id: number;
    name: string;
    subject: {
        id: number;
        name: string;
    };
    grade: {
        name: string;
    };
    students: Student[];
}

interface Stats {
    total_students: number;
    graded_students: number;
    average_score: number;
    highest_score: number;
    lowest_score: number;
    total_classes: number;
    total_subjects: number;
}

interface GradeManagementProps {
    classes: TeacherClass[];
    grades: Grade[];
    subjects: string[];
    students: Student[];
    stats: Stats;
}

export default function GradeManagement({ 
    classes, 
    grades = [], 
    subjects = [], 
    students = [], 
    stats 
}: GradeManagementProps) {
    const [showAddGrade, setShowAddGrade] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedAssessment, setSelectedAssessment] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        teacher_class_id: '',
        subject: '',
        assessment_type: '',
        score: '',
        assessment_date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const assessmentTypes = [
        { value: 'quiz', label: 'Quiz', color: 'bg-blue-100 text-blue-800' },
        { value: 'uts', label: 'UTS', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'uas', label: 'UAS', color: 'bg-red-100 text-red-800' },
        { value: 'tugas', label: 'Tugas', color: 'bg-green-100 text-green-800' },
        { value: 'praktikum', label: 'Praktikum', color: 'bg-purple-100 text-purple-800' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/teacher/grades', {
            onSuccess: () => {
                reset();
                setShowAddGrade(false);
                alert('Nilai berhasil disimpan!');
            },
            onError: (errors) => {
                console.error('Error saving grade:', errors);
            }
        });
    };

    const getAssessmentTypeColor = (type: string) => {
        const assessment = assessmentTypes.find(a => a.value === type);
        return assessment?.color || 'bg-gray-100 text-gray-800';
    };

    const filteredStudents = selectedClass 
        ? students.filter(student => 
            classes.find(cls => cls.id.toString() === selectedClass)?.students.some(s => s.id === student.id)
          )
        : students;

    return (
        <AppLayout>
            <Head title="Grade Management - BQ Islamic Boarding School" />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold ">Grade Management System</h1>
                            <p className="text-muted-foreground mt-1">Kelola nilai siswa untuk semua mata pelajaran</p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex gap-3">
                            <Button variant="outline" onClick={() => window.open('/teacher/grades/export', '_blank')}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Excel
                            </Button>
                            <Button onClick={() => setShowAddGrade(true)}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Input Nilai
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Siswa</p>
                                <p className="text-3xl font-bold text-blue-900">{stats.total_students}</p>
                            </div>
                            <div className="p-3 bg-blue-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Rata-rata Nilai</p>
                                <p className="text-3xl font-bold text-green-900">{stats.average_score}</p>
                            </div>
                            <div className="p-3 bg-green-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Total Kelas</p>
                                <p className="text-3xl font-bold text-purple-900">{stats.total_classes}</p>
                            </div>
                            <div className="p-3 bg-purple-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600">Total Nilai</p>
                                <p className="text-3xl font-bold text-yellow-900">{grades.length}</p>
                            </div>
                            <div className="p-3 bg-yellow-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Form */}
                    {showAddGrade && (
                        <div className="lg:col-span-3 bg-white rounded-lg shadow p-6 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Input Nilai Baru</h3>
                                <Button variant="outline" onClick={() => setShowAddGrade(false)}>
                                    Tutup
                                </Button>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kelas *</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={selectedClass}
                                            onChange={(e) => {
                                                setSelectedClass(e.target.value);
                                                setData('teacher_class_id', e.target.value);
                                            }}
                                            required
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {classes.map(cls => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.name} - {cls.subject.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran *</label>
                                        <Input
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="Nama mata pelajaran"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Siswa *</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={data.student_id}
                                            onChange={(e) => setData('student_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Siswa</option>
                                            {filteredStudents.map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.name} ({student.nis})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Penilaian *</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            value={data.assessment_type}
                                            onChange={(e) => setData('assessment_type', e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Jenis Penilaian</option>
                                            {assessmentTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nilai *</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.score}
                                            onChange={(e) => setData('score', e.target.value)}
                                            placeholder="0-100"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Penilaian</label>
                                        <Input
                                            type="date"
                                            value={data.assessment_date}
                                            onChange={(e) => setData('assessment_date', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                                    <Input
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Catatan tambahan (opsional)"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Nilai'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Grade List */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Riwayat Nilai Siswa</h3>
                            
                            {grades.length > 0 ? (
                                <div className="space-y-4">
                                    {grades.map(grade => (
                                        <div key={grade.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold">{grade.student.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {grade.student.nis} • {grade.subject}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge className={getAssessmentTypeColor(grade.assessment_type)}>
                                                            {assessmentTypes.find(t => t.value === grade.assessment_type)?.label || grade.assessment_type}
                                                        </Badge>
                                                        <span className="text-2xl font-bold text-green-600">{grade.score}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{grade.assessment_date}</p>
                                                </div>
                                            </div>
                                            {grade.notes && (
                                                <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                                                    {grade.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada nilai</h3>
                                    <p className="text-gray-600 mb-4">Mulai input nilai siswa untuk melihat data di sini</p>
                                    <Button onClick={() => setShowAddGrade(true)}>
                                        Input Nilai Pertama
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Class Summary */}
                {classes.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Kelas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {classes.map(cls => (
                                <div key={cls.id} className="border rounded-lg p-4">
                                    <h4 className="font-semibold">{cls.name}</h4>
                                    <p className="text-sm text-gray-600">{cls.subject.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {cls.students.length} siswa • {cls.grade.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}