
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash, Pencil, Image as ImageIcon, Link2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { fetchSliderImages, SliderImage, createSliderImage, updateSliderImage, deleteSliderImage, uploadSliderImage } from "@/services/sliderService";

export const SliderManager: React.FC = () => {
  const [sliderType, setSliderType] = useState<'menu' | 'home' | 'about'>('menu');
  const [images, setImages] = useState<SliderImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    is_active: true,
    button_text: '',
    button_link: '',
    type: sliderType
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [sliderType]);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSliderImages(sliderType);
      setImages(data);
    } catch (error) {
      console.error('Error fetching slider images:', error);
      toast.error("Failed to load slider images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (value: string) => {
    setSliderType(value as 'menu' | 'home' | 'about');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      is_active: true,
      button_text: '',
      button_link: '',
      type: sliderType
    });
    setEditingImage(null);
    setFile(null);
    setPreviewUrl(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleEditImage = (image: SliderImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      image_url: image.image_url,
      is_active: image.is_active,
      button_text: image.button_text || '',
      button_link: image.button_link || '',
      type: image.type
    });
    setPreviewUrl(image.image_url);
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this slider image?")) {
      try {
        const success = await deleteSliderImage(id);
        if (success) {
          toast.success("Slider image deleted successfully");
          fetchImages();
        } else {
          toast.error("Failed to delete slider image");
        }
      } catch (error) {
        console.error('Error deleting slider image:', error);
        toast.error("An error occurred while deleting the slider image");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      // If a new file is selected, upload it
      if (file) {
        const uploadedUrl = await uploadSliderImage(file, sliderType);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast.error("Failed to upload image");
          setIsSubmitting(false);
          return;
        }
      }

      const sliderData = {
        ...formData,
        image_url: imageUrl,
        type: sliderType
      };

      let result;
      
      if (editingImage) {
        // Update existing slider
        result = await updateSliderImage(editingImage.id, sliderData);
        if (result) {
          toast.success("Slider image updated successfully");
        }
      } else {
        // Create new slider
        result = await createSliderImage(sliderData);
        if (result) {
          toast.success("Slider image created successfully");
        }
      }

      fetchImages();
      resetForm();
    } catch (error) {
      console.error('Error saving slider image:', error);
      toast.error("Failed to save slider image");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Slider Management</h2>
        <Tabs defaultValue="menu" onValueChange={handleTypeChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="menu">Menu Sliders</TabsTrigger>
            <TabsTrigger value="home">Home Sliders</TabsTrigger>
            <TabsTrigger value="about">About Sliders</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Side */}
            <Card>
              <CardHeader>
                <CardTitle>{editingImage ? 'Edit Slider Image' : 'Add New Slider Image'}</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {/* Preview */}
                  {previewUrl && (
                    <div className="rounded-md overflow-hidden mb-4 h-48 bg-muted">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Slider Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      {formData.image_url && !file && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => window.open(formData.image_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Recommended size: 1200 x 400 pixels
                    </p>
                  </div>
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  {/* Button Text */}
                  <div className="space-y-2">
                    <Label htmlFor="button_text">Button Text (optional)</Label>
                    <Input
                      id="button_text"
                      name="button_text"
                      value={formData.button_text}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  {/* Button Link */}
                  <div className="space-y-2">
                    <Label htmlFor="button_link">Button Link (optional)</Label>
                    <Input
                      id="button_link"
                      name="button_link"
                      value={formData.button_link}
                      onChange={handleInputChange}
                      placeholder="e.g., /menu or #section"
                    />
                  </div>
                  
                  {/* Is Active */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_active">Active</Label>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingImage ? "Update Slider" : "Add Slider"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* List Side */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{sliderType} Slider Images</h3>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : images.length > 0 ? (
                <div className="grid gap-4">
                  {images.map(image => (
                    <Card key={image.id} className={!image.is_active ? "opacity-60" : ""}>
                      <div className="flex h-32">
                        <div className="w-1/3 h-full">
                          <img 
                            src={image.image_url} 
                            alt={image.title} 
                            className="h-full w-full object-cover rounded-l-md"
                          />
                        </div>
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                          <div>
                            <h4 className="font-medium text-base">{image.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                              {image.description}
                            </p>
                            {!image.is_active && (
                              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditImage(image)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteImage(image.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No slider images found.</p>
                  <p className="text-sm text-muted-foreground">Create your first slider image using the form.</p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
