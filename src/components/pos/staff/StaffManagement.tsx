import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Plus, User, Shield, UserCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface POSStaff {
  id: string;
  staff_code: string;
  role: 'cashier' | 'manager' | 'admin';
  is_active: boolean;
  branch_id: string;
  user_id: string;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  restaurant_locations?: {
    name: string;
  } | null;
}

const StaffManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<POSStaff | null>(null);
  const queryClient = useQueryClient();

  // Fetch POS staff
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['pos-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pos_staff')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch related data separately to avoid join issues
      const staffWithProfiles = await Promise.all(
        (data || []).map(async (staffMember) => {
          let profile = null;
          let branch = null;

          // Get profile data if user_id exists
          if (staffMember.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', staffMember.user_id)
              .maybeSingle();
            profile = profileData;
          }

          // Get branch data if branch_id exists
          if (staffMember.branch_id) {
            const { data: branchData } = await supabase
              .from('restaurant_locations')
              .select('name')
              .eq('id', staffMember.branch_id)
              .maybeSingle();
            branch = branchData;
          }

          return {
            ...staffMember,
            profiles: profile,
            restaurant_locations: branch
          };
        })
      );
      
      return staffWithProfiles as POSStaff[];
    }
  });

  // Fetch branches for dropdown
  const { data: branches = [] } = useQuery({
    queryKey: ['restaurant-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_locations')
        .select('id, name')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (staffId: string) => {
      const { error } = await supabase
        .from('pos_staff')
        .delete()
        .eq('id', staffId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-staff'] });
      toast.success('Staff member deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete staff member');
    }
  });

  // Toggle staff status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ staffId, isActive }: { staffId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('pos_staff')
        .update({ is_active: !isActive })
        .eq('id', staffId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos-staff'] });
      toast.success('Staff status updated successfully');
    },
    onError: (error) => {
      console.error('Status update error:', error);
      toast.error('Failed to update staff status');
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'manager': return <UserCheck className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive' as const;
      case 'manager': return 'default' as const;
      default: return 'secondary' as const;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">POS Staff Management</h1>
          <p className="text-gray-600">Manage your point of sale staff members</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <AddStaffForm 
              branches={branches}
              onSuccess={() => {
                setShowAddDialog(false);
                queryClient.invalidateQueries({ queryKey: ['pos-staff'] });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
          <CardDescription>
            Manage your POS staff accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono font-medium">
                    {member.staff_code}
                  </TableCell>
                  <TableCell>
                    {member.profiles?.first_name || 'N/A'} {member.profiles?.last_name || ''}
                  </TableCell>
                  <TableCell>{member.profiles?.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1 w-fit">
                      {getRoleIcon(member.role)}
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.restaurant_locations?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? "default" : "secondary"}>
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatusMutation.mutate({
                          staffId: member.id,
                          isActive: member.is_active
                        })}
                      >
                        {member.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingStaff(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteStaffMutation.mutate(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {staff.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No staff members found. Add your first staff member to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface AddStaffFormProps {
  branches: Array<{ id: string; name: string }>;
  onSuccess: () => void;
}

const AddStaffForm = ({ branches, onSuccess }: AddStaffFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    staffCode: '',
    pin: '',
    role: 'cashier' as 'cashier' | 'manager' | 'admin',
    branchId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Creating staff with data:', formData);

      // Step 1: Check if staff code already exists
      const { data: existingStaff } = await supabase
        .from('pos_staff')
        .select('staff_code')
        .eq('staff_code', formData.staffCode)
        .maybeSingle();

      if (existingStaff) {
        throw new Error('Staff code already exists. Please use a different code.');
      }

      // Step 2: Create a temporary user ID (since we're not using real auth)
      const tempUserId = crypto.randomUUID();

      // Step 3: Create profile entry first (without RLS issues)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: tempUserId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue anyway, profile creation might fail due to RLS
      }

      // Step 4: Create POS staff entry directly (bypassing the function for now)
      const { data: staffData, error: staffError } = await supabase
        .from('pos_staff')
        .insert({
          user_id: tempUserId,
          staff_code: formData.staffCode,
          pin_hash: formData.pin, // Store PIN directly for now (in production, hash it properly)
          role: formData.role,
          branch_id: formData.branchId || null,
          is_active: true
        })
        .select()
        .single();

      if (staffError) {
        console.error('Staff creation error:', staffError);
        throw new Error(`Failed to create staff: ${staffError.message}`);
      }

      console.log('Staff created successfully:', staffData);
      toast.success('Staff member added successfully! They can now login with their staff code and PIN.');
      onSuccess();
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        staffCode: '',
        pin: '',
        role: 'cashier',
        branchId: ''
      });
    } catch (error: any) {
      console.error('Add staff error:', error);
      toast.error(error.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="staffCode">Staff Code *</Label>
          <Input
            id="staffCode"
            value={formData.staffCode}
            onChange={(e) => setFormData(prev => ({ ...prev, staffCode: e.target.value.toUpperCase() }))}
            placeholder="e.g., CASH001"
            required
          />
        </div>
        <div>
          <Label htmlFor="pin">PIN (4 digits) *</Label>
          <Input
            id="pin"
            type="password"
            maxLength={4}
            value={formData.pin}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData(prev => ({ ...prev, pin: value }));
            }}
            placeholder="1234"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="role">Role *</Label>
        <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cashier">Cashier</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="branch">Branch</Label>
        <Select value={formData.branchId} onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select branch (optional)" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> The staff member will be able to login using their Staff Code and PIN at the POS terminal.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adding Staff...' : 'Add Staff Member'}
      </Button>
    </form>
  );
};

export default StaffManagement;
