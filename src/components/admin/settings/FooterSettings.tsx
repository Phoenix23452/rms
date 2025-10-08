import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
// import { supabase } from "@/integrations/supabase/client";

interface FooterData {
  about_text: string;
  social_media: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  quick_links: Array<{
    href: string;
    label: string;
  }>;
}

const defaultFooterData: FooterData = {
  about_text:
    "Experience authentic flavors crafted with passion. Our restaurant brings you carefully selected ingredients transformed into memorable culinary experiences.",
  social_media: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
  },
  quick_links: [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/reservation", label: "Reservation" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/profile", label: "My Account" },
    { href: "/cart", label: "Cart" },
  ],
};

export const FooterSettings: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newLink, setNewLink] = useState({ href: "", label: "" });
  const [settingsId, setSettingsId] = useState<string | null>(null);

  let supabase;
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setIsLoading(true);
        // Use any type to bypass TypeScript validation since footer_data exists in DB but not in types
        const { data, error } = await (supabase as any)
          .from("settings")
          .select("id, footer_data")
          .single();

        if (error) {
          console.error("Error fetching footer data:", error);
          return;
        }

        if (data) {
          setSettingsId(data.id);
          if (data.footer_data) {
            setFooterData(data.footer_data as FooterData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const handleAboutTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFooterData((prev) => ({ ...prev, about_text: e.target.value }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFooterData((prev) => ({
      ...prev,
      social_media: { ...prev.social_media, [name]: value },
    }));
  };

  const handleNewLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLink((prev) => ({ ...prev, [name]: value }));
  };

  const addQuickLink = () => {
    if (!newLink.href || !newLink.label) {
      toast.error("Please enter both URL and label for the quick link");
      return;
    }

    setFooterData((prev) => ({
      ...prev,
      quick_links: [...prev.quick_links, { ...newLink }],
    }));

    setNewLink({ href: "", label: "" });
  };

  const removeQuickLink = (index: number) => {
    setFooterData((prev) => ({
      ...prev,
      quick_links: prev.quick_links.filter((_, i) => i !== index),
    }));
  };

  const saveFooterData = async () => {
    if (!settingsId) {
      toast.error("Settings not found");
      return;
    }

    try {
      setIsSaving(true);

      // Use any type to bypass TypeScript validation
      const { error } = await (supabase as any)
        .from("settings")
        .update({ footer_data: footerData })
        .eq("id", settingsId);

      if (error) {
        throw error;
      }

      toast.success("Footer settings saved successfully");
    } catch (error) {
      console.error("Error saving footer data:", error);
      toast.error("Failed to save footer settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Footer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About Text</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="links">Quick Links</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_text">About Text</Label>
                <Textarea
                  id="about_text"
                  value={footerData.about_text}
                  onChange={handleAboutTextChange}
                  rows={5}
                />
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={footerData.social_media.facebook}
                    onChange={handleSocialMediaChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={footerData.social_media.twitter}
                    onChange={handleSocialMediaChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={footerData.social_media.instagram}
                    onChange={handleSocialMediaChange}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {footerData.quick_links.map((link, index) => (
                    <div
                      key={index}
                      className="p-2 border rounded-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{link.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {link.href}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuickLink(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">
                    Add New Quick Link
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="space-y-1">
                      <Label htmlFor="label" className="text-xs">
                        Link Label
                      </Label>
                      <Input
                        id="label"
                        name="label"
                        value={newLink.label}
                        onChange={handleNewLinkChange}
                        placeholder="e.g., About Us"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="href" className="text-xs">
                        Link URL
                      </Label>
                      <Input
                        id="href"
                        name="href"
                        value={newLink.href}
                        onChange={handleNewLinkChange}
                        placeholder="e.g., /about"
                      />
                    </div>
                  </div>
                  <Button onClick={addQuickLink} size="sm">
                    Add Link
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={saveFooterData} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Footer Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
