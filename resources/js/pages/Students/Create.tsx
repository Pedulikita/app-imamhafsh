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
        'monitoring.student-management.store': '/monitoring/student-management',
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
import { StudentClass, StudentFormData } from '@/types/student';
import { validateStudentData, generateStudentId } from '@/utils/student-utils';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Users, Calendar, AlertCircle } from 'lucide-react';

interface StudentCreateProps {
    classes: StudentClass[];
    nextStudentSequence: number;
    currentAcademicYear: number;
}

export default function StudentCreate({ classes, nextStudentSequence, currentAcademicYear }: StudentCreateProps) {
    const [activeTab, setActiveTab] = useState('personal');
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());
    
    const { data, setData, post, processing, errors, clearErrors } = useForm<StudentFormData>({
        name: '',
        email: '',
        phone: '',
        student_id: generateStudentId(currentAcademicYear, nextStudentSequence),
        nis: '',
        nisn: '',
        gender: 'male',
        birth_date: '',
        birth_place: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        emergency_contact: '',
        emergency_phone: '',
        class_id: undefined,
        academic_year: currentAcademicYear,
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'active',
        religion: '',
        blood_type: '',
        medical_notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validation = validateStudentData(data);
        if (!validation.isValid) {
            // Show validation errors in a better way
            const errorMessage = 'Please complete all required fields:\n\n' + validation.errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
            alert(errorMessage);
            
            // Find the first tab that contains errors and switch to it
            const requiredFields = ['name', 'student_id', 'gender', 'birth_date', 'birth_place', 'address'];
            const contactFields = ['parent_name', 'parent_phone'];
            
            if (requiredFields.some(field => validation.errors.some(error => error.toLowerCase().includes(field.replace('_', ' '))))) {
                setActiveTab('personal');
            } else if (contactFields.some(field => validation.errors.some(error => error.toLowerCase().includes(field.replace('_', ' '))))) {
                setActiveTab('contact');
            }
            
            return;
        }
        
        post(route('monitoring.student-management.store'), {
            onSuccess: () => {
                // Handle success
            }
        });
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'contact', label: 'Contact Info', icon: Phone },
        { id: 'academic', label: 'Academic Info', icon: Users },
        { id: 'emergency', label: 'Emergency Info', icon: AlertCircle },
        { id: 'health', label: 'Health Info', icon: Calendar }
    ];

    const validateCurrentTab = (): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];
        
        switch (activeTab) {
            case 'personal':
                if (!data.name?.trim()) errors.push('Full Name is required');
                if (!data.student_id?.trim()) errors.push('Student ID is required');
                if (!data.birth_date) errors.push('Birth Date is required');
                if (!data.birth_place?.trim()) errors.push('Birth Place is required');
                if (!data.address?.trim()) errors.push('Address is required');
                break;
            case 'contact':
                if (!data.parent_name?.trim()) errors.push('Parent Name is required');
                if (!data.parent_phone?.trim()) errors.push('Parent Phone is required');
                if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    errors.push('Valid email format required');
                }
                break;
            case 'academic':
                // Academic fields are mostly optional
                break;
            case 'emergency':
                // Emergency fields are optional
                break;
            case 'health':
                // Health fields are optional
                break;
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const handleContinue = () => {
        const validation = validateCurrentTab();
        if (!validation.isValid) {
            const errorMessage = 'Please complete the required fields:\n\n' + validation.errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
            alert(errorMessage);
            return;
        }
        
        // Mark current tab as completed
        setCompletedTabs(prev => new Set([...prev, activeTab]));
        
        // Move to next tab
        if (currentTabIndex < tabs.length - 1) {
            const nextIndex = currentTabIndex + 1;
            setCurrentTabIndex(nextIndex);
            setActiveTab(tabs[nextIndex].id);
        }
    };

    const handlePrevious = () => {
        if (currentTabIndex > 0) {
            const prevIndex = currentTabIndex - 1;
            setCurrentTabIndex(prevIndex);
            setActiveTab(tabs[prevIndex].id);
        }
    };

    const handleTabClick = (tabId: string, index: number) => {
        // Allow clicking on completed tabs or current tab
        if (completedTabs.has(tabId) || index <= currentTabIndex) {
            setActiveTab(tabId);
            setCurrentTabIndex(index);
        }
    };

    const isAllRequiredFieldsCompleted = (): boolean => {
        const validation = validateStudentData(data);
        return validation.isValid;
    };

    const renderPersonalInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                <Input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    placeholder="Masukkan nama lengkap siswa"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Siswa *</label>
                <Input
                    value={data.student_id}
                    onChange={(e) => setData('student_id', e.target.value)}
                    error={errors.student_id}
                    placeholder="ID otomatis atau kustom"
                />
                {errors.student_id && <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIS</label>
                <Input
                    value={data.nis || ''}
                    onChange={(e) => setData('nis', e.target.value)}
                    placeholder="Nomor Induk Siswa"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NISN</label>
                <Input
                    value={data.nisn || ''}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir *</label>
                <Input
                    type="date"
                    value={data.birth_date || ''}
                    onChange={(e) => setData('birth_date', e.target.value)}
                    error={errors.birth_date}
                    required
                />
                {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir *</label>
                <Input
                    value={data.birth_place || ''}
                    onChange={(e) => setData('birth_place', e.target.value)}
                    error={errors.birth_place}
                    placeholder="Kota/Tempat lahir"
                    required
                />
                {errors.birth_place && <p className="text-red-500 text-sm mt-1">{errors.birth_place}</p>}
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat *</label>
                <Textarea
                    value={data.address || ''}
                    onChange={(e) => setData('address', e.target.value)}
                    error={errors.address}
                    placeholder="Alamat lengkap siswa"
                    rows={3}
                    required
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
        </div>
    );

    const renderContactInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="student@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                <Input
                    value={data.phone || ''}
                    onChange={(e) => setData('phone', e.target.value)}
                    error={errors.phone}
                    placeholder="081234567890"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Orang Tua *</label>
                <Input
                    value={data.parent_name || ''}
                    onChange={(e) => setData('parent_name', e.target.value)}
                    error={errors.parent_name}
                    placeholder="Nama Orang Tua/Wali"
                    required
                />
                {errors.parent_name && <p className="text-red-500 text-sm mt-1">{errors.parent_name}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon Orang Tua *</label>
                <Input
                    value={data.parent_phone || ''}
                    onChange={(e) => setData('parent_phone', e.target.value)}
                    error={errors.parent_phone}
                    placeholder="Nomor telepon orang tua/wali"
                    required
                />
                {errors.parent_phone && <p className="text-red-500 text-sm mt-1">{errors.parent_phone}</p>}
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email</label>
                <Input
                    type="email"
                    value={data.parent_email || ''}
                    onChange={(e) => setData('parent_email', e.target.value)}
                    placeholder="parent@email.com"
                />
            </div>
        </div>
    );

    const renderAcademicInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Akademik *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pendaftaran</label>
                <Input
                    type="date"
                    value={data.enrollment_date || ''}
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
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="graduated">Lulus</option>
                    <option value="transferred">Pindah</option>
                </select>
            </div>
        </div>
    );

    const renderEmergencyInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kontak Darurat</label>
                <Input
                    value={data.emergency_contact || ''}
                    onChange={(e) => setData('emergency_contact', e.target.value)}
                    placeholder="Nama kontak darurat"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon Darurat</label>
                <Input
                    value={data.emergency_phone || ''}
                    onChange={(e) => setData('emergency_phone', e.target.value)}
                    placeholder="Nomor telepon darurat"
                />
            </div>
        </div>
    );

    const renderHealthInfo = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agama</label>
                <select
                    value={data.religion || ''}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Golongan Darah</label>
                <select
                    value={data.blood_type || ''}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Medis</label>
                <Textarea
                    value={data.medical_notes || ''}
                    onChange={(e) => setData('medical_notes', e.target.value)}
                    placeholder="Kondisi medis, alergi, atau catatan khusus"
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
            { title: 'Add Student', href: route('monitoring.student-management.create') },
        ]}>
            <Head title="Add New Student - Imam Hafs Islamic Boarding School" />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('monitoring.student-management.index')}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali ke Siswa
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-2xl font-bold">Tambah Siswa Baru</h1>
                        <p className="text-gray-600 mt-1">Isi informasi siswa di bawah ini</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Tab Navigation */}
                        <Card className="mb-6">
                            <div className="border-b">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    {tabs.map((tab, index) => {
                                        const Icon = tab.icon;
                                        const isCompleted = completedTabs.has(tab.id);
                                        const isCurrent = activeTab === tab.id;
                                        const isAccessible = index <= currentTabIndex || completedTabs.has(tab.id);
                                        
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => handleTabClick(tab.id, index)}
                                                disabled={!isAccessible}
                                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm relative ${
                                                    isCurrent
                                                        ? 'border-blue-500 text-blue-600'
                                                        : isAccessible
                                                        ? 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                                                        : 'border-transparent text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4 mr-2" />
                                                {tab.label}
                                                {isCompleted && (
                                                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                                                )}
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

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            <div className="flex gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('monitoring.student-management.index')}>Cancel</Link>
                                </Button>
                                {currentTabIndex > 0 && (
                                    <Button type="button" variant="outline" onClick={handlePrevious}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Button>
                                )}
                            </div>
                            
                            <div className="flex gap-4">
                                {currentTabIndex < tabs.length - 1 ? (
                                    <Button type="button" onClick={handleContinue}>
                                        Continue
                                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        disabled={processing || !isAllRequiredFieldsCompleted()}
                                        className={!isAllRequiredFieldsCompleted() ? 'opacity-50' : ''}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Saving...' : 'Save Student'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}