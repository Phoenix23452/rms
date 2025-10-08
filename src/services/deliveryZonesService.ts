// src/lib/mock/delivery-zones.ts (or wherever your data logic lives)
// src/types/settings.ts
export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  isActive: boolean;
}

export interface NewDeliveryZone {
  name: string;
  fee: number;
  isActive?: boolean;
}

let mockDeliveryZones: DeliveryZone[] = [
  {
    id: "zone-1",
    name: "Downtown",
    fee: 50,
    isActive: true,
  },
  {
    id: "zone-2",
    name: "Uptown",
    fee: 70,
    isActive: false,
  },
];

// 🟢 Fetch mock delivery zones
export const fetchDeliveryZones = async (): Promise<DeliveryZone[]> => {
  console.log("📦 [Mock] fetchDeliveryZones called");
  await delay(300);
  return [...mockDeliveryZones]; // return a copy
};

// ✏️ Update a delivery zone by ID
export const updateDeliveryZone = async (
  zone: Partial<DeliveryZone>,
): Promise<DeliveryZone | null> => {
  console.log("✏️ [Mock] updateDeliveryZone called with:", zone);
  await delay(300);

  if (!zone.id) throw new Error("Zone ID is required");

  const index = mockDeliveryZones.findIndex((z) => z.id === zone.id);
  if (index === -1) throw new Error("Delivery zone not found");

  mockDeliveryZones[index] = {
    ...mockDeliveryZones[index],
    ...zone,
  };

  return mockDeliveryZones[index];
};

// ➕ Create a new delivery zone
export const createDeliveryZone = async (
  zone: NewDeliveryZone,
): Promise<DeliveryZone> => {
  console.log("➕ [Mock] createDeliveryZone called with:", zone);
  await delay(300);

  const newZone: DeliveryZone = {
    id: generateId(),
    name: zone.name,
    fee: zone.fee,
    isActive: zone.isActive ?? true,
  };

  mockDeliveryZones.push(newZone);
  return newZone;
};

// Utility delay to simulate async call
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Utility ID generator
const generateId = () => `zone-${Math.random().toString(36).substring(2, 9)}`;
