
import { supabase } from "@/integrations/supabase/client";

export interface Rider {
  id: string;
  user_id: string;
  is_active: boolean;
  current_latitude: number | null;
  current_longitude: number | null;
  last_location_update: string | null;
  created_at: string;
  updated_at: string;
}

export interface RiderWithProfile {
  id: string;
  user_id: string;
  is_active: boolean;
  current_latitude: number | null;
  current_longitude: number | null;
  last_location_update: string | null;
  created_at: string;
  updated_at: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
}

export const fetchRiders = async (): Promise<RiderWithProfile[]> => {
  // First, fetch all riders
  const { data: ridersData, error: ridersError } = await supabase
    .from('riders')
    .select('*')
    .order('created_at', { ascending: false });

  if (ridersError) {
    console.error('Error fetching riders:', ridersError);
    throw ridersError;
  }

  if (!ridersData || ridersData.length === 0) {
    return [];
  }

  // Extract the user_ids to fetch corresponding profiles
  const userIds = ridersData.map(rider => rider.user_id);

  // Fetch profiles for these users
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  // Map profiles to their corresponding riders
  return ridersData.map(rider => {
    const profile = profilesData?.find(p => p.id === rider.user_id) || null;
    
    return {
      ...rider,
      profile: {
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        email: profile?.email || null,
        phone: profile?.phone || null,
        avatar_url: profile?.avatar_url || null,
      }
    };
  });
};

export const fetchRiderById = async (id: string): Promise<RiderWithProfile | null> => {
  // First, fetch the rider
  const { data: rider, error: riderError } = await supabase
    .from('riders')
    .select('*')
    .eq('id', id)
    .single();

  if (riderError) {
    console.error('Error fetching rider:', riderError);
    return null;
  }

  if (!rider) {
    return null;
  }

  // Fetch the profile for this rider
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', rider.user_id)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching rider profile:', profileError);
  }

  return {
    ...rider,
    profile: {
      first_name: profile?.first_name || null,
      last_name: profile?.last_name || null,
      email: profile?.email || null,
      phone: profile?.phone || null,
      avatar_url: profile?.avatar_url || null,
    }
  };
};

export const createRider = async (email: string, password: string, firstName: string, lastName: string): Promise<{ success: boolean, error?: string, rider?: Rider }> => {
  try {
    // 1. Create user in auth system
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      }
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Failed to create user');
    }

    // 2. Add rider role to user
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([
        { user_id: authData.user.id, role: 'rider' }
      ]);

    if (roleError) {
      throw new Error(roleError.message);
    }

    // 3. Create rider entry
    const { data: riderData, error: riderError } = await supabase
      .from('riders')
      .insert([
        { user_id: authData.user.id }
      ])
      .select()
      .single();

    if (riderError || !riderData) {
      throw new Error(riderError?.message || 'Failed to create rider record');
    }

    // 4. Update profile with additional information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName
      })
      .eq('id', authData.user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    return { success: true, rider: riderData };

  } catch (error: any) {
    console.error('Error creating rider:', error);
    return { success: false, error: error.message };
  }
};

export const updateRiderStatus = async (id: string, isActive: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from('riders')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating rider status:', error);
    throw error;
  }

  return true;
};

export const updateRiderLocation = async (id: string, latitude: number, longitude: number): Promise<boolean> => {
  const { error } = await supabase
    .from('riders')
    .update({
      current_latitude: latitude,
      current_longitude: longitude,
      last_location_update: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating rider location:', error);
    throw error;
  }

  return true;
};
