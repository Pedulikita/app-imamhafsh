import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { 
    CreditCard, 
    Plus, 
    Eye, 
    DollarSign,
    AlertTriangle,
    TrendingUp,
    Search,
    Filter,
    FileText,
    Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface Student {
    id: number;
    name: string;
    email: string;
    grade: {
        id: number;
        name: string;
    };
}

interface FeeType {
    id: number;
    name: string;
    amount: string;
    frequency: string;
}

interface PaymentInstallment {
    id: number;
    installment_number: number;
    amount: string;
    due_date: string;
    paid_date: string | null;
    status: 'pending' | 'paid' | 'overdue';
}

interface StudentPayment {
    id: number;
    payment_code: string;
    total_amount: string;
    paid_amount: string;
    remaining_amount: string;
    status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
    due_date: string;
    paid_date: string | null;
    academic_year: string;
    student: Student;
    fee_type: FeeType;
    installments: PaymentInstallment[];
    payment_progress: number;
}

interface Grade {
    id: number;
    name: string;
}

interface Props {
    payments: {
        data: StudentPayment[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    stats: {
        total_payments: number;
        pending_payments: number;
        overdue_payments: number;
        total_amount_pending: string;
    };
    feeTypes: FeeType[];
    grades: Grade[];
    filters: {
        status?: string;
        fee_type?: string;
        grade?: string;
        search?: string;
    };
}

export default function PaymentIndex({ payments, stats, feeTypes, grades, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [feeTypeFilter, setFeeTypeFilter] = useState(filters.fee_type || 'all');
    const [gradeFilter, setGradeFilter] = useState(filters.grade || 'all');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (feeTypeFilter !== 'all') params.append('fee_type', feeTypeFilter);
        if (gradeFilter !== 'all') params.append('grade', gradeFilter);
        
        router.get('/teacher/payments', Object.fromEntries(params));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setFeeTypeFilter('all');
        setGradeFilter('all');
        router.get('/teacher/payments');
    };

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'paid':
                return 'default';
            case 'partial':
                return 'secondary';
            case 'overdue':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'text-green-600';
            case 'partial':
                return 'text-blue-600';
            case 'overdue':
                return 'text-red-600';
            case 'pending':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <AppLayout>
            <Head title="Payment Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                            <p className="text-gray-600">Manage student fee payments and track collection</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => router.get('/teacher/payments/reports')}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Reports
                        </Button>
                        <Button onClick={() => router.get('/teacher/payments/generate')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Generate Payments
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Payments</p>
                                    <p className="text-2xl font-bold">{stats.total_payments}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Payments</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending_payments}</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Overdue Payments</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.overdue_payments}</p>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Amount</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        Rp {Number(stats.total_amount_pending).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1 min-w-[250px]">
                                <Input
                                    placeholder="Search by student name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="partial">Partial</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={feeTypeFilter} onValueChange={setFeeTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Fee Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {feeTypes.map((feeType) => (
                                        <SelectItem key={feeType.id} value={feeType.id.toString()}>
                                            {feeType.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={gradeFilter} onValueChange={setGradeFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Grades</SelectItem>
                                    {grades.map((grade) => (
                                        <SelectItem key={grade.id} value={grade.id.toString()}>
                                            {grade.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button onClick={handleSearch}>
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>

                            <Button variant="outline" onClick={clearFilters}>
                                <Filter className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment Code</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Fee Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.data.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">
                                            {payment.payment_code}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{payment.student.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {payment.student.grade.name} • {payment.academic_year}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{payment.fee_type.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {payment.fee_type.frequency}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    Rp {Number(payment.total_amount).toLocaleString('id-ID')}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Paid: Rp {Number(payment.paid_amount).toLocaleString('id-ID')}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${payment.payment_progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-500 mt-1">
                                                {payment.payment_progress}%
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className={getStatusColor(payment.status)}>
                                                {format(new Date(payment.due_date), 'dd MMM yyyy', { locale: idLocale })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(payment.status)}>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get(`/teacher/payments/${payment.id}`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {payments.links.length > 3 && (
                            <div className="flex items-center justify-center space-x-2 mt-6">
                                {payments.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}