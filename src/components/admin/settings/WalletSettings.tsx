import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  fetchWalletSettings,
  updateWalletSettings,
} from "@/services/walletSettingsService";
// import { WalletSettings as WalletSettingsType } from "@/types/settings";

export const WalletSettings: React.FC = () => {
  const [settings, setSettings] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWalletSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error loading wallet settings:", error);
        toast.error("Failed to load wallet settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;

    const { name, value, type } = e.target;

    setSettings({
      ...settings,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    if (!settings) return;

    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      const updatedSettings = await updateWalletSettings(settings);

      if (updatedSettings) {
        setSettings(updatedSettings);
        toast.success("Wallet settings saved successfully");
      }
    } catch (error) {
      console.error("Error saving wallet settings:", error);
      toast.error("Failed to save wallet settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading wallet settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">No wallet settings found</div>
        <p className="text-muted-foreground">
          Wallet settings need to be configured by a system administrator.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet System Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Enable/Disable */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable_wallet">Enable Wallet System</Label>
              <Switch
                id="enable_wallet"
                checked={settings.enable_wallet || false}
                onCheckedChange={handleSwitchChange("enable_wallet")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enable_wallet_payment">
                Allow Wallet Payments
              </Label>
              <Switch
                id="enable_wallet_payment"
                checked={settings.enable_wallet_payment || false}
                onCheckedChange={handleSwitchChange("enable_wallet_payment")}
              />
            </div>
          </div>

          {/* Deposit Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="min_deposit_amount">
                Minimum Deposit Amount ($)
              </Label>
              <Input
                id="min_deposit_amount"
                name="min_deposit_amount"
                type="number"
                value={settings.min_deposit_amount || 0}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="5.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_deposit_amount">
                Maximum Deposit Amount ($)
              </Label>
              <Input
                id="max_deposit_amount"
                name="max_deposit_amount"
                type="number"
                value={settings.max_deposit_amount || 0}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="500.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit_processing_fee">
                Deposit Processing Fee ($)
              </Label>
              <Input
                id="deposit_processing_fee"
                name="deposit_processing_fee"
                type="number"
                value={settings.deposit_processing_fee || 0}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto"
          >
            {isSaving ? "Saving..." : "Save Wallet Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
