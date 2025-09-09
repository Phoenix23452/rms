
import { supabase } from "@/integrations/supabase/client";

export const uploadLogo = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `restaurant-logo-${Date.now()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  // First, ensure the bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const settingsBucket = buckets?.find(bucket => bucket.name === 'settings');
  
  if (!settingsBucket) {
    // Create the bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage.createBucket('settings', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (bucketError) {
      console.error('Error creating storage bucket:', bucketError);
      throw new Error('Failed to create storage bucket');
    }
  }

  const { error } = await supabase.storage
    .from('settings')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }

  const { data } = supabase.storage
    .from('settings')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
