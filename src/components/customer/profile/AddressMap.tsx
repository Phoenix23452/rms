import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface AddressMapProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

declare global {
  interface Window {
    google: any; // To avoid TypeScript errors for the Google Maps object
  }
}

export const AddressMap: React.FC<AddressMapProps> = ({
  onLocationSelect,
  selectedLocation,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!googleApiKey || !mapRef.current) return;

    // Load Google Maps API dynamically
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    };

    const initializeMap = () => {
      const google = window.google;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 24.8607, lng: 67.0011 }, // Karachi coordinates
        zoom: 12,
      });

      const mapMarker = new google.maps.Marker({
        map: mapInstance,
        position: { lat: 24.8607, lng: 67.0011 },
        draggable: true,
      });

      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        const { latLng } = e;
        if (latLng) {
          const lat = latLng.lat();
          const lng = latLng.lng();
          mapMarker.setPosition({ lat, lng });
          onLocationSelect(lat, lng);
        }
      });

      setMap(mapInstance);
      setMarker(mapMarker);

      // Add marker if location is already selected
      if (selectedLocation) {
        mapInstance.setCenter({
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        });
        mapMarker.setPosition({
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        });
      }
    };

    loadGoogleMapsScript();

    return () => {
      if (map) {
        google.maps.event.clearInstanceListeners(map);
        setMap(null);
      }
    };
  }, [googleApiKey]);

  const addMarker = (lat: number, lng: number) => {
    if (!map || !marker) return;
    marker.setPosition({ lat, lng });
    map.setCenter({ lat, lng });
  };

  const searchLocation = async () => {
    if (!searchQuery || !googleApiKey) return;

    const geocoder = new window.google.maps.Geocoder();

    try {
      const results = await new Promise<google.maps.GeocoderResult[]>(
        (resolve, reject) => {
          geocoder.geocode(
            { address: searchQuery },
            (results: any, status: any) => {
              if (status === "OK") {
                resolve(results!);
              } else {
                reject("Geocode failed: " + status);
              }
            },
          );
        },
      );

      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        const address = results[0].formatted_address;

        addMarker(lat(), lng());
        onLocationSelect(lat(), lng(), address);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  if (showTokenInput) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
        <MapPin className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Map Integration</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your Google Maps API key to enable map functionality.
          <br />
          Get your key from{" "}
          <a
            href="https://console.cloud.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google Cloud Console
          </a>
        </p>
        <div className="w-full max-w-sm space-y-2">
          <Input
            type="password"
            placeholder="Google Maps API Key"
            value={googleApiKey}
            onChange={(e) => setGoogleApiKey(e.target.value)}
          />
          <Button
            onClick={() => setShowTokenInput(false)}
            disabled={!googleApiKey}
            className="w-full"
          >
            Enable Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="absolute top-2 left-2 right-2 z-10 flex gap-2">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchLocation()}
          className="bg-white shadow-lg"
        />
        <Button onClick={searchLocation} size="sm" className="shadow-lg">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div ref={mapRef} className="w-full h-full" />
      {!selectedLocation && (
        <div className="absolute bottom-2 left-2 right-2 bg-white p-2 rounded shadow-lg text-sm text-center">
          Click on the map to select your location
        </div>
      )}
    </div>
  );
};
