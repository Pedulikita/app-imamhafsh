import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// Route helper function
const route = (name: string, params?: any) => {
    const routes = {
        'monitoring.student-management.index': '/monitoring/student-management',
        'monitoring.student-management.create': '/monitoring/student-management/create',
        'monitoring.student-management.show': (id: number) => `/monitoring/student-management/${id}`,
        'monitoring.student-management.edit': (id: number) => `/monitoring/student-management/${id}/edit`,
        'monitoring.student-management.destroy': (id: number) => `/monitoring/student-management/${id}`,
        'monitoring.student-management.bulk-delete': '/monitoring/student-management/bulk-delete',
        'monitoring.student-management.import': '/monitoring/student-management/import',
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
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Student, StudentClass, StudentFilters, StudentStats } from '@/types/student';
import { formatStudentStatus, formatPerformanceStatus, exportStudentsToCSV, downloadCSV } from '@/utils/student-utils';
import { 
    Users, 
    UserPlus, 
    Search, 
    Filter,
    Download,
    Upload,
    Eye,
    Edit,
    Trash2,
    GraduationCap,
    FileText,
    Settings,
    TrendingUp,
    Lock,
    AlertCircle
} from 'lucide-react';

interface StudentsIndexProps {
    students: {
        data: Student[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    classes: StudentClass[];
    stats: StudentStats;
    filters: StudentFilters;
    permissions?: {
        canManage: boolean;
        canView: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canCreate: boolean;
    };
}

export default function StudentsIndex({ students, classes, stats, filters, permissions }: StudentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [classFilter, setClassFilter] = useState(filters.class_id?.toString() || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [genderFilter, setGenderFilter] = useState(filters.gender || 'all');
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    // Filter students based on current filters
    const filteredStudents = useMemo(() => {
        return students.data.filter(student => {
            const matchesSearch = search === '' || 
                student.name.toLowerCase().includes(search.toLowerCase()) ||
                student.student_id.toLowerCase().includes(search.toLowerCase()) ||
                (student.email && student.email.toLowerCase().includes(search.toLowerCase()));
            
            const matchesClass = classFilter === 'all' || student.class_id?.toString() === classFilter;
            const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
            const matchesGender = genderFilter === 'all' || student.gender === genderFilter;
            
            return matchesSearch && matchesClass && matchesStatus && matchesGender;
        });
    }, [students.data, search, classFilter, statusFilter, genderFilter]);

    const handleSearch = () => {
        router.get(route('monitoring.student-management.index'), {
            search,
            class_id: classFilter !== 'all' ? classFilter : undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            gender: genderFilter !== 'all' ? genderFilter : undefined,
        }, { preserveState: true });
    };

    const handleExportCSV = () => {
        const csvContent = exportStudentsToCSV(filteredStudents);
        const filename = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(csvContent, filename);
    };

    const showAdminOnlyMessage = () => {
        alert("Only administrators can perform this action.\n\n🔒 Admin-only actions:\n• Create new students\n• Edit student information\n• Delete students\n• Bulk operations\n• Import/Export functionality");
    };

    const toggleStudentSelection = (studentId: number) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const selectAllStudents = () => {
        setSelectedStudents(
            selectedStudents.length === filteredStudents.length 
                ? []
                : filteredStudents.map(s => s.id)
        );
    };

    const handleBulkAction = (action: string) => {
        if (selectedStudents.length === 0) return;
        
        if (action === 'delete') {
            if (confirm(`Are you sure you want to delete ${selectedStudents.length} students?`)) {
                router.delete(route('monitoring.student-management.bulk-delete'), {
                    data: { student_ids: selectedStudents },
                    onSuccess: () => setSelectedStudents([])
                });
            }
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Students', href: route('monitoring.student-management.index') },
        ]}>
            <Head title="Student Management - BQ Islamic Boarding School" />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Teacher Permission Alert */}
                {permissions && !permissions.canCreate && (
                    <Alert className="mb-6 bg-orange-50 border-orange-200">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                            <strong>Akses Hanya untuk Melihat:</strong> Anda dapat melihat informasi siswa tetapi tidak dapat mengubah data.
                            <div className="mt-2 text-sm">
                                🔒 <strong>Fungsi Khusus Admin:</strong> Membuat, mengedit, menghapus siswa • Operasi massal • Impor/Ekspor
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Manajemen Siswa</h1>
                            <p className="text-gray-600">Kelola data siswa, pendaftaran, dan profil</p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
                            {permissions?.canManage ? (
                                <Button variant="outline" asChild>
                                    <Link href={route('monitoring.student-management.import')}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Impor Siswa
                                    </Link>
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    onClick={showAdminOnlyMessage}
                                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Impor (Admin Only)
                                </Button>
                            )}
                            <Button variant="outline" onClick={handleExportCSV}>
                                <Download className="w-4 h-4 mr-2" />
                                Ekspor CSV
                            </Button>
                            {permissions?.canCreate ? (
                                <Button asChild>
                                    <Link href={route('monitoring.student-management.create')}>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Tambah Siswa
                                    </Link>
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    onClick={showAdminOnlyMessage}
                                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Tambah Siswa (Hanya Admin)
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Students</p>
                                <p className="text-3xl font-bold ">{stats.total_students}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Siswa Aktif</p>
                                <p className="text-3xl font-bold text-green-600">{stats.active_students}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Siswa Laki-laki</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.by_gender.male}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Siswa Perempuan</p>
                                <p className="text-3xl font-bold text-pink-600">{stats.by_gender.female}</p>
                            </div>
                            <div className="p-3 bg-pink-100 rounded-lg">
                                <Users className="w-6 h-6 text-pink-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search students by name, ID, or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="graduated">Graduated</option>
                                <option value="transferred">Transferred</option>
                            </select>
                            
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            
                            <Button onClick={handleSearch} size="sm">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Bulk Actions */}
                {selectedStudents.length > 0 && (
                    <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-800">
                                {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setSelectedStudents([])}>
                                    Clear Selection
                                </Button>
                                {permissions?.canDelete ? (
                                    <Button 
                                        size="sm" 
                                        variant="destructive"
                                        onClick={() => handleBulkAction('delete')}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Selected
                                    </Button>
                                ) : (
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={showAdminOnlyMessage}
                                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Delete (Admin Only)
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                )}

                {/* Students Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                            onChange={selectAllStudents}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Academic Year
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Performance
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map((student) => {
                                    const statusBadge = formatStudentStatus(student.status);
                                    const performanceBadge = student.performance_status ? 
                                        formatPerformanceStatus(student.performance_status) : null;
                                    
                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={() => toggleStudentSelection(student.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {student.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {student.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {student.student_id} • {student.gender}
                                                        </div>
                                                        {student.email && (
                                                            <div className="text-sm text-gray-500">
                                                                {student.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.class ? (
                                                    <div>
                                                        <div className="font-medium">{student.class.name}</div>
                                                        <div className="text-gray-500">{student.class.grade}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">No Class</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.academic_year}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge className={statusBadge.className}>
                                                    {statusBadge.text}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {performanceBadge ? (
                                                    <Badge className={performanceBadge.className}>
                                                        {performanceBadge.text}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={route('monitoring.student-management.show', student.id)}>
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:border-green-300"
                                                    asChild
                                                    title="Lihat Progress"
                                                >
                                                    <Link href={`/monitoring/students/${student.id}/progress`}>
                                                        <TrendingUp className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                    {permissions?.canEdit ? (
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={route('monitoring.student-management.edit', student.id)}>
                                                                <Edit className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={showAdminOnlyMessage}
                                                            className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                                            title="Admin Only"
                                                        >
                                                            <Lock className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {permissions?.canDelete ? (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this student?')) {
                                                                    router.delete(route('monitoring.student-management.destroy', student.id));
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={showAdminOnlyMessage}
                                                            className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                                            title="Admin Only"
                                                        >
                                                            <Lock className="w-4 h-4" />
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
                    
                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
                            <Button asChild>
                                <Link href={route('monitoring.student-management.create')}>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add First Student
                                </Link>
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Pagination Info */}
                {students.total > 0 && (
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                        <div>
                            Showing {((students.current_page - 1) * students.per_page) + 1} to {Math.min(students.current_page * students.per_page, students.total)} of {students.total} students
                        </div>
                        <div className="flex items-center space-x-2">
                            {students.current_page > 1 && (
                                <Link 
                                    href={`${window.location.pathname}?page=${students.current_page - 1}`}
                                    className="px-3 py-1 border rounded hover:bg-gray-50"
                                >
                                    Previous
                                </Link>
                            )}
                            <span className="px-3 py-1">
                                Page {students.current_page} of {students.last_page}
                            </span>
                            {students.current_page < students.last_page && (
                                <Link 
                                    href={`${window.location.pathname}?page=${students.current_page + 1}`}
                                    className="px-3 py-1 border rounded hover:bg-gray-50"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}