import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Shield, UserCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePOSStore } from "@/hooks/pos/use-pos-store";

interface POSLoginProps {
  onLoginSuccess: (staff: any, shift: any) => void;
}

const POSLogin = ({ onLoginSuccess }: POSLoginProps) => {
  const [staffCode, setStaffCode] = useState('');
  const [pin, setPin] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { setCurrentShift, setCurrentRegister } = usePOSStore();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ staffCode, pin }: { staffCode: string; pin: string }) => {
      // Get staff member by staff code - using separate queries to avoid relation issues
      const { data: staff, error: staffError } = await supabase
        .from('pos_staff')
        .select('*')
        .eq('staff_code', staffCode)
        .eq('is_active', true)
        .maybeSingle();

      if (staffError) {
        console.error('Staff query error:', staffError);
        throw new Error('Database error occurred');
      }

      if (!staff) {
        throw new Error('Invalid staff code or PIN');
      }

      // Get profile data separately
      let profile = null;
      if (staff.user_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', staff.user_id)
          .maybeSingle();
        profile = profileData;
      }

      // Get branch data separately
      let branch = null;
      if (staff.branch_id) {
        const { data: branchData } = await supabase
          .from('restaurant_locations')
          .select('name')
          .eq('id', staff.branch_id)
          .maybeSingle();
        branch = branchData;
      }

      // Hash the provided PIN to compare
      const pinHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin));
      const pinHashHex = Array.from(new Uint8Array(pinHash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Compare PIN hash (in production, use proper secure comparison)
      if (pinHashHex !== staff.pin_hash) {
        throw new Error('Invalid staff code or PIN');
      }

      // Get available register for this branch
      const { data: register } = await supabase
        .from('pos_registers')
        .select('*')
        .eq('branch_id', staff.branch_id)
        .eq('is_active', true)
        .maybeSingle();

      // Check if there's an active shift for this staff member
      let { data: activeShift } = await supabase
        .from('pos_shifts')
        .select('*')
        .eq('staff_id', staff.id)
        .eq('status', 'open')
        .maybeSingle();

      // If no active shift, create one
      if (!activeShift && register) {
        const { data: newShift, error: shiftError } = await supabase
          .from('pos_shifts')
          .insert({
            staff_id: staff.id,
            register_id: register.id,
            opening_cash: register.current_cash_amount || 0,
            status: 'open'
          })
          .select()
          .single();

        if (shiftError) throw shiftError;
        activeShift = newShift;
      }

      // Combine data for return
      const staffWithProfile = {
        ...staff,
        profiles: profile,
        restaurant_locations: branch
      };

      return { staff: staffWithProfile, shift: activeShift, register };
    },
    onSuccess: ({ staff, shift, register }) => {
      setCurrentShift(shift);
      setCurrentRegister(register);
      // Safely access first_name with proper null checking
      const firstName = staff?.profiles?.first_name || 'Staff';
      toast.success(`Welcome back, ${firstName}!`);
      onLoginSuccess(staff, shift);
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast.error('Invalid staff code or PIN');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffCode || !pin) {
      toast.error('Please enter both staff code and PIN');
      return;
    }
    loginMutation.mutate({ staffCode, pin });
  };

  const handlePinInput = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'manager': return <UserCheck className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">POS</span>
          </div>
          <h1 className="text-2xl font-bold">Restaurant POS</h1>
          <p className="text-gray-600">Point of Sale System</p>
        </div>

        {/* Time Display */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Clock className="w-5 h-5 text-gray-400" />
              <div className="text-center">
                <div className="font-mono font-bold">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Login</CardTitle>
            <CardDescription>
              Enter your staff code and PIN to access the POS system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="staffCode">Staff Code</Label>
                <Input
                  id="staffCode"
                  type="text"
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value.toUpperCase())}
                  placeholder="Enter staff code"
                  className="text-center font-mono"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => handlePinInput(e.target.value)}
                  placeholder="••••"
                  className="text-center font-mono text-lg tracking-widest"
                  maxLength={4}
                  autoComplete="off"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* System Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Restaurant POS System v1.0</p>
          <p>For support, contact your system administrator</p>
        </div>
      </div>
    </div>
  );
};

export default POSLogin;
