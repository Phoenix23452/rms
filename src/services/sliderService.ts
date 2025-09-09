export interface SliderImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  type: "menu" | "home" | "about";
  button_text?: string;
  button_link?: string;
}

export const fetchSliderImages = async (
  type: "menu" | "home" | "about",
): Promise<SliderImage[]> => {
  try {
    // Use any type to bypass the TypeScript validation since the table exists in DB but not in types
    const { data, error } = await (supabase as any)
      .from("slider_images")
      .select("*")
      .eq("type", type)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching slider images:", error);
      return [];
    }

    return (data as SliderImage[]) || [];
  } catch (error) {
    console.error("Unexpected error fetching slider images:", error);
    return [];
  }
};

export const createSliderImage = async (
  sliderImage: Omit<SliderImage, "id" | "created_at" | "updated_at">,
): Promise<SliderImage | null> => {
  try {
    // Use any type to bypass the TypeScript validation
    const { data, error } = await (supabase as any)
      .from("slider_images")
      .insert([sliderImage])
      .select()
      .single();

    if (error) {
      console.error("Error creating slider image:", error);
      return null;
    }

    return data as SliderImage;
  } catch (error) {
    console.error("Unexpected error creating slider image:", error);
    return null;
  }
};

export const updateSliderImage = async (
  id: string,
  updates: Partial<SliderImage>,
): Promise<SliderImage | null> => {
  try {
    // Use any type to bypass the TypeScript validation
    const { data, error } = await (supabase as any)
      .from("slider_images")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating slider image:", error);
      return null;
    }

    return data as SliderImage;
  } catch (error) {
    console.error("Unexpected error updating slider image:", error);
    return null;
  }
};

export const deleteSliderImage = async (id: string): Promise<boolean> => {
  try {
    // Use any type to bypass the TypeScript validation
    const { error } = await (supabase as any)
      .from("slider_images")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting slider image:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting slider image:", error);
    return false;
  }
};

export const uploadSliderImage = async (
  file: File,
  path: string,
): Promise<string | null> => {
  try {
    const fileExt = file.name.split(".").pop();
    const filePath = `${path}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("sliders")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading slider image:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("sliders").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Unexpected error uploading slider image:", error);
    return null;
  }
};
