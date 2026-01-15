import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
    Plus,
    Edit,
    Trash2,
    Calendar,
    DollarSign
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface FeeType {
    id: number;
    name: string;
    description?: string;
    amount: number;
    frequency: 'monthly' | 'semester' | 'yearly' | 'one_time';
    payment_type: 'mandatory' | 'optional';
    valid_from: string | null;
    valid_until: string | null;
    is_active: boolean;
    allow_installments: boolean;
    max_installments: number;
    created_at: string;
}

interface PaginatedFeeTypes {
    data: FeeType[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    feeTypes: PaginatedFeeTypes;
}

export default function AdminPaymentsFeeTypes({ feeTypes }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingFeeType, setEditingFeeType] = useState<FeeType | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        description: '',
        amount: '',
        frequency: 'monthly' as 'monthly' | 'semester' | 'yearly' | 'one_time',
        payment_type: 'mandatory' as 'mandatory' | 'optional',
        valid_from: '',
        valid_until: '',
        is_active: true,
        allow_installments: false,
        max_installments: 1,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/payments/fee-types', {
            onSuccess: () => {
                reset();
                setIsCreateModalOpen(false);
            }
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFeeType) {
            put(`/admin/payments/fee-types/${editingFeeType.id}`, {
                onSuccess: () => {
                    reset();
                    setIsEditModalOpen(false);
                    setEditingFeeType(null);
                }
            });
        }
    };

    const handleDelete = (feeType: FeeType) => {
        if (confirm(`Are you sure you want to delete "${feeType.name}"?`)) {
            destroy(`/admin/payments/fee-types/${feeType.id}`);
        }
    };

    const openEditModal = (feeType: FeeType) => {
        setEditingFeeType(feeType);
        setData({
            name: feeType.name,
            description: feeType.description || '',
            amount: feeType.amount.toString(),
            frequency: feeType.frequency,
            payment_type: feeType.payment_type,
            valid_from: feeType.valid_from || '',
            valid_until: feeType.valid_until || '',
            is_active: feeType.is_active,
            allow_installments: feeType.allow_installments,
            max_installments: feeType.max_installments,
        });
        setIsEditModalOpen(true);
    };

    const getTypeColor = (type: string) => {
        const colors = {
            'monthly': 'bg-blue-100 text-blue-800',
            'semester': 'bg-green-100 text-green-800',
            'annual': 'bg-purple-100 text-purple-800',
            'one_time': 'bg-gray-100 text-gray-800'
        };
        return colors[type as keyof typeof colors] || colors.one_time;
    };

    const getTypeName = (type: string) => {
        const names = {
            'monthly': 'Monthly',
            'semester': 'Semester', 
            'annual': 'Annual',
            'one_time': 'One Time'
        };
        return names[type as keyof typeof names] || 'One Time';
    };

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Fee Types Management
                    </h2>
                    <div className="flex space-x-2">
                        <Link href="/admin/payments">
                            <Button variant="outline">
                                Back to Payments
                            </Button>
                        </Link>
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Fee Type
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Fee Types Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Fee Types Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feeTypes.data.map((feeType) => (
                            <Card key={feeType.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{feeType.name}</CardTitle>
                                            <Badge className={`text-xs mt-1 ${getTypeColor(feeType.type)}`}>
                                                {getTypeName(feeType.type)}
                                            </Badge>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditModal(feeType)}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(feeType)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {feeType.description && (
                                        <p className="text-sm text-gray-600 mb-4">
                                            {feeType.description}
                                        </p>
                                    )}
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 flex items-center">
                                                <DollarSign className="h-4 w-4 mr-1" />
                                                Amount
                                            </span>
                                            <span className="font-semibold text-lg">
                                                {formatCurrency(feeType.amount)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                Frequency
                                            </span>
                                            <Badge variant={feeType.frequency === 'monthly' ? 'default' : 'secondary'}>
                                                {feeType.frequency}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Payment Type</span>
                                            <Badge variant={feeType.payment_type === 'mandatory' ? 'destructive' : 'outline'}>
                                                {feeType.payment_type}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Status</span>
                                            <Badge variant={feeType.is_active ? 'default' : 'secondary'}>
                                                {feeType.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {feeTypes.data.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-8 text-gray-500">
                                <div className="mb-4">
                                    <DollarSign className="h-12 w-12 mx-auto text-gray-400" />
                                </div>
                                <p>No fee types found</p>
                                <Button 
                                    className="mt-4"
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create First Fee Type
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination */}
                    {feeTypes.last_page > 1 && (
                        <div className="flex items-center justify-center space-x-1">
                            {Array.from({ length: feeTypes.last_page }, (_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={feeTypes.current_page === i + 1 ? "default" : "outline"}
                                    size="sm"
                                    asChild
                                >
                                    <Link href={`/admin/payments/fee-types?page=${i + 1}`}>
                                        {i + 1}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Create Fee Type Modal */}
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Fee Type</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter fee type name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter description (optional)"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="frequency">Frequency *</Label>
                                    <Select
                                        value={data.frequency}
                                        onValueChange={(value) => setData('frequency', value as any)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="semester">Semester</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                            <SelectItem value="one_time">One Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.frequency && (
                                        <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="amount">Amount *</Label>
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
                                    <Label htmlFor="payment_type">Payment Type *</Label>
                                    <Select
                                        value={data.payment_type}
                                        onValueChange={(value) => setData('payment_type', value as any)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mandatory">Mandatory</SelectItem>
                                            <SelectItem value="optional">Optional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_type && (
                                        <p className="text-red-500 text-sm mt-1">{errors.payment_type}</p>
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
                                        Create Fee Type
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Fee Type Modal */}
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Edit Fee Type: {editingFeeType?.name}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEdit} className="space-y-4">
                                <div>
                                    <Label htmlFor="edit_name">Name *</Label>
                                    <Input
                                        id="edit_name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter fee type name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="edit_description">Description</Label>
                                    <Textarea
                                        id="edit_description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter description (optional)"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="edit_frequency">Frequency *</Label>
                                    <Select
                                        value={data.frequency}
                                        onValueChange={(value) => setData('frequency', value as any)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="semester">Semester</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                            <SelectItem value="one_time">One Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.frequency && (
                                        <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="edit_amount">Amount *</Label>
                                    <Input
                                        id="edit_amount"
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
                                    <Label htmlFor="edit_payment_type">Payment Type *</Label>
                                    <Select
                                        value={data.payment_type}
                                        onValueChange={(value) => setData('payment_type', value as any)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mandatory">Mandatory</SelectItem>
                                            <SelectItem value="optional">Optional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_type && (
                                        <p className="text-red-500 text-sm mt-1">{errors.payment_type}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Update Fee Type
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