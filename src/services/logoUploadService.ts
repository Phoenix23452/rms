export const uploadLogo = async (file: File): Promise<string> => {
  console.log("[Mock] uploadLogo called with file:", file.name);

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const fileExt = file.name.split(".").pop();
  const fakeFileName = `restaurant-logo-${Date.now()}.${fileExt}`;

  // Return a dummy public URL (pretending it was uploaded)
  return `https://dummy-storage.example.com/logos/${fakeFileName}`;
};
