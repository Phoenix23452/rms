
import { useState, useEffect } from "react";

export type OpeningHoursType = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type LocationType = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isMain: boolean;
  openingHours: OpeningHoursType[];
};

// Mock data for initial locations
const initialLocations: LocationType[] = [
  {
    id: 1,
    name: "Downtown Branch",
    address: "123 Main St, Downtown, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "downtown@tastybites.com",
    isMain: true,
    openingHours: [
      { day: "Monday", open: "09:00", close: "22:00", closed: false },
      { day: "Tuesday", open: "09:00", close: "22:00", closed: false },
      { day: "Wednesday", open: "09:00", close: "22:00", closed: false },
      { day: "Thursday", open: "09:00", close: "22:00", closed: false },
      { day: "Friday", open: "09:00", close: "23:00", closed: false },
      { day: "Saturday", open: "10:00", close: "23:00", closed: false },
      { day: "Sunday", open: "10:00", close: "21:00", closed: false },
    ]
  },
  {
    id: 2,
    name: "Uptown Branch",
    address: "456 Park Avenue, Uptown, NY 10022",
    phone: "+1 (555) 234-5678",
    email: "uptown@tastybites.com",
    isMain: false,
    openingHours: [
      { day: "Monday", open: "10:00", close: "21:00", closed: false },
      { day: "Tuesday", open: "10:00", close: "21:00", closed: false },
      { day: "Wednesday", open: "10:00", close: "21:00", closed: false },
      { day: "Thursday", open: "10:00", close: "21:00", closed: false },
      { day: "Friday", open: "10:00", close: "22:00", closed: false },
      { day: "Saturday", open: "10:00", close: "22:00", closed: false },
      { day: "Sunday", open: "11:00", close: "20:00", closed: false },
    ]
  }
];

/**
 * Hook for managing restaurant locations with CRUD operations
 */
export const useLocations = () => {
  // Load locations from local storage or use initial data
  const [locations, setLocations] = useState<LocationType[]>(() => {
    const savedLocations = localStorage.getItem('restaurant-locations');
    return savedLocations ? JSON.parse(savedLocations) : initialLocations;
  });

  // Current selected location
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);

  // Get main location
  const mainLocation = locations.find(loc => loc.isMain) || locations[0];

  // Save locations to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('restaurant-locations', JSON.stringify(locations));
    
    // If no current location is selected, default to main location
    if (!currentLocation) {
      setCurrentLocation(mainLocation);
    }
  }, [locations, mainLocation]);

  // Add a new location
  const addLocation = (locationData: Omit<LocationType, "id">): LocationType => {
    const newLocation = {
      ...locationData,
      id: Math.max(0, ...locations.map(l => l.id)) + 1
    };
    
    setLocations(prev => [...prev, newLocation]);
    return newLocation;
  };

  // Update an existing location
  const updateLocation = (locationId: number, locationData: Partial<LocationType>) => {
    setLocations(prev => 
      prev.map(loc => 
        loc.id === locationId ? { ...loc, ...locationData } : loc
      )
    );
    
    // Update current location if it's the one being modified
    if (currentLocation?.id === locationId) {
      setCurrentLocation(prev => prev ? { ...prev, ...locationData } : prev);
    }
  };

  // Delete a location
  const deleteLocation = (locationId: number) => {
    // Don't allow deleting if it's the only location
    if (locations.length <= 1) {
      return false;
    }
    
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    
    // If the current location is deleted, switch to main
    if (currentLocation?.id === locationId) {
      setCurrentLocation(mainLocation);
    }
    
    return true;
  };

  // Set a location as the main location
  const setMainLocation = (locationId: number) => {
    setLocations(prev => 
      prev.map(loc => ({
        ...loc,
        isMain: loc.id === locationId
      }))
    );
  };

  // Update opening hours for a location
  const updateOpeningHours = (locationId: number, dayIndex: number, field: keyof OpeningHoursType, value: any) => {
    setLocations(prev => 
      prev.map(loc => {
        if (loc.id === locationId) {
          const updatedHours = [...loc.openingHours];
          updatedHours[dayIndex] = { 
            ...updatedHours[dayIndex], 
            [field]: value 
          };
          return { ...loc, openingHours: updatedHours };
        }
        return loc;
      })
    );
    
    // Update current location if needed
    if (currentLocation?.id === locationId) {
      const updatedHours = [...currentLocation.openingHours];
      updatedHours[dayIndex] = { 
        ...updatedHours[dayIndex], 
        [field]: value 
      };
      setCurrentLocation({ ...currentLocation, openingHours: updatedHours });
    }
  };

  return {
    locations,
    mainLocation,
    currentLocation,
    setCurrentLocation,
    addLocation,
    updateLocation,
    deleteLocation,
    setMainLocation,
    updateOpeningHours
  };
};

export default useLocations;
