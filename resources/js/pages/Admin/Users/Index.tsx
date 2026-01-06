import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2, Shield, User } from 'lucide-react';

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
  last_login_at?: string;
  roles: Role[];
}

interface PageProps {
  users: User[];
}

export default function UsersIndex() {
  const { users } = usePage<PageProps>().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  React.useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roles.some(role => 
        role.display_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDelete = (userId: number) => {
    router.delete(`/users/${userId}`);
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
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Users Management" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <User className="h-8 w-8" />
                  Users Management
                </h1>
                <p className="text-gray-600 mt-2">Kelola pengguna dan role mereka</p>
              </div>
              <Button onClick={() => router.get('/users/create')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah User
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Daftar Users
                </CardTitle>
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari user, email, atau role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          {searchTerm ? 'Tidak ada user yang ditemukan.' : 'Belum ada user yang terdaftar.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {user.roles.length > 0 ? (
                                user.roles.map((role) => (
                                  <Badge
                                    key={role.id}
                                    variant={getRoleBadgeVariant(role.name) as any}
                                    className="text-xs"
                                  >
                                    {role.display_name}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                  No Role
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.email_verified_at ? 'default' : 'secondary'} className="text-xs">
                              {user.email_verified_at ? 'Verified' : 'Unverified'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.last_login_at ? formatDate(user.last_login_at) : 'Never'}
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.get(`/users/${user.id}/edit`)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex items-center gap-1"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Hapus
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Apakah Anda yakin ingin menghapus user <strong>{user.name}</strong>? 
                                      Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Menampilkan {filteredUsers.length} dari {users.length} users
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}