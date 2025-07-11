
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  LogOut, 
  Settings, 
  Clock,
  DollarSign,
  MoreVertical,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePOSStore } from "@/hooks/pos/use-pos-store";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const POSHeader = () => {
  const { user } = useAuth();
  const { currentShift, currentRegister } = usePOSStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border-b px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left - Branding & Date/Time */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">POS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Restaurant POS</h1>
              <p className="text-xs text-gray-500">Point of Sale System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium">{formatTime(currentTime)}</div>
                <div className="text-xs text-gray-500">{formatDate(currentTime)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Shift & Register Info */}
        <div className="flex items-center space-x-4">
          {currentRegister && (
            <Badge variant="outline" className="px-3 py-1">
              Register #{currentRegister.register_number}
            </Badge>
          )}
          
          {currentShift && (
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="px-3 py-1">
                <DollarSign className="w-3 h-3 mr-1" />
                Shift Open
              </Badge>
              <span className="text-sm text-gray-600">
                Since {new Date(currentShift.shift_start).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Right - User & Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{profile?.first_name || 'Cashier'}</div>
              <div className="text-xs text-gray-500">Staff ID: #001</div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default POSHeader;
