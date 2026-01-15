import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// Route helper function
const route = (name: string, params?: any) => {
    const routes = {
        'monitoring.student-management.index': '/monitoring/student-management',
        'monitoring.student-management.create': '/monitoring/student-management/create',
        'monitoring.student-management.show': (id: number) => `/monitoring/student-management/${id}`,
        'monitoring.student-management.edit': (id: number) => `/monitoring/student-management/${id}/edit`,
        'monitoring.student-management.destroy': (id: number) => `/monitoring/student-management/${id}`,
        'monitoring.student-management.update': (id: number) => `/monitoring/student-management/${id}`,
    };
    
    const routeFn = routes[name as keyof typeof routes];
    if (typeof routeFn === 'function') {
        return routeFn(params);
    }
    return routeFn || name;
};

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Student, StudentClass } from '@/types/student';
import { validateStudentData } from '@/utils/student-utils';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Users, Calendar, AlertCircle } from 'lucide-react';

interface StudentEditProps {
    student: Student;
    classes: StudentClass[];
}

export default function StudentEdit({ student, classes }: StudentEditProps) {
    const [activeTab, setActiveTab] = useState('personal');
    
    const { data, setData, patch, processing, errors } = useForm({
        name: student.name,
        email: student.email || '',
        phone: student.phone || '',
        student_id: student.student_id,
        nis: student.nis || '',
        nisn: student.nisn || '',
        gender: student.gender,
        birth_date: student.birth_date || '',
        birth_place: student.birth_place || '',
        address: student.address || '',
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        parent_email: student.parent_email || '',
        emergency_contact: student.emergency_contact || '',
        emergency_phone: student.emergency_phone || '',
        class_id: student.class_id,
        academic_year: student.academic_year,
        enrollment_date: student.enrollment_date || '',
        status: student.status,
        religion: student.religion || '',
        blood_type: student.blood_type || '',
        medical_notes: student.medical_notes || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validation = validateStudentData(data);
        if (!validation.isValid) {
            alert('Please fix the following errors:\n' + validation.errors.join('\n'));
            return;
        }
        
        patch(route('monitoring.student-management.update', student.id));
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'contact', label: 'Contact Info', icon: Phone },
        { id: 'academic', label: 'Academic Info', icon: Users },
        { id: 'emergency', label: 'Emergency Info', icon: AlertCircle },
        { id: 'health', label: 'Health Info', icon: Calendar }
    ];

    const renderPersonalInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <Input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    placeholder="Enter student's full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student ID *</label>
                <Input
                    value={data.student_id}
                    onChange={(e) => setData('student_id', e.target.value)}
                    error={errors.student_id}
                    placeholder="Student ID"
                />
                {errors.student_id && <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIS</label>
                <Input
                    value={data.nis}
                    onChange={(e) => setData('nis', e.target.value)}
                    placeholder="Nomor Induk Siswa"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NISN</label>
                <Input
                    value={data.nisn}
                    onChange={(e) => setData('nisn', e.target.value)}
                    placeholder="Nomor Induk Siswa Nasional"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                    value={data.gender}
                    onChange={(e) => setData('gender', e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                <Input
                    type="date"
                    value={data.birth_date}
                    onChange={(e) => setData('birth_date', e.target.value)}
                />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place</label>
                <Input
                    value={data.birth_place}
                    onChange={(e) => setData('birth_place', e.target.value)}
                    placeholder="City/Place of birth"
                />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <Textarea
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Full address"
                    rows={3}
                />
            </div>
        </div>
    );

    const renderContactInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="student@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="081234567890"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
                <Input
                    value={data.parent_name}
                    onChange={(e) => setData('parent_name', e.target.value)}
                    placeholder="Parent/Guardian name"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Phone</label>
                <Input
                    value={data.parent_phone}
                    onChange={(e) => setData('parent_phone', e.target.value)}
                    placeholder="Parent phone number"
                />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
                <Input
                    type="email"
                    value={data.parent_email}
                    onChange={(e) => setData('parent_email', e.target.value)}
                    placeholder="parent@email.com"
                />
            </div>
        </div>
    );

    const renderAcademicInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                    value={data.class_id || ''}
                    onChange={(e) => setData('class_id', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                            {cls.name} ({cls.grade}) - {cls.current_students}/{cls.capacity} students
                        </option>
                    ))}
                </select>
                {errors.class_id && <p className="text-red-500 text-sm mt-1">{errors.class_id}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
                <Input
                    type="number"
                    value={data.academic_year}
                    onChange={(e) => setData('academic_year', parseInt(e.target.value))}
                    error={errors.academic_year}
                    placeholder="2024"
                />
                {errors.academic_year && <p className="text-red-500 text-sm mt-1">{errors.academic_year}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Date</label>
                <Input
                    type="date"
                    value={data.enrollment_date}
                    onChange={(e) => setData('enrollment_date', e.target.value)}
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as 'active' | 'inactive' | 'graduated' | 'transferred')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="transferred">Transferred</option>
                </select>
            </div>
        </div>
    );

    const renderEmergencyInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                <Input
                    value={data.emergency_contact}
                    onChange={(e) => setData('emergency_contact', e.target.value)}
                    placeholder="Emergency contact person"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                <Input
                    value={data.emergency_phone}
                    onChange={(e) => setData('emergency_phone', e.target.value)}
                    placeholder="Emergency phone number"
                />
            </div>
        </div>
    );

    const renderHealthInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <select
                    value={data.religion}
                    onChange={(e) => setData('religion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Religion</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                <select
                    value={data.blood_type}
                    onChange={(e) => setData('blood_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Blood Type</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                </select>
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
                <Textarea
                    value={data.medical_notes}
                    onChange={(e) => setData('medical_notes', e.target.value)}
                    placeholder="Any medical conditions, allergies, or special notes"
                    rows={4}
                />
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return renderPersonalInfo();
            case 'contact':
                return renderContactInfo();
            case 'academic':
                return renderAcademicInfo();
            case 'emergency':
                return renderEmergencyInfo();
            case 'health':
                return renderHealthInfo();
            default:
                return renderPersonalInfo();
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Students', href: route('monitoring.student-management.index') },
            { title: student.name, href: route('monitoring.student-management.show', student.id) },
            { title: 'Edit', href: route('monitoring.student-management.edit', student.id) },
        ]}>
            <Head title={`Edit ${student.name} - Student Profile`} />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('monitoring.student-management.show', student.id)}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Profile
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Student Profile</h1>
                        <p className="text-gray-600 mt-1">Update {student.name}'s information</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Tab Navigation */}
                        <Card className="mb-6">
                            <div className="border-b">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                                                    activeTab === tab.id
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4 mr-2" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            
                            {/* Tab Content */}
                            <div className="p-6">
                                {renderTabContent()}
                            </div>
                        </Card>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('monitoring.student-management.show', student.id)}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}