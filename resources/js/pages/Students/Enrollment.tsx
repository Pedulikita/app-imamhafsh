import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Student, StudentClass, StudentEnrollment } from '@/types/student';
import { formatStudentStatus } from '@/utils/student-utils';
import { 
    Users, 
    UserPlus, 
    Search, 
    ArrowRight,
    CheckCircle,
    XCircle,
    Clock,
    GraduationCap,
    Settings
} from 'lucide-react';

interface StudentEnrollmentProps {
    enrollments: StudentEnrollment[];
    students: Student[];
    classes: StudentClass[];
    stats: {
        total_enrollments: number;
        active_enrollments: number;
        completed_enrollments: number;
        dropped_enrollments: number;
    };
}

export default function StudentEnrollmentPage({ enrollments, students, classes, stats }: StudentEnrollmentProps) {
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    
    // Filter enrollments based on current filters
    const filteredEnrollments = enrollments.filter(enrollment => {
        const matchesSearch = search === '' || 
            enrollment.student.name.toLowerCase().includes(search.toLowerCase()) ||
            enrollment.student.student_id.toLowerCase().includes(search.toLowerCase()) ||
            enrollment.class.name.toLowerCase().includes(search.toLowerCase());
        
        const matchesClass = classFilter === 'all' || enrollment.class_id.toString() === classFilter;
        const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
        
        return matchesSearch && matchesClass && matchesStatus;
    });

    const handleEnrollStudent = () => {
        if (!selectedStudent || !selectedClass) {
            alert('Please select both student and class');
            return;
        }
        
        router.post(route('students.enroll'), {
            student_id: selectedStudent,
            class_id: selectedClass,
            enrollment_date: new Date().toISOString().split('T')[0]
        }, {
            onSuccess: () => {
                setShowEnrollForm(false);
                setSelectedStudent(null);
                setSelectedClass(null);
            }
        });
    };

    const updateEnrollmentStatus = (enrollmentId: number, status: 'enrolled' | 'completed' | 'dropped') => {
        if (confirm(`Are you sure you want to change the enrollment status to ${status}?`)) {
            router.patch(route('students.enrollment.update-status', enrollmentId), {
                status
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'enrolled':
                return { variant: 'default' as const, className: 'bg-blue-100 text-blue-800', text: 'Enrolled' };
            case 'completed':
                return { variant: 'default' as const, className: 'bg-green-100 text-green-800', text: 'Completed' };
            case 'dropped':
                return { variant: 'default' as const, className: 'bg-red-100 text-red-800', text: 'Dropped' };
            default:
                return { variant: 'outline' as const, text: status };
        }
    };

    // Get unenrolled students for the form
    const unenrolledStudents = students.filter(student => 
        !enrollments.some(e => e.student_id === student.id && e.status === 'enrolled')
    );

    return (
        <AppLayout breadcrumbs={[
            { title: 'Students', href: route('students.index') },
            { title: 'Enrollment', href: route('students.enrollment.index') },
        ]}>
            <Head title="Student Enrollment - BQ Islamic Boarding School" />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Pendaftaran Siswa</h1>
                            <p className="text-gray-600">Kelola pendaftaran siswa ke kelas</p>
                        </div>
                        <div className="mt-4 lg:mt-0">
                            <Button onClick={() => setShowEnrollForm(true)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Daftarkan Siswa
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Pendaftaran</p>
                                <p className="text-3xl font-bold">{stats.total_enrollments}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pendaftaran Aktif</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.active_enrollments}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Selesai</p>
                                <p className="text-3xl font-bold text-green-600">{stats.completed_enrollments}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Dibatalkan</p>
                                <p className="text-3xl font-bold text-red-600">{stats.dropped_enrollments}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Enrollment Form Modal */}
                {showEnrollForm && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-md p-6">
                            <h3 className="text-lg font-medium mb-4">Daftarkan Siswa ke Kelas</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Siswa</label>
                                    <select
                                        value={selectedStudent || ''}
                                        onChange={(e) => setSelectedStudent(e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Choose a student...</option>
                                        {unenrolledStudents.map(student => (
                                            <option key={student.id} value={student.id}>
                                                {student.name} ({student.student_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                                    <select
                                        value={selectedClass || ''}
                                        onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Choose a class...</option>
                                        {classes.filter(cls => cls.current_students < cls.capacity).map(cls => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name} ({cls.grade}) - {cls.current_students}/{cls.capacity} students
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 mt-6">
                                <Button variant="outline" onClick={() => setShowEnrollForm(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleEnrollStudent}>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Enroll Student
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Filters */}
                <Card className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by student name, ID, or class..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Classes</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id.toString()}>
                                        {cls.name} ({cls.grade})
                                    </option>
                                ))}
                            </select>
                            
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="enrolled">Enrolled</option>
                                <option value="completed">Completed</option>
                                <option value="dropped">Dropped</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Enrollments Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Enrollment Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredEnrollments.map((enrollment) => {
                                    const statusBadge = getStatusBadge(enrollment.status);
                                    
                                    return (
                                        <tr key={enrollment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {enrollment.student.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {enrollment.student.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {enrollment.student.student_id} • {enrollment.student.gender}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{enrollment.class.name}</div>
                                                <div className="text-sm text-gray-500">{enrollment.class.grade}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(enrollment.enrollment_date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge className={statusBadge.className}>
                                                    {statusBadge.text}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    {enrollment.status === 'enrolled' && (
                                                        <>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={() => updateEnrollmentStatus(enrollment.id, 'completed')}
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={() => updateEnrollmentStatus(enrollment.id, 'dropped')}
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    
                                                    {enrollment.status !== 'enrolled' && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => updateEnrollmentStatus(enrollment.id, 'enrolled')}
                                                        >
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {filteredEnrollments.length === 0 && (
                        <div className="text-center py-12">
                            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
                            <Button onClick={() => setShowEnrollForm(true)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Enroll First Student
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}