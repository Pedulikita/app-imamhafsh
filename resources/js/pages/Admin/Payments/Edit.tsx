import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
    ArrowLeft,
    Save,
    User,
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
    student: Student;
    fee_type: FeeType;
    installments: Installment[];
}

interface Props {
    payment: Payment;
    feeTypes: FeeType[];
    students: { id: number; name: string; email: string; }[];
}

export default function AdminPaymentsEdit({ payment, feeTypes, students }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        student_id: payment.student.id,
        fee_type_id: payment.fee_type.id,
        total_amount: payment.total_amount.toString(),
        status: payment.status,
        due_date: payment.due_date.split('T')[0], // Format for date input
        paid_date: payment.paid_date ? payment.paid_date.split('T')[0] : '',
        notes: payment.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/payments/${payment.id}`);
    };

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

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href={`/admin/payments/${payment.id}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Edit Payment
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Payment #${payment.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Edit Form */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            Payment Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="student_id">Student *</Label>
                                                <Select
                                                    value={data.student_id.toString()}
                                                    onValueChange={(value) => setData('student_id', parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select student" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {students.map((student) => (
                                                            <SelectItem key={student.id} value={student.id.toString()}>
                                                                {student.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.student_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="fee_type_id">Fee Type *</Label>
                                                <Select
                                                    value={data.fee_type_id.toString()}
                                                    onValueChange={(value) => setData('fee_type_id', parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select fee type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {feeTypes.map((feeType) => (
                                                            <SelectItem key={feeType.id} value={feeType.id.toString()}>
                                                                {feeType.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.fee_type_id && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.fee_type_id}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="total_amount">Total Amount *</Label>
                                                <Input
                                                    id="total_amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.total_amount}
                                                    onChange={(e) => setData('total_amount', e.target.value)}
                                                    placeholder="Enter amount"
                                                />
                                                {errors.total_amount && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.total_amount}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="status">Status *</Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(value) => setData('status', value as any)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="paid">Paid</SelectItem>
                                                        <SelectItem value="overdue">Overdue</SelectItem>
                                                        <SelectItem value="partial">Partial</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="due_date">Due Date *</Label>
                                                <Input
                                                    id="due_date"
                                                    type="date"
                                                    value={data.due_date}
                                                    onChange={(e) => setData('due_date', e.target.value)}
                                                />
                                                {errors.due_date && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="paid_date">Paid Date</Label>
                                                <Input
                                                    id="paid_date"
                                                    type="date"
                                                    value={data.paid_date}
                                                    onChange={(e) => setData('paid_date', e.target.value)}
                                                />
                                                {errors.paid_date && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.paid_date}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Enter payment notes (optional)"
                                                rows={3}
                                            />
                                            {errors.notes && (
                                                <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                                            )}
                                        </div>

                                    </CardContent>
                                </Card>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-2">
                                    <Link href={`/admin/payments/${payment.id}`}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? 'Saving...' : 'Update Payment'}
                                    </Button>
                                </div>

                            </div>

                            {/* Current Payment Summary */}
                            <div className="space-y-6">
                                
                                {/* Current Status */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <User className="h-5 w-5 mr-2" />
                                            Current Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Status</span>
                                            {getStatusBadge(payment.status)}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Original Amount</span>
                                            <span className="text-lg font-bold">{formatCurrency(payment.total_amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Paid Amount</span>
                                            <span className="text-lg font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600">Remaining</span>
                                            <span className="text-lg font-semibold text-red-600">
                                                {formatCurrency(payment.total_amount - totalPaid)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Installments Summary */}
                                {payment.installments.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Payment History</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {payment.installments.map((installment, index) => (
                                                    <div key={installment.id} className="flex justify-between items-center">
                                                        <div>
                                                            <div className="text-sm font-medium">Installment #{index + 1}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {formatDate(installment.paid_date)}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-semibold text-green-600">
                                                            {formatCurrency(installment.amount)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                        </div>
                    </form>

                </div>
            </div>
        </AppLayout>
    );
}