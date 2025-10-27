"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const libraries: "places"[] = ["places"];

interface LocationPickerProps {
  onSelect?: (data: { address: string; lat: number; lng: number }) => void;
}

export default function LocationPicker({ onSelect }: LocationPickerProps) {
  // 🟢 Lahore as default center
  const [center, setCenter] = useState({ lat: 31.5204, lng: 74.3587 });
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
      // 1️⃣ Restrict to Pakistan
      autocomplete.setComponentRestrictions({ country: ["pk"] });

      // 2️⃣ Bias results around Lahore (latitude, longitude of Lahore)
      const lahoreBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(31.41, 74.21), // southwest
        new google.maps.LatLng(31.63, 74.4), // northeast
      );
      autocomplete.setBounds(lahoreBounds);
      autocomplete.setOptions({ strictBounds: false }); // allow global fallback
    },
    [],
  );

  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.formatted_address) return;

    const lat = place.geometry.location?.lat();
    const lng = place.geometry.location?.lng();
    const formatted = place.formatted_address;

    if (lat && lng) {
      setCenter({ lat, lng });
      setMarker({ lat, lng });
      setAddress(formatted);
      onSelect?.({ address: formatted, lat, lng });
    }
  }, [onSelect]);

  /** ⚡ Add default Google Maps “Current Location” button */
  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      // Create a custom geolocation control button
      const locationButton = document.createElement("button");
      locationButton.textContent = "📍 My Location";
      locationButton.classList.add(
        "bg-white",
        "border",
        "rounded-lg",
        "shadow-md",
        "px-3",
        "py-1.5",
        "text-sm",
        "cursor-pointer",
        "hover:bg-gray-100",
      );

      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        locationButton,
      );

      locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              map.setCenter(pos);
              map.setZoom(15);
              setMarker(pos);

              // Reverse geocode current location to address
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ location: pos }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                  const addr = results[0].formatted_address;
                  setAddress(addr);
                  onSelect?.({ address: addr, lat: pos.lat, lng: pos.lng });
                }
              });
            },
            () => {
              alert(
                "Unable to retrieve your location. Please allow location access.",
              );
            },
            { enableHighAccuracy: true },
          );
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      });
    },
    [onSelect],
  );

  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );

  return (
    <Card className="w-full  mx-auto">
      <CardContent className="px-4 flex flex-col gap-4">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search for a Address..."
          />
        </Autocomplete>

        <div className="w-full h-[400px] rounded-xl  overflow-hidden border shadow-sm">
          <GoogleMap
            center={center}
            zoom={14}
            onLoad={handleMapLoad}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
        </div>
      </CardContent>
    </Card>
  );
}
