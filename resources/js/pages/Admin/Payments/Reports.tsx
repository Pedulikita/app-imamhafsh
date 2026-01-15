import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    BarChart,
    DollarSign, 
    TrendingUp,
    Calendar,
    PieChart,
    Download
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FeeTypeStat {
    name: string;
    total_revenue: number;
    payment_count: number;
}

interface StatusStat {
    status: string;
    count: number;
}

interface Props {
    monthlyRevenue: number;
    yearlyRevenue: number;
    feeTypeStats: FeeTypeStat[];
    statusStats: StatusStat[];
}

export default function AdminPaymentsReports({ 
    monthlyRevenue, 
    yearlyRevenue, 
    feeTypeStats, 
    statusStats 
}: Props) {
    const getStatusColor = (status: string) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'paid': 'bg-green-100 text-green-800 border-green-200',
            'overdue': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusName = (status: string) => {
        const names = {
            'pending': 'Pending',
            'paid': 'Paid',
            'overdue': 'Overdue'
        };
        return names[status as keyof typeof names] || status;
    };

    const totalPayments = statusStats.reduce((sum, stat) => sum + stat.count, 0);

    return (
        <AppLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Payment Reports & Analytics
                    </h2>
                    <div className="flex space-x-2">
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </Button>
                        <Link href="/admin/payments">
                            <Button variant="outline">
                                Back to Payments
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Payment Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Revenue Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Monthly Revenue
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">
                                    {formatCurrency(monthlyRevenue)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Current month earnings
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Yearly Revenue
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(yearlyRevenue)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Total year earnings
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PieChart className="h-5 w-5 mr-2" />
                                Payment Status Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {statusStats.map((stat) => {
                                    const percentage = totalPayments > 0 
                                        ? ((stat.count / totalPayments) * 100).toFixed(1)
                                        : '0';
                                    
                                    return (
                                        <div 
                                            key={stat.status}
                                            className={`p-4 rounded-lg border ${getStatusColor(stat.status)}`}
                                        >
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{stat.count}</div>
                                                <div className="text-sm font-medium">
                                                    {getStatusName(stat.status)}
                                                </div>
                                                <div className="text-xs mt-1">
                                                    {percentage}% of total
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {totalPayments === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No payment data available
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Fee Type Revenue Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart className="h-5 w-5 mr-2" />
                                Revenue by Fee Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {feeTypeStats.length > 0 ? (
                                <div className="space-y-4">
                                    {feeTypeStats.map((feeType) => (
                                        <div key={feeType.name} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-semibold">{feeType.name}</h3>
                                                <span className="text-lg font-bold text-green-600">
                                                    {formatCurrency(feeType.total_revenue)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>{feeType.payment_count} payments</span>
                                                <span>
                                                    Avg: {formatCurrency(
                                                        feeType.payment_count > 0 
                                                            ? feeType.total_revenue / feeType.payment_count 
                                                            : 0
                                                    )}
                                                </span>
                                            </div>
                                            
                                            {/* Simple Progress Bar */}
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            (feeType.total_revenue / Math.max(...feeTypeStats.map(f => f.total_revenue))) * 100,
                                                            100
                                                        )}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <p>No fee type data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Fee Types
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{feeTypeStats.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Active fee categories
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Payments
                                </CardTitle>
                                <BarChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalPayments}</div>
                                <p className="text-xs text-muted-foreground">
                                    All payment records
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Average Payment
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalPayments > 0 
                                        ? formatCurrency(yearlyRevenue / totalPayments)
                                        : formatCurrency(0)
                                    }
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Per payment amount
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Export Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Export Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="justify-start">
                                    <Download className="h-4 w-4 mr-2" />
                                    Monthly Report (PDF)
                                </Button>
                                <Button variant="outline" className="justify-start">
                                    <Download className="h-4 w-4 mr-2" />
                                    Payment Data (Excel)
                                </Button>
                                <Button variant="outline" className="justify-start">
                                    <Download className="h-4 w-4 mr-2" />
                                    Summary Report (CSV)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}