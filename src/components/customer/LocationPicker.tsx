"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Locate } from "lucide-react";

const libraries: "places"[] = ["places"];

interface LocationPickerProps {
  onSelect?: (data: { address: string; lat: number; lng: number }) => void;
}

export default function LocationPicker({ onSelect }: LocationPickerProps) {
  const [center, setCenter] = useState({ lat: 31.5204, lng: 74.3587 }); // Lahore default
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [address, setAddress] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  /** Restrict Autocomplete to Pakistan & bias to Lahore */
  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
      autocomplete.setComponentRestrictions({ country: ["pk"] });
      const lahoreBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(31.41, 74.21),
        new google.maps.LatLng(31.63, 74.4),
      );
      autocomplete.setBounds(lahoreBounds);
    },
    [],
  );

  /** When user selects a place */
  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.formatted_address) return;

    const lat = place.geometry.location?.lat();
    const lng = place.geometry.location?.lng();
    if (!lat || !lng) return;

    const pos = { lat, lng };
    setCenter(pos);
    setMarker(pos);
    setAddress(place.formatted_address);
    onSelect?.({ address: place.formatted_address, lat, lng });
  }, [onSelect]);

  /** Store the map instance */
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  /** Center on user location (used for both auto & button click) */
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(pos);
        setMarker(pos);
        mapRef.current?.panTo(pos);
        mapRef.current?.setZoom(15);

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const addr = results[0].formatted_address;
            setAddress(addr);
            onSelect?.({ address: addr, lat: pos.lat, lng: pos.lng });
          }
        });
      },
      () => alert("Please enable location access."),
      { enableHighAccuracy: true },
    );
  }, [onSelect]);

  /** Auto-detect on first load */
  useEffect(() => {
    locateUser();
  }, [locateUser]);

  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );

  return (
    <Card className="w-full mx-auto">
      <CardContent className="px-4 flex flex-col gap-4">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search for an address..."
          />
        </Autocomplete>

        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border shadow-sm">
          <GoogleMap
            center={center}
            zoom={14}
            onLoad={handleMapLoad}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>

          {/* 📍 My Location button rendered via JSX */}
          <div className="absolute bottom-[40%] right-2.5">
            <Button
              variant="secondary"
              className="shadow-md rounded-full size-10  bg-white hover:bg-gray-100"
              onClick={locateUser}
            >
              <Locate className="w-8 h-8 text-gray-700" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
