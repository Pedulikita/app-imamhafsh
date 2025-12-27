import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string;
  group: string;
}

interface PageProps {
  permissions: Record<string, Permission[]>;
}

export default function RolesCreate() {
  const { permissions } = usePage<PageProps>().props;
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    permissions: [] as number[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/roles', formData);
  };

  const togglePermission = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const toggleGroupPermissions = (group: Permission[]) => {
    const groupIds = group.map((p) => p.id);
    const allSelected = groupIds.every((id) => formData.permissions.includes(id));

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((id) => !groupIds.includes(id))
        : [...new Set([...prev.permissions, ...groupIds])],
    }));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Create Role" />

      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Create Role</h1>
            <p className="text-gray-600 mt-2">Create a new role with custom permissions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
                <CardDescription>Basic information about the role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Role Name (slug)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., content_manager"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Use lowercase with underscores</p>
                </div>

                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="e.g., Content Manager"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this role can do"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>Select permissions for this role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(permissions).map(([groupName, groupPermissions]) => (
                    <div key={groupName} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{groupName}</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => toggleGroupPermissions(groupPermissions)}
                        >
                          {groupPermissions.every((p) => formData.permissions.includes(p.id))
                            ? 'Deselect All'
                            : 'Select All'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {groupPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={formData.permissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={`permission-${permission.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {permission.display_name}
                              </label>
                              {permission.description && (
                                <p className="text-sm text-muted-foreground">
                                  {permission.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.get('/roles')}
              >
                Cancel
              </Button>
              <Button type="submit">Create Role</Button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
