import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// Route helper function
const route = (name: string, params?: any) => {
    const routes = {
        'monitoring.student-management.index': '/monitoring/student-management',
        'monitoring.student-management.create': '/monitoring/student-management/create',
        'monitoring.student-management.show': (id: number) => `/monitoring/student-management/${id}`,
        'monitoring.student-management.edit': (id: number) => `/monitoring/student-management/${id}/edit`,
        'monitoring.student-management.destroy': (id: number) => `/monitoring/student-management/${id}`,
    };
    
    const routeFn = routes[name as keyof typeof routes];
    if (typeof routeFn === 'function') {
        return routeFn(params);
    }
    return routeFn || name;
};

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Student, StudentEnrollment } from '@/types/student';
import { formatStudentStatus, formatPerformanceStatus, calculateAge } from '@/utils/student-utils';
import { 
    ArrowLeft, 
    Edit, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    User, 
    Users, 
    GraduationCap, 
    FileText,
    Heart,
    AlertTriangle,
    Download,
    Printer
} from 'lucide-react';

interface StudentShowProps {
    student: Student & {
        enrollments: StudentEnrollment[];
        grades?: Array<{
            id: number;
            subject: string;
            grade: number;
            date: string;
        }>;
        attendance?: Array<{
            id: number;
            date: string;
            status: 'present' | 'absent' | 'late';
        }>;
    };
}

