import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Calendar, Shield } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Permission {
    id: number;
    name: string;
    display_name: string;
    description?: string;
}

interface Role {
    id: number;
    name: string;
    display_name: string;
    description?: string;
    permissions: Permission[];
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

interface PageProps {
    user: User;
}

export default function Show() {
    const { user } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Users', href: '/admin/users' },
        { label: user.name, href: `/admin/users/${user.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold flex items-center gap-2">
                            <User className="h-6 w-6" />
                            {user.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            User Details
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/users/${user.id}/edit`}>
                            Edit User
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* User Information */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                                <CardDescription>
                                    Basic information about this user
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Name</div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{user.name}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{user.email}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Email Verification</div>
                                        <div>
                                            {user.email_verified_at ? (
                                                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                                    ✓ Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                    ⚠ Not Verified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Created Date</div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Roles & Permissions */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Roles & Permissions
                                </CardTitle>
                                <CardDescription>
                                    User roles and associated permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.roles.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No roles assigned to this user.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {user.roles.map((role) => (
                                            <div key={role.id} className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="font-semibold">
                                                        {role.display_name}
                                                    </Badge>
                                                </div>
                                                
                                                {role.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {role.description}
                                                    </p>
                                                )}
                                                
                                                {role.permissions && role.permissions.length > 0 && (
                                                    <div className="space-y-1">
                                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                            Permissions ({role.permissions.length})
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {role.permissions.slice(0, 5).map((permission) => (
                                                                <Badge 
                                                                    key={permission.id} 
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {permission.display_name}
                                                                </Badge>
                                                            ))}
                                                            {role.permissions.length > 5 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    +{role.permissions.length - 5} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>
                            Actions you can perform on this user
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button asChild>
                                <Link href={`/admin/users/${user.id}/edit`}>
                                    Edit User
                                </Link>
                            </Button>
                            
                            <Button variant="outline" asChild>
                                <Link href="/admin/users">
                                    Back to Users
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}