
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchSettings, updateSettings } from "@/services/appSettingsService";
import { uploadLogo } from "@/services/logoUploadService";
import { AppSettings } from "@/types/settings";
import { RestaurantBasicInfo } from "./restaurant-info/RestaurantBasicInfo";
import { RestaurantLogo } from "./restaurant-info/RestaurantLogo";
import { DeliverySettings } from "./restaurant-info/DeliverySettings";
import { OrderSettings } from "./restaurant-info/OrderSettings";

export const RestaurantInfoSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSettings();
        if (data) {
          setSettings(data);
        } else {
          // Create default settings if none exist
          const defaultSettings: Partial<AppSettings> = {
            restaurant_name: 'Tasty Bites',
            is_open: true,
            open_time: '09:00',
            close_time: '23:00',
            base_delivery_fee: 2.99,
            fee_per_km: 0.5,
            max_delivery_distance: 10,
            min_order_amount: 10,
            tax_percentage: 10
          };
          const createdSettings = await updateSettings(defaultSettings);
          if (createdSettings) {
            setSettings(createdSettings);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load restaurant settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    
    const { name, value, type } = e.target;
    
    setSettings({
      ...settings,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    });
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [name]: checked
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    try {
      setIsUploadingLogo(true);
      const logoUrl = await uploadLogo(file);
      
      const updatedSettings = await updateSettings({
        ...settings,
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      });
      
      if (updatedSettings) {
        setSettings(updatedSettings);
        toast.success('Logo uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setIsSaving(true);
      const updatedSettings = await updateSettings({
        ...settings,
        updated_at: new Date().toISOString()
      });
      
      if (updatedSettings) {
        setSettings(updatedSettings);
        toast.success('Restaurant settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading restaurant settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Failed to load settings</div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RestaurantBasicInfo 
        settings={settings}
        onInputChange={handleInputChange}
        onSwitchChange={handleSwitchChange}
      />
      
      <RestaurantLogo 
        settings={settings}
        isUploadingLogo={isUploadingLogo}
        onLogoUpload={handleLogoUpload}
      />
      
      <DeliverySettings 
        settings={settings}
        onInputChange={handleInputChange}
      />
      
      <OrderSettings 
        settings={settings}
        onInputChange={handleInputChange}
      />
      
      {/* Save Button */}
      <div className="lg:col-span-2 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || isUploadingLogo}
          className="min-w-32"
        >
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
};
