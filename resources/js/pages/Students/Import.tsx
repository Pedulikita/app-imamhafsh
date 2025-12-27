import React, { useState } from 'react';
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
        'monitoring.student-management.import': '/monitoring/student-management/import',
        'monitoring.student-management.bulk-import': '/monitoring/student-management/bulk-import',
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
import { StudentImportData, StudentClass } from '@/types/student';
import { parseStudentCSV, validateStudentData } from '@/utils/student-utils';
import { 
    ArrowLeft, 
    Upload, 
    Download, 
    FileText, 
    CheckCircle, 
    AlertTriangle, 
    X,
    Users,
    Eye
} from 'lucide-react';

interface StudentImportProps {
    classes: StudentClass[];
}

interface ValidationResult {
    valid: StudentImportData[];
    invalid: Array<{ data: StudentImportData; errors: string[]; row: number }>;
}

export default function StudentImport({ classes }: StudentImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<string>('');
    const [parsedData, setParsedData] = useState<StudentImportData[]>([]);
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'upload' | 'preview' | 'validate' | 'import'>('upload');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvText = event.target?.result as string;
                setCsvData(csvText);
                const parsed = parseStudentCSV(csvText);
                setParsedData(parsed);
                setStep('preview');
            };
            reader.readAsText(selectedFile);
        } else {
            alert('Please select a valid CSV file.');
        }
    };

    const validateData = () => {
        setIsProcessing(true);
        const valid: StudentImportData[] = [];
        const invalid: Array<{ data: StudentImportData; errors: string[]; row: number }> = [];

        parsedData.forEach((student, index) => {
            const validation = validateStudentData(student);
            if (validation.isValid) {
                valid.push(student);
            } else {
                invalid.push({
                    data: student,
                    errors: validation.errors,
                    row: index + 2 // +2 because CSV has header row and is 1-indexed
                });
            }
        });

        setValidationResult({ valid, invalid });
        setStep('validate');
        setIsProcessing(false);
    };

    const handleImport = () => {
        if (!validationResult?.valid.length) return;
        
        setIsProcessing(true);
        router.post(route('monitoring.student-management.bulk-import'), {
            students: validationResult.valid
        }, {
            onSuccess: () => {
                setStep('import');
                setIsProcessing(false);
            },
            onError: () => {
                setIsProcessing(false);
                alert('An error occurred during import. Please try again.');
            }
        });
    };

    const downloadTemplate = () => {
        const template = [
            'name,student_id,email,phone,nis,nisn,gender,birth_date,birth_place,address,parent_name,parent_phone,parent_email,class_name,academic_year',
            'John Doe,240001,john@example.com,081234567890,123456,1234567890,male,2008-01-15,Jakarta,Jl. Example No. 123,Jane Doe,081234567891,jane@example.com,7A,2024',
            'Jane Smith,240002,jane.smith@example.com,081234567892,123457,1234567891,female,2008-03-22,Bandung,Jl. Sample No. 456,John Smith,081234567893,john.smith@example.com,7B,2024'
        ].join('\n');
        
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'student-import-template.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const resetImport = () => {
        setFile(null);
        setCsvData('');
        setParsedData([]);
        setValidationResult(null);
        setStep('upload');
    };

    const renderUploadStep = () => (
        <Card className="p-8">
            <div className="text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Impor Data Siswa dari CSV</h3>
                <p className="text-gray-600 mb-6">Unggah file CSV dengan data siswa untuk mengimpor beberapa siswa sekaligus.</p>
                
                <div className="mb-6">
                    <Button variant="outline" onClick={downloadTemplate}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                    </Button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label
                        htmlFor="csv-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Klik untuk memilih file CSV</span>
                    </label>
                </div>
                
                {file && (
                    <div className="text-sm text-green-600 mb-4">
                        Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </div>
                )}
            </div>
        </Card>
    );

    const renderPreviewStep = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium mb-4">Pratinjau Data</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={resetImport}>
                            <X className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                        <Button onClick={validateData} disabled={isProcessing}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isProcessing ? 'Validating...' : 'Validate Data'}
                        </Button>
                    </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                    Found {parsedData.length} student records
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {parsedData.slice(0, 10).map((student, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.email || '-'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.gender}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{student.class_name || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {parsedData.length > 10 && (
                    <div className="text-sm text-gray-500 mt-4">
                        Showing first 10 of {parsedData.length} records
                    </div>
                )}
            </Card>
        </div>
    );

    const renderValidateStep = () => {
        if (!validationResult) return null;
        
        return (
            <div className="space-y-6">
                {/* Validation Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border-green-200 bg-green-50">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-lg font-semibold text-green-900">{validationResult.valid.length}</p>
                                <p className="text-sm text-green-700">Data Valid</p>
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-6 border-red-200 bg-red-50">
                        <div className="flex items-center">
                            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                            <div>
                                <p className="text-lg font-semibold text-red-900">{validationResult.invalid.length}</p>
                                <p className="text-sm text-red-700">Data Tidak Valid</p>
                            </div>
                        </div>
                    </Card>
                </div>
                
                {/* Invalid Records */}
                {validationResult.invalid.length > 0 && (
                    <Card className="p-6">
                        <h3 className="text-lg font-medium mb-4">Data Tidak Valid</h3>
                        <div className="space-y-4">
                            {validationResult.invalid.map((item, index) => (
                                <div key={index} className="border-l-4 border-red-400 bg-red-50 p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-red-900">Row {item.row}: {item.data.name || 'Unknown'}</p>
                                            <ul className="text-sm text-red-700 mt-1">
                                                {item.errors.map((error, errorIndex) => (
                                                    <li key={errorIndex}>• {error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-between">
                    <Button variant="outline" onClick={resetImport}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Mulai Ulang
                    </Button>
                    
                    <div className="flex gap-4">
                        {validationResult.invalid.length > 0 && (
                            <Button variant="outline" onClick={() => setStep('preview')}>
                                Perbaiki Kesalahan
                            </Button>
                        )}
                        
                        {validationResult.valid.length > 0 && (
                            <Button onClick={handleImport} disabled={isProcessing}>
                                <Users className="w-4 h-4 mr-2" />
                                {isProcessing ? 'Importing...' : `Import ${validationResult.valid.length} Students`}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderImportStep = () => (
        <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Impor Berhasil!</h3>
            <p className="text-gray-600 mb-6">
                {validationResult?.valid.length} siswa telah berhasil diimpor.
            </p>
            
            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={resetImport}>
                    Impor Siswa Lagi
                </Button>
                <Button asChild>
                    <Link href={route('monitoring.student-management.index')}>
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Siswa
                    </Link>
                </Button>
            </div>
        </Card>
    );

    const renderStepContent = () => {
        switch (step) {
            case 'upload':
                return renderUploadStep();
            case 'preview':
                return renderPreviewStep();
            case 'validate':
                return renderValidateStep();
            case 'import':
                return renderImportStep();
            default:
                return renderUploadStep();
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Students', href: route('monitoring.student-management.index') },
            { title: 'Import Students', href: route('monitoring.student-management.import') },
        ]}>
            <Head title="Import Students - BQ Islamic Boarding School" />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={route('monitoring.student-management.index')}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Students
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-2xl font-bold ">Impor Siswa</h1>
                        <p className="text-gray-600 mt-1">Impor data siswa secara massal dari file CSV</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {[
                                { key: 'upload', label: 'Upload File', icon: Upload },
                                { key: 'preview', label: 'Preview Data', icon: Eye },
                                { key: 'validate', label: 'Validate', icon: CheckCircle },
                                { key: 'import', label: 'Import', icon: Users }
                            ].map((stepItem, index) => {
                                const Icon = stepItem.icon;
                                const isActive = step === stepItem.key;
                                const isCompleted = ['upload', 'preview', 'validate', 'import'].indexOf(step) > index;
                                
                                return (
                                    <div key={stepItem.key} className="flex items-center">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            isActive 
                                                ? 'bg-blue-600 text-white'
                                                : isCompleted
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-200 text-gray-400'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`ml-2 text-sm font-medium ${
                                            isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                                        }`}>
                                            {stepItem.label}
                                        </span>
                                        {index < 3 && (
                                            <div className={`flex-1 h-0.5 mx-4 ${
                                                isCompleted ? 'bg-green-600' : 'bg-gray-200'
                                            }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step Content */}
                    {renderStepContent()}
                </div>
            </div>
        </AppLayout>
    );
}