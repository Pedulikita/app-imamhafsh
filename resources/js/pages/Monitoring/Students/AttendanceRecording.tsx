import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Calendar, 
    Clock, 
    Users, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    FileText,
    Filter,
    Search,
    Download,
    Plus
} from 'lucide-react';

interface Student {
    id: number;
    name: string;
    student_id: string;
    class: string;
    photo?: string;
}

interface AttendanceRecord {
    id: number;
    student_id: number;
    date: string;
    status: 'present' | 'absent' | 'late' | 'sick' | 'permission';
    time_in?: string;
    notes?: string;
    student: Student;
}

interface AttendanceStats {
    total_students: number;
    present_today: number;
    absent_today: number;
    late_today: number;
    attendance_rate: number;
}

interface AttendanceRecordingProps {
    students: Student[];
    attendance_records: AttendanceRecord[];
    stats: AttendanceStats;
    selected_date: string;
    classes: Array<{id: number, name: string}>;
}

export default function AttendanceRecording({ 
    students, 
    attendance_records, 
    stats, 
    selected_date,
    classes 
}: AttendanceRecordingProps) {
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(selected_date || new Date().toISOString().split('T')[0]);

    const { data, setData, post, processing } = useForm({
        date: selectedDate,
        class_id: selectedClass,
        attendances: {} as Record<number, string>
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            case 'sick': return 'bg-blue-100 text-blue-800';
            case 'permission': return 'bg-purple-100 text-purple-800';
            case 'absent': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'late': return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'sick': return <AlertCircle className="w-4 h-4 text-blue-600" />;
            case 'permission': return <FileText className="w-4 h-4 text-purple-600" />;
            case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAttendanceChange = (studentId: number, status: string) => {
        setData('attendances', {
            ...data.attendances,
            [studentId]: status
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/monitoring/attendance/store', {
            onSuccess: () => {
                // Handle success
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Attendance Recording System - BQ Islamic Boarding School" />

            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Attendance Recording System</h1>
                            <p className="text-gray-600 mt-1">Pencatatan kehadiran harian real-time</p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex gap-3">
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export Laporan
                            </Button>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Rekam Kehadiran
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Siswa</p>
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
                                <p className="text-sm font-medium text-green-600">Hadir Hari Ini</p>
                                <p className="text-3xl font-bold text-green-900">{stats.present_today}</p>
                            </div>
                            <div className="p-3 bg-green-600 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600">Terlambat</p>
                                <p className="text-3xl font-bold text-yellow-900">{stats.late_today}</p>
                            </div>
                            <div className="p-3 bg-yellow-600 rounded-lg">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Tidak Hadir</p>
                                <p className="text-3xl font-bold text-red-900">{stats.absent_today}</p>
                            </div>
                            <div className="p-3 bg-red-600 rounded-lg">
                                <XCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Attendance Recording Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Pencatatan Kehadiran Harian</h3>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                                    <Input 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    >
                                        <option value="">Semua Kelas</option>
                                        {classes.map(cls => (
                                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cari Siswa</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Nama atau ID siswa"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Student List */}
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {filteredStudents.map((student) => {
                                        const todayAttendance = attendance_records.find(
                                            record => record.student_id === student.id && record.date === selectedDate
                                        );
                                        
                                        return (
                                            <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <Users className="w-6 h-6 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{student.name}</p>
                                                        <p className="text-sm text-gray-600">{student.student_id} • {student.class}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    {['present', 'late', 'sick', 'permission', 'absent'].map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => handleAttendanceChange(student.id, status)}
                                                            className={`p-2 rounded-lg border transition-colors ${
                                                                (data.attendances[student.id] || todayAttendance?.status) === status
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                            title={status}
                                                        >
                                                            {getStatusIcon(status)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Kehadiran'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Today's Summary */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Ringkasan Hari Ini</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Tingkat Kehadiran</span>
                                    <span className="font-semibold text-green-600">{stats.attendance_rate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-600 h-2 rounded-full" 
                                        style={{ width: `${stats.attendance_rate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Status Kehadiran</h3>
                            <div className="space-y-3">
                                {attendance_records.slice(0, 10).map((record) => (
                                    <div key={record.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm">{record.student.name}</p>
                                            <p className="text-xs text-gray-500">{record.student.class}</p>
                                        </div>
                                        <Badge className={getStatusColor(record.status)}>
                                            {record.status === 'present' ? 'Hadir' :
                                             record.status === 'late' ? 'Terlambat' :
                                             record.status === 'sick' ? 'Sakit' :
                                             record.status === 'permission' ? 'Izin' : 'Tidak Hadir'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Laporan Cepat</h3>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Laporan Harian
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Laporan Mingguan
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Tracking Keterlambatan
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}