
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSettings } from "@/types/settings";

interface RestaurantLogoProps {
  settings: AppSettings;
  isUploadingLogo: boolean;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RestaurantLogo: React.FC<RestaurantLogoProps> = ({
  settings,
  isUploadingLogo,
  onLogoUpload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurant Logo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-square w-32 h-32 bg-muted rounded-md overflow-hidden flex items-center justify-center mx-auto mb-4">
          {settings.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt="Restaurant Logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground text-center p-4 text-sm">
              No logo uploaded
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo_upload">Upload Logo</Label>
          <Input
            id="logo_upload"
            type="file"
            accept="image/*"
            onChange={onLogoUpload}
            disabled={isUploadingLogo}
          />
          {isUploadingLogo && (
            <p className="text-sm text-muted-foreground">Uploading logo...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
