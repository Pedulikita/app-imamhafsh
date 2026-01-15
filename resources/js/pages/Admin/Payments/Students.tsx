import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
    Search, 
    Plus,
    Eye,
    CreditCard,
    AlertTriangle,
    Calendar
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Payment {
    id: number;
    total_amount: number;
    status: 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
    due_date: string;
    paid_date?: string;
    fee_type: {
        id: number;
        name: string;
        type: string;
    };
}

interface Student {
    id: number;
    name: string;
    email: string;
    nis?: string;
    payments: Payment[];
}

interface PaginatedStudents {
    data: Student[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    students: PaginatedStudents;
}

export default function AdminPaymentsStudents({ students }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        fee_type_id: '',
        amount: '',
        due_date: ''
    });

    const handleCreatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/payments/create-payment', {
            onSuccess: () => {
                reset();
                setIsCreateModalOpen(false);
                setSelectedStudent(null);
            }
        });
    };

    const getStudentStats = (student: Student) => {
        const payments = student.payments;
        return {
            total: payments.length,
            paid: payments.filter(p => p.status === 'paid').length,
            pending: payments.filter(p => p.status === 'pending').length,
            overdue: payments.filter(p => p.status === 'overdue').length,
            totalAmount: payments.reduce((sum, p) => sum + p.total_amount, 0),
            paidAmount: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.total_amount, 0)
        };
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
            <Badge variant={variants[status as keyof typeof variants] as any} className="text-xs">
                {status.toUpperCase()}
            </Badge>
        );
    };

    const openCreateModal = (student: Student) => {
        setSelectedStudent(student);
        setData('student_id', student.id.toString());
        setIsCreateModalOpen(true);
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Student Payment Management
                    </h2>
                    <div className="flex space-x-2">
                        <Link href="/admin/payments">
                            <Button variant="outline">
                                Back to Payments
                            </Button>
                        </Link>
                        <Link href="/admin/payments/fee-types">
                            <Button variant="outline">
                                Manage Fee Types
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Student Payments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Search */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search students by name or NIS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Students Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {students.data.map((student) => {
                            const stats = getStudentStats(student);
                            return (
                                <Card key={student.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{student.name}</CardTitle>
                                                <p className="text-sm text-gray-500">{student.email}</p>
                                                {student.nis && (
                                                    <p className="text-sm text-gray-500">NIS: {student.nis}</p>
                                                )}
                                            </div>
                                            <div className="flex space-x-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openCreateModal(student)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Payment Statistics */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-gray-50 p-3 rounded">
                                                <div className="text-sm text-gray-600">Total Payments</div>
                                                <div className="text-lg font-semibold">{stats.total}</div>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded">
                                                <div className="text-sm text-green-600">Paid Amount</div>
                                                <div className="text-lg font-semibold text-green-600">
                                                    {formatCurrency(stats.paidAmount)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Summary */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {stats.paid > 0 && (
                                                <Badge variant="success" className="text-xs">
                                                    {stats.paid} Paid
                                                </Badge>
                                            )}
                                            {stats.pending > 0 && (
                                                <Badge variant="warning" className="text-xs">
                                                    {stats.pending} Pending
                                                </Badge>
                                            )}
                                            {stats.overdue > 0 && (
                                                <Badge variant="destructive" className="text-xs">
                                                    {stats.overdue} Overdue
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Recent Payments */}
                                        {student.payments.length > 0 ? (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium">Recent Payments</h4>
                                                {student.payments.slice(0, 3).map((payment) => (
                                                    <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                                        <div>
                                                            <div className="font-medium">{payment.fee_type.name}</div>
                                                            <div className="text-gray-500 text-xs">
                                                                Due: {formatDate(payment.due_date)}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium">{formatCurrency(payment.total_amount)}</div>
                                                            {getStatusBadge(payment.status)}
                                                        </div>
                                                    </div>
                                                ))}
                                                {student.payments.length > 3 && (
                                                    <div className="text-xs text-center text-gray-500 mt-2">
                                                        +{student.payments.length - 3} more payments
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500 text-sm">
                                                No payments found
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {students.data.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-8 text-gray-500">
                                No students found
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {students.last_page > 1 && (
                        <div className="flex items-center justify-center space-x-1">
                            {Array.from({ length: students.last_page }, (_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={students.current_page === i + 1 ? "default" : "outline"}
                                    size="sm"
                                    asChild
                                >
                                    <Link href={`/admin/payments/students?page=${i + 1}`}>
                                        {i + 1}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Create Payment Modal */}
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Create Payment for {selectedStudent?.name}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreatePayment} className="space-y-4">
                                <div>
                                    <Label htmlFor="fee_type_id">Fee Type</Label>
                                    <Select
                                        value={data.fee_type_id}
                                        onValueChange={(value) => setData('fee_type_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select fee type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Tuition Fee</SelectItem>
                                            <SelectItem value="2">Lab Fee</SelectItem>
                                            <SelectItem value="3">Library Fee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.fee_type_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fee_type_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                    {errors.amount && (
                                        <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="due_date">Due Date</Label>
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

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCreateModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Create Payment
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}