
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface AddressMapProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

export const AddressMap: React.FC<AddressMapProps> = ({
  onLocationSelect,
  selectedLocation,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!mapboxToken || !mapRef.current) return;

    // Initialize Mapbox map
    const initializeMap = async () => {
      try {
        const mapboxgl = await import('mapbox-gl');
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        mapboxgl.default.accessToken = mapboxToken;
        
        const mapInstance = new mapboxgl.default.Map({
          container: mapRef.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [67.0011, 24.8607], // Karachi coordinates
          zoom: 12,
        });

        mapInstance.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          addMarker(lat, lng);
          onLocationSelect(lat, lng);
        });

        setMap(mapInstance);
        setShowTokenInput(false);

        // Add marker if location is already selected
        if (selectedLocation) {
          mapInstance.on('load', () => {
            addMarker(selectedLocation.lat, selectedLocation.lng);
            mapInstance.setCenter([selectedLocation.lng, selectedLocation.lat]);
          });
        }

      } catch (error) {
        console.error('Error loading Mapbox:', error);
      }
    };

    initializeMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapboxToken]);

  const addMarker = (lat: number, lng: number) => {
    if (!map) return;

    // Remove existing marker
    if (marker) {
      marker.remove();
    }

    // Add new marker
    const mapboxgl = require('mapbox-gl');
    const newMarker = new mapboxgl.Marker({ color: '#ef4444' })
      .setLngLat([lng, lat])
      .addTo(map);

    setMarker(newMarker);
  };

  const searchLocation = async () => {
    if (!searchQuery || !mapboxToken) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxToken}&country=PK&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const address = data.features[0].place_name;
        
        if (map) {
          map.setCenter([lng, lat]);
          map.setZoom(15);
          addMarker(lat, lng);
          onLocationSelect(lat, lng, address);
        }
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  if (showTokenInput) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4">
        <MapPin className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Map Integration</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your Mapbox public token to enable map functionality.
          <br />
          Get your token from{" "}
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="w-full max-w-sm space-y-2">
          <Input
            type="password"
            placeholder="Mapbox Public Token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button 
            onClick={() => setShowTokenInput(false)} 
            disabled={!mapboxToken}
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
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
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
