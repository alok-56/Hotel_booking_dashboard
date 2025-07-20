import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, Shield, Mail, Phone, Loader2, Eye, EyeOff } from 'lucide-react';
import { createAdmin, deleteAdmin, getAllAdmins, updateAdmin } from '@/api/Services/Auth/auth';

// Types based on your API response
interface Admin {
  _id: string;
  Name: string;
  Email: string;
  Password?: string;
  Hotel: string[];
  Permission: string[];
  Blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminManagement = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    Permission: [] as string[]
  });

  // Available permissions
  const availablePermissions = [
    'Dashboard',
    'booking', 
    'user',
    'reports',
    'settings',
    'analytics'
  ];

  // Load admins on component mount
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAllAdmins();
      setAdmins(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load admins",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Email: '',
      Password: '',
      Permission: []
    });
    setEditingAdmin(null);
    setShowPassword(false);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      Name: admin.Name,
      Email: admin.Email,
      Password: '', // Don't pre-fill password for security
      Permission: admin.Permission || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      await deleteAdmin(id);
      setAdmins(prev => prev.filter(admin => admin._id !== id));
      toast({
        title: "Admin Deleted",
        description: "Admin has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (id: string, currentBlocked: boolean) => {
    try {
      const admin = admins.find(a => a._id === id);
      if (!admin) return;

      const updateData = {
        Name: admin.Name,
        Email: admin.Email,
        Password: admin.Password, // Keep current passwor
        Permission: admin.Permission,
        Blocked: !currentBlocked
      };

      await updateAdmin(id, updateData);
      setAdmins(prev => prev.map(admin => 
        admin._id === id 
          ? { ...admin, Blocked: !currentBlocked }
          : admin
      ));
      toast({
        title: "Status Updated",
        description: `Admin ${!currentBlocked ? 'blocked' : 'activated'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.Permission.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one permission",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingAdmin) {
        // Update existing admin
        const updateData: any = {
          Name: formData.Name,
          Email: formData.Email,
          Permission: formData.Permission
        };
        
        // Only include password if it's provided
        if (formData.Password.trim()) {
          updateData.Password = formData.Password;
        }
        
        await updateAdmin(editingAdmin._id, updateData);
        
        // Reload admins to get fresh data
        await loadAdmins();
        
        toast({
          title: "Admin Updated",
          description: "Admin details have been updated successfully.",
        });
      } else {
        // Add new admin
        if (!formData.Password.trim()) {
          toast({
            title: "Error",
            description: "Password is required for new admin",
            variant: "destructive"
          });
          return;
        }
        
        await createAdmin({
          Name: formData.Name,
          Email: formData.Email,
          Password: formData.Password,
          Permission: formData.Permission
        });
        
        // Reload admins to get fresh data
        await loadAdmins();
        
        toast({
          title: "Admin Added",
          description: "New admin has been added successfully.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingAdmin ? 'update' : 'create'} admin`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      Permission: checked 
        ? [...prev.Permission, permission]
        : prev.Permission.filter(p => p !== permission)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const activeAdmins = admins.filter(admin => !admin.Blocked);
  const superAdmins = admins.filter(admin => admin.Permission?.includes('Dashboard') && admin.Permission?.includes('settings'));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading admins...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage system administrators and their permissions</p>
        </div>
        <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Admins</p>
                <p className="text-2xl font-bold text-gray-900">{activeAdmins.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Super Admins</p>
                <p className="text-2xl font-bold text-gray-900">{superAdmins.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>
            View and manage all system administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No administrators found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first admin account.</p>
              <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Permissions</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Created</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{admin.Name}</td>
                      <td className="p-4">{admin.Email}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {admin.Permission?.length > 0 ? (
                            admin.Permission.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs text-gray-400">
                              No permissions
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant="outline"
                          className={admin.Blocked 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                          }
                        >
                          {admin.Blocked ? 'Inactive' : 'Active'}
                        </Badge>
                      </td>
                      <td className="p-4">{formatDate(admin.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(admin)}
                            disabled={submitting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(admin._id, admin.Blocked)}
                            className={admin.Blocked ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
                            disabled={submitting}
                          >
                            {admin.Blocked ? "Activate" : "Block"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(admin._id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={submitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
            </DialogTitle>
            <DialogDescription>
              {editingAdmin 
                ? 'Update admin details and permissions.' 
                : 'Create a new administrator account.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.Name}
                onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                placeholder="Enter admin's full name"
                required
                disabled={submitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData(prev => ({ ...prev, Email: e.target.value }))}
                placeholder="Enter email address"
                required
                disabled={submitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {editingAdmin && "(leave blank to keep current)"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.Password}
                  onChange={(e) => setFormData(prev => ({ ...prev, Password: e.target.value }))}
                  placeholder={editingAdmin ? "Enter new password (optional)" : "Enter password"}
                  required={!editingAdmin}
                  disabled={submitting}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-3">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      checked={formData.Permission.includes(permission)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(permission, checked as boolean)
                      }
                      disabled={submitting}
                    />
                    <Label htmlFor={permission} className="text-sm capitalize cursor-pointer">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.Permission.length === 0 && (
                <p className="text-sm text-red-600">Please select at least one permission</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={submitting || formData.Permission.length === 0}
              >
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingAdmin ? 'Update' : 'Create'} Admin
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;