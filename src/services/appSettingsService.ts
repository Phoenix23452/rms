// src/lib/mock/settings.ts or wherever you previously had settings.ts

export interface AppSettings {
  id?: string;
  siteName?: string;
  maintenanceMode?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ✅ In-memory mock settings object
let mockSettings: AppSettings = {
  id: "mock-id-123",
  siteName: "Mock Food Delivery",
  maintenanceMode: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ✅ Simulate fetching settings (with delay)
export const fetchSettings = async (): Promise<AppSettings | null> => {
  console.log("🔧 [Mock] fetchSettings called");
  await delay(300); // Simulate network delay
  return mockSettings;
};

// ✅ Simulate updating settings (with delay)
export const updateSettings = async (
  settings: Partial<AppSettings>,
): Promise<AppSettings | null> => {
  console.log("📝 [Mock] updateSettings called with:", settings);
  await delay(300); // Simulate network delay

  mockSettings = {
    ...mockSettings,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  return mockSettings;
};

// Utility: delay for fake async calls
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