export default function StudentShow({ student }: StudentShowProps) {
    const statusBadge = formatStudentStatus(student.status);
    const performanceBadge = student.performance_status ? 
        formatPerformanceStatus(student.performance_status) : null;
    
    const age = student.birth_date ? calculateAge(student.birth_date) : null;
    const currentEnrollment = student.enrollments?.find(e => e.status === 'enrolled');

    const handlePrintProfile = () => {
        window.print();
    };

    const exportStudentData = () => {
        // Implementation for exporting single student data
        const studentData = {
            ...student,
            age,
            current_class: currentEnrollment?.class.name
        };
        
        const jsonData = JSON.stringify(studentData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `student-${student.student_id}-profile.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Students', href: route('monitoring.student-management.index') },
            { title: student.name, href: route('monitoring.student-management.show', student.id) },
        ]}>
            <Head title={`${student.name} - Student Profile`} />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('monitoring.student-management.index')}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali ke Daftar Siswa
                                </Link>
                            </Button>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex items-start gap-6">
                                {/* Profile Picture */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                        {student.photo ? (
                                            <img 
                                                src={student.photo} 
                                                alt={student.name}
                                                className="w-24 h-24 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold text-blue-600">
                                                {student.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Basic Info */}
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">{student.name}</h1>
                                    <div className="space-y-1 text-gray-600">
                                        <p><strong>ID Siswa:</strong> {student.student_id}</p>
                                        {student.nis && <p><strong>NIS:</strong> {student.nis}</p>}
                                        {student.nisn && <p><strong>NISN:</strong> {student.nisn}</p>}
                                        <p><strong>Jenis Kelamin:</strong> {student.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                                        {age && <p><strong>Usia:</strong> {age} tahun</p>}
                                    </div>
                                    
                                    <div className="flex gap-2 mt-4">
                                        <Badge className={statusBadge.className}>
                                            {statusBadge.text}
                                        </Badge>
                                        {performanceBadge && (
                                            <Badge className={performanceBadge.className}>
                                                {performanceBadge.text}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <Button variant="outline" onClick={handlePrintProfile}>
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print Profile
                                </Button>
                                <Button variant="outline" onClick={exportStudentData}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Data
                                </Button>
                                <Button asChild>
                                    <Link href={route('monitoring.student-management.edit', student.id)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Personal Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <Card className="p-6">
                                <h3 className="text-lg font-medium  mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Informasi Pribadi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {student.birth_date && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Tanggal Lahir</label>
                                            <p className="text-gray-900">
                                                {new Date(student.birth_date).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}
                                    {student.birth_place && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Tempat Lahir</label>
                                            <p className="text-gray-900">{student.birth_place}</p>
                                        </div>
                                    )}
                                    {student.religion && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Agama</label>
                                            <p className="text-gray-900">{student.religion}</p>
                                        </div>
                                    )}
                                    {student.blood_type && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Golongan Darah</label>
                                            <p className="text-gray-900">{student.blood_type}</p>
                                        </div>
                                    )}
                                </div>
                                
                                {student.address && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-500">Alamat</label>
                                        <p className="text-gray-900 flex items-start">
                                            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                                            {student.address}
                                        </p>
                                    </div>
                                )}
                                
                                {student.medical_notes && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-500">Catatan Medis</label>
                                        <p className="text-gray-900 flex items-start">
                                            <Heart className="w-4 h-4 mr-2 mt-0.5 text-red-400" />
                                            {student.medical_notes}
                                        </p>
                                    </div>
                                )}
                            </Card>

                            {/* Contact Information */}
                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <Phone className="w-5 h-5 mr-2" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Kontak Siswa</h4>
                                        <div className="space-y-2">
                                            {student.email && (
                                                <p className="text-gray-600 flex items-center">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    {student.email}
                                                </p>
                                            )}
                                            {student.phone && (
                                                <p className="text-gray-600 flex items-center">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    {student.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Kontak Orang Tua/Wali</h4>
                                        <div className="space-y-2">
                                            {student.parent_name && (
                                                <p className="text-gray-600 flex items-center">
                                                    <User className="w-4 h-4 mr-2" />
                                                    {student.parent_name}
                                                </p>
                                            )}
                                            {student.parent_email && (
                                                <p className="text-gray-600 flex items-center">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    {student.parent_email}
                                                </p>
                                            )}
                                            {student.parent_phone && (
                                                <p className="text-gray-600 flex items-center">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    {student.parent_phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {(student.emergency_contact || student.emergency_phone) && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                            <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                                            Kontak Darurat
                                        </h4>
                                        <div className="space-y-2">
                                            {student.emergency_contact && (
                                                <p className="text-gray-600">{student.emergency_contact}</p>
                                            )}
                                            {student.emergency_phone && (
                                                <p className="text-gray-600 flex items-center">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    {student.emergency_phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Academic Performance */}
                            {(student.average_grade || student.attendance_rate || student.total_grades) && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <GraduationCap className="w-5 h-5 mr-2" />
                                        Kinerja Akademik
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {student.average_grade && (
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">{student.average_grade}</div>
                                                <p className="text-sm text-gray-500">Rata-rata Nilai</p>
                                            </div>
                                        )}
                                        {student.attendance_rate && (
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">{student.attendance_rate}%</div>
                                                <p className="text-sm text-gray-500">Persentase Kehadiran</p>
                                            </div>
                                        )}
                                        {student.total_grades && (
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">{student.total_grades}</div>
                                                <p className="text-sm text-gray-500">Total Nilai</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Academic Info */}
                        <div className="space-y-6">
                            {/* Current Class */}
                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    Informasi Akademik
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Tahun Akademik</label>
                                        <p className="text-gray-900">{student.academic_year}</p>
                                    </div>
                                    
                                    {currentEnrollment && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Kelas Saat Ini</label>
                                                <p className="text-gray-900">{currentEnrollment.class.name}</p>
                                                <p className="text-sm text-gray-500">{currentEnrollment.class.grade}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Tanggal Pendaftaran</label>
                                                <p className="text-gray-900">
                                                    {new Date(currentEnrollment.enrollment_date).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    
                                    {student.enrollment_date && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Pendaftaran Pertama</label>
                                            <p className="text-gray-900 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {new Date(student.enrollment_date).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Enrollment History */}
                            {student.enrollments && student.enrollments.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <FileText className="w-5 h-5 mr-2" />
                                        Riwayat Pendaftaran
                                    </h3>
                                    <div className="space-y-3">
                                        {student.enrollments.map((enrollment, index) => (
                                            <div key={enrollment.id} className="border-l-2 border-gray-200 pl-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {enrollment.class.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {enrollment.class.grade}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {new Date(enrollment.enrollment_date).toLocaleDateString('id-ID')}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusBadge(enrollment.status).className}>
                                                        {getStatusBadge(enrollment.status).text}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Quick Actions */}
                            <Card className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h3>
                                <div className="space-y-3">
                                    <Button className="w-full justify-start" variant="outline" disabled>
                                        <GraduationCap className="w-4 h-4 mr-2" />
                                        Lihat Nilai (Segera Hadir)
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline" disabled>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Lihat Kehadiran (Segera Hadir)
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline" disabled>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Generate Report (Segera Hadir)
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'enrolled':
            return { text: 'Enrolled', className: 'bg-blue-100 text-blue-800' };
        case 'completed':
            return { text: 'Completed', className: 'bg-green-100 text-green-800' };
        case 'dropped':
            return { text: 'Dropped', className: 'bg-red-100 text-red-800' };
        default:
            return { text: status, className: 'bg-gray-100 text-gray-800' };
    }
}