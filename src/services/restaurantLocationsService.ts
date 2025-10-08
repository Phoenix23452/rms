// Dummy types for restaurant locations
export interface RestaurantLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface NewRestaurantLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone?: string;
}

// In-memory dummy data store
let restaurantLocations: RestaurantLocation[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const generateId = () => Math.random().toString(36).substring(2, 10);
const nowISO = () => new Date().toISOString();

export const fetchRestaurantLocations = async (): Promise<
  RestaurantLocation[]
> => {
  await delay(50);
  return [...restaurantLocations].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
};

export const updateRestaurantLocation = async (
  location: Partial<RestaurantLocation>,
): Promise<RestaurantLocation | null> => {
  await delay(50);

  if (!location.id) throw new Error("Location ID is required");

  const index = restaurantLocations.findIndex((loc) => loc.id === location.id);
  if (index === -1) return null;

  restaurantLocations[index] = {
    ...restaurantLocations[index],
    ...location,
    updated_at: nowISO(),
  };

  return restaurantLocations[index];
};

export const createRestaurantLocation = async (
  location: NewRestaurantLocation,
): Promise<RestaurantLocation> => {
  await delay(50);

  const newLocation: RestaurantLocation = {
    ...location,
    id: generateId(),
    created_at: nowISO(),
    updated_at: nowISO(),
  };

  restaurantLocations.push(newLocation);

  return newLocation;
};
