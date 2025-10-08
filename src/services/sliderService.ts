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

// In-memory store for slider images
let sliderImages: SliderImage[] = [];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const generateId = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();

export const fetchSliderImages = async (
  type: "menu" | "home" | "about",
): Promise<SliderImage[]> => {
  await delay(50);
  return sliderImages
    .filter((img) => img.type === type && img.is_active)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
};

export const createSliderImage = async (
  sliderImage: Omit<SliderImage, "id" | "created_at" | "updated_at">,
): Promise<SliderImage> => {
  await delay(50);

  const newImage: SliderImage = {
    ...sliderImage,
    id: generateId(),
    created_at: nowISO(),
    updated_at: nowISO(),
  };

  sliderImages.push(newImage);
  return newImage;
};

export const updateSliderImage = async (
  id: string,
  updates: Partial<SliderImage>,
): Promise<SliderImage | null> => {
  await delay(50);

  const index = sliderImages.findIndex((img) => img.id === id);
  if (index === -1) return null;

  sliderImages[index] = {
    ...sliderImages[index],
    ...updates,
    updated_at: nowISO(),
  };

  return sliderImages[index];
};

export const deleteSliderImage = async (id: string): Promise<boolean> => {
  await delay(50);

  const index = sliderImages.findIndex((img) => img.id === id);
  if (index === -1) return false;

  sliderImages.splice(index, 1);
  return true;
};

// Dummy upload: returns a fake public URL for the uploaded file
export const uploadSliderImage = async (
  file: File,
  path: string,
): Promise<string | null> => {
  await delay(50);

  const fileExt = file.name.split(".").pop();
  const filePath = `${path}/${Date.now()}.${fileExt}`;

  // Simulate upload success and return fake public URL
  return `https://fake-storage.com/${filePath}`;
};
