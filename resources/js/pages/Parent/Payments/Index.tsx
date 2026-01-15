import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Eye, 
    DollarSign,
    AlertTriangle,
    TrendingUp,
    Clock,
    Users,
    Receipt,
    History
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

interface Props {
    payments: {
        data: StudentPayment[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    children: Student[];
    stats: {
        total_payments: number;
        pending_amount: string;
        overdue_count: number;
        paid_this_year: string;
    };
}

export default function ParentPaymentIndex({ payments, children, stats }: Props) {
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
            <Head title="Payment Information" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Payment Information</h1>
                            <p className="text-gray-600">View your children's school fee payments and history</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => router.get('/parent/payments/history')}
                        >
                            <History className="w-4 h-4 mr-2" />
                            Payment History
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
                                <Receipt className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Amount</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        Rp {Number(stats.pending_amount).toLocaleString('id-ID')}
                                    </p>
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
                                    <p className="text-2xl font-bold text-red-600">{stats.overdue_count}</p>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Paid This Year</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        Rp {Number(stats.paid_this_year).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Children Quick Access */}
                {children.length > 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                View by Child
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {children.map((child) => (
                                    <Card key={child.id} className="hover:shadow-md transition-shadow cursor-pointer"
                                          onClick={() => router.get(`/parent/payments/child/${child.id}`)}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{child.name}</h3>
                                                    <p className="text-sm text-gray-500">{child.grade.name}</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    View Payments
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* All Payments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Payments</CardTitle>
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
                                {payments.data.length > 0 ? payments.data.map((payment) => (
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
                                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${payment.payment_progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-500">
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
                                                onClick={() => router.get(`/parent/payments/payment/${payment.id}`)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8">
                                            <div className="flex flex-col items-center space-y-2">
                                                <CreditCard className="w-12 h-12 text-gray-400" />
                                                <p className="text-gray-500">No payments found</p>
                                                <p className="text-sm text-gray-400">
                                                    Payment information will appear here once generated by school admin
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
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

                {/* Info Section */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-2">Payment Information</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Payment schedules are determined by the school administration</li>
                                    <li>• For payment questions, please contact the school finance office</li>
                                    <li>• Keep your payment receipts for record keeping</li>
                                    <li>• Overdue payments may affect student services</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}