import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit2Icon, TrashIcon, ShieldIcon, Shield, Users } from 'lucide-react';
import { dashboard } from '@/routes';

interface Permission {
  id: number;
  name: string;
  display_name: string;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  permissions: Permission[];
}

interface PageProps {
  roles: Role[];
}

const breadcrumbs = [
  { label: 'Dashboard', href: dashboard },
  { label: 'Roles', href: '#' }
];

export default function RolesIndex() {
  const { roles } = usePage<PageProps>().props;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedRole) return;

    router.delete(`/roles/${selectedRole.id}`, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedRole(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles Management" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
              <p className="text-sm text-muted-foreground">Kelola roles dan permissions pengguna</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/users">
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Link>
              </Button>
              <Button asChild>
                <Link href="/roles/create">
                  <ShieldIcon className="h-4 w-4 mr-2" />
                  Tambah Role
                </Link>
              </Button>
            </div>
          </div>

          <div className="border rounded-xl border-sidebar-border/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Nama Tampilan</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Shield className="h-8 w-8" />
                        <p className="text-sm">Belum ada role</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {role.name}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {role.display_name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission.id} variant="secondary">
                              {permission.display_name}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline">
                              +{role.permissions.length - 3} lagi
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/roles/${role.id}/edit`}>
                              <Edit2Icon className="h-4 w-4" />
                            </Link>
                          </Button>
                          {role.name !== 'super_admin' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDeleteDialog(role)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus role "{selectedRole?.display_name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
