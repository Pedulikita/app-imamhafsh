import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    CreditCard, 
    Users, 
    DollarSign, 
    AlertTriangle,
    Search,
    Eye,
    Edit,
    Plus
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PaymentStats {
    total_students: number;
    total_revenue: number;
    pending_payments: number;
    overdue_payments: number;
}

interface Payment {
    id: number;
    total_amount: number;
    status: 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
    due_date: string;
    paid_date?: string;
    created_at: string;
    student: {
        id: number;
        name: string;
        nis?: string;
    };
    fee_type: {
        id: number;
        name: string;
        type: string;
    };
}

interface PaginatedPayments {
    data: Payment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    stats: PaymentStats;
    payments: PaginatedPayments;
}

export default function AdminPaymentsIndex({ stats, payments }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusBadge = (status: string) => {
        const variants = {
            'pending': 'warning',
            'paid': 'success', 
            'overdue': 'destructive',
            'partial': 'secondary',
            'cancelled': 'outline'
        };
        return (
            <Badge variant={variants[status as keyof typeof variants] as any}>
                {status.toUpperCase()}
            </Badge>
        );
    };

    const getStatusColor = (status: string) => {
        const colors = {
            'pending': 'text-yellow-600 bg-yellow-100',
            'paid': 'text-green-600 bg-green-100',
            'overdue': 'text-red-600 bg-red-100'
        };
        return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Payment Management
                    </h2>
                    <div className="flex space-x-2">
                        <Link href="/admin/payments/fee-types">
                            <Button variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Manage Fee Types
                            </Button>
                        </Link>
                        <Link href="/admin/payments/reports">
                            <Button variant="outline">
                                Reports
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Payment Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Students
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_students}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Revenue
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(stats.total_revenue)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Payments
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{stats.pending_payments}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Overdue Payments
                                </CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats.overdue_payments}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payments Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Recent Payments</CardTitle>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search payments..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8 w-64"
                                        />
                                    </div>
                                    <Link href="/admin/payments/students">
                                        <Button>
                                            <Users className="h-4 w-4 mr-2" />
                                            View Students
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-medium">Student</th>
                                            <th className="text-left p-4 font-medium">Fee Type</th>
                                            <th className="text-left p-4 font-medium">Amount</th>
                                            <th className="text-left p-4 font-medium">Status</th>
                                            <th className="text-left p-4 font-medium">Due Date</th>
                                            <th className="text-left p-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.data.map((payment) => (
                                            <tr key={payment.id} className="border-b hover:bg-gray-50">
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-medium">{payment.student.name}</div>
                                                        {payment.student.nis && (
                                                            <div className="text-sm text-gray-500">
                                                                NIS: {payment.student.nis}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-medium">{payment.fee_type.name}</div>
                                                        <Badge variant="outline" className="text-xs">
                                                            {payment.fee_type.type}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {formatCurrency(payment.total_amount)}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm">
                                                        {formatDate(payment.due_date)}
                                                        {payment.paid_date && (
                                                            <div className="text-green-600 text-xs">
                                                                Paid: {formatDate(payment.paid_date)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex space-x-1">
                                                        <Button size="sm" variant="outline" asChild title="View Payment Details">
                                                            <Link href={`/admin/payments/${payment.id}`}>
                                                                <Eye className="h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="outline" asChild title="Edit Payment">
                                                            <Link href={`/admin/payments/${payment.id}/edit`}>
                                                                <Edit className="h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {payments.data.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No payments found
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {payments.last_page > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-500">
                                        Showing {((payments.current_page - 1) * payments.per_page) + 1} to{' '}
                                        {Math.min(payments.current_page * payments.per_page, payments.total)} of{' '}
                                        {payments.total} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {Array.from({ length: payments.last_page }, (_, i) => (
                                            <Button
                                                key={i + 1}
                                                variant={payments.current_page === i + 1 ? "default" : "outline"}
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/admin/payments?page=${i + 1}`}>
                                                    {i + 1}
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}