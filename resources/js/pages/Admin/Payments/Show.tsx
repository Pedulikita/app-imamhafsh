import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft,
    User,
    Calendar,
    DollarSign,
    FileText,
    Edit,
    CreditCard
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Student {
    id: number;
    name: string;
    email: string;
    nis?: string;
}

interface FeeType {
    id: number;
    name: string;
    description?: string;
    frequency: string;
    payment_type: string;
}

interface Installment {
    id: number;
    amount: number;
    paid_date: string;
    payment_method?: string;
    notes?: string;
}

interface Payment {
    id: number;
    total_amount: number;
    status: 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
    due_date: string;
    paid_date?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    student: Student;
    fee_type: FeeType;
    installments: Installment[];
}

interface Props {
    payment: Payment;
}

export default function AdminPaymentsShow({ payment }: Props) {
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

    const totalPaid = payment.installments.reduce((sum, installment) => sum + installment.amount, 0);
    const remainingAmount = payment.total_amount - totalPaid;

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/payments">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Payment Details
                        </h2>
                    </div>
                    <Link href={`/admin/payments/${payment.id}/edit`}>
                        <Button>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Payment
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={`Payment #${payment.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Payment Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Student Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Student Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Name</label>
                                    <p className="text-lg font-semibold">{payment.student.name}</p>
                                </div>
                                {payment.student.nis && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">NIS</label>
                                        <p className="text-lg">{payment.student.nis}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-lg">{payment.student.email}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Payment Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Status</span>
                                    {getStatusBadge(payment.status)}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Total Amount</span>
                                    <span className="text-lg font-bold">{formatCurrency(payment.total_amount)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Amount Paid</span>
                                    <span className="text-lg font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Remaining</span>
                                    <span className={`text-lg font-semibold ${remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(remainingAmount)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Fee Type Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Fee Type Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Fee Name</label>
                                <p className="text-lg font-semibold">{payment.fee_type.name}</p>
                            </div>
                            {payment.fee_type.description && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Description</label>
                                    <p className="text-gray-800">{payment.fee_type.description}</p>
                                </div>
                            )}
                            <div className="flex space-x-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Frequency</label>
                                    <p className="text-gray-800 capitalize">{payment.fee_type.frequency}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Type</label>
                                    <Badge variant={payment.fee_type.payment_type === 'mandatory' ? 'destructive' : 'outline'}>
                                        {payment.fee_type.payment_type}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Dates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2" />
                                Payment Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Due Date</label>
                                    <p className="text-lg">{formatDate(payment.due_date)}</p>
                                </div>
                                {payment.paid_date && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Paid Date</label>
                                        <p className="text-lg text-green-600">{formatDate(payment.paid_date)}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Created</label>
                                    <p className="text-lg">{formatDate(payment.created_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Installments */}
                    {payment.installments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    Payment Installments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {payment.installments.map((installment, index) => (
                                        <div key={installment.id} className="flex justify-between items-center p-4 border rounded-lg">
                                            <div>
                                                <div className="font-semibold">Installment #{index + 1}</div>
                                                <div className="text-sm text-gray-600">
                                                    Paid on {formatDate(installment.paid_date)}
                                                </div>
                                                {installment.payment_method && (
                                                    <div className="text-sm text-gray-600">
                                                        Method: {installment.payment_method}
                                                    </div>
                                                )}
                                                {installment.notes && (
                                                    <div className="text-sm text-gray-600">
                                                        Notes: {installment.notes}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-lg font-bold text-green-600">
                                                {formatCurrency(installment.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notes */}
                    {payment.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-800">{payment.notes}</p>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}