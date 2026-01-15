import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
}

interface PageProps {
  roles: Role[];
}

export default function UsersCreate() {
  const { roles } = usePage<PageProps>().props;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [] as number[],
    email_verified: true, // Default verified for admin-created users
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/users', formData);
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

  return (
    <AuthenticatedLayout>
      <Head title="Tambah User" />

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserPlus className="h-8 w-8" />
              Tambah User Baru
            </h1>
            <p className="text-gray-600 mt-2">Buat akun pengguna baru dengan role tertentu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi User</CardTitle>
                <CardDescription>Masukkan informasi dasar pengguna</CardDescription>
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
                  />
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
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Masukkan password"
                      required
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
                  <p className="text-sm text-gray-500 mt-1">Minimal 8 karakter</p>
                </div>

                <div>
                  <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      placeholder="Ulangi password"
                      required
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
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email_verified"
                      checked={formData.email_verified}
                      onCheckedChange={(checked) => setFormData({ ...formData, email_verified: !!checked })}
                    />
                    <label htmlFor="email_verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                      Email Verified
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Centang untuk menandai email sebagai terverifikasi. User dengan email terverifikasi dapat mengakses semua fitur.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Pilih role yang akan diberikan kepada pengguna ini</CardDescription>
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
                onClick={() => router.get('/admin/users')}
              >
                Batal
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Tambah User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}