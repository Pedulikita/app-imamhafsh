import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPen, Eye, EyeOff, Lock } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  roles: Role[];
}

interface PageProps {
  user: User;
  roles: Role[];
}

export default function UsersEdit() {
  const { user, roles } = usePage<PageProps>().props;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    roles: user.roles.map(role => role.id),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Client-side validation
    const newErrors: any = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    // Password validation only if password is provided
    if (formData.password && formData.password.trim() !== '') {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Password confirmation does not match';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create clean form data
    const submitData = {
      name: formData.name,
      email: formData.email,
      roles: formData.roles,
    } as any;
    
    // Only include password fields if password is provided
    if (formData.password && formData.password.trim() !== '') {
      submitData.password = formData.password;
      submitData.password_confirmation = formData.password_confirmation;
    }
    
    router.put(`/users/${user.id}`, submitData, {
      onSuccess: () => {
        setErrors({});
      },
      onError: (errors) => {
        setErrors(errors);
      }
    });
  };

  const toggleRole = (roleId: number) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((id) => id !== roleId)
        : [...prev.roles, roleId],
    }));
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'editor':
        return 'secondary';
      case 'penulis':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit User - ${user.name}`} />

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserPen className="h-8 w-8" />
              Edit User: {user.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Update informasi pengguna dan role mereka
            </p>
            <div className="mt-3 text-sm text-gray-500">
              Bergabung pada: {formatDate(user.created_at)} • 
              Status: <Badge variant={user.email_verified_at ? 'default' : 'secondary'} className="text-xs ml-1">
                {user.email_verified_at ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi User</CardTitle>
                <CardDescription>Update informasi dasar pengguna</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    required
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Masukkan alamat email"
                    required
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Update Password</span>
                    <span className="text-xs text-gray-500">(Opsional - kosongkan jika tidak ingin mengubah)</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="password">Password Baru</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Masukkan password baru (opsional)"
                          className={errors.password ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                      <p className="text-sm text-gray-500 mt-1">Minimal 8 karakter</p>
                    </div>

                    <div>
                      <Label htmlFor="password_confirmation">Konfirmasi Password Baru</Label>
                      <div className="relative">
                        <Input
                          id="password_confirmation"
                          type={showPasswordConfirmation ? 'text' : 'password'}
                          value={formData.password_confirmation}
                          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                          placeholder="Ulangi password baru"
                          className={errors.password_confirmation ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        >
                          {showPasswordConfirmation ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password_confirmation && <p className="text-sm text-red-500 mt-1">{errors.password_confirmation}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Update role yang diberikan kepada pengguna ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles.length === 0 ? (
                    <p className="text-gray-500 text-sm">Tidak ada role yang tersedia.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roles.map((role) => (
                        <div key={role.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={formData.roles.includes(role.id)}
                              onCheckedChange={() => toggleRole(role.id)}
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <label
                                  htmlFor={`role-${role.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {role.display_name}
                                </label>
                                <Badge variant={getRoleBadgeVariant(role.name) as any} className="text-xs">
                                  {role.name}
                                </Badge>
                              </div>
                              {role.description && (
                                <p className="text-sm text-gray-600">{role.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.roles.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Selected Roles:</h4>
                      <div className="flex flex-wrap gap-2">
                        {roles
                          .filter(role => formData.roles.includes(role.id))
                          .map(role => (
                            <Badge
                              key={role.id}
                              variant={getRoleBadgeVariant(role.name) as any}
                              className="text-xs"
                            >
                              {role.display_name}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.get('/users')}
              >
                Batal
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <UserPen className="h-4 w-4" />
                Update User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}