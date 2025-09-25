"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getCategories,
  createProduct,
  getOptionalProducts,
} from "@/app/admin/products/actions";

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: "",
    description: "",
    regularPrice: 0,
    discountPercentage: 0,
    status: true,
    isFeatured: false,
    isOptional: false,
    isPopular: false,
  });

  const [variants, setVariants] = useState([{ name: "Regular", price: 0 }]);

  const [optionalProducts, setOptionalProducts] = useState<Product[]>();
  const [optionalItems, setOptionalItems] = useState<number[]>();
  useEffect(() => {
    getCategories().then((data) => setCategories(data));
    getOptionalProducts().then((data) => setOptionalProducts(data));
  }, []);
  console.log(optionalProducts);
  useEffect(() => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updated = [...variants];
    // @ts-ignore
    updated[index][field] = field === "price" ? parseFloat(value) : value;
    setVariants(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = imagePreview || ""; // fallback if no file chosen

      // Upload if we have a new image file selected
      if (imageFile instanceof File) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });
        console.log("imagedata", uploadRes);

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const payload = {
        ...formData,
        variants,
        optionalItems,
        image: imageUrl,
      };

      const res = await createProduct(payload);
      if (!res.success) throw new Error(res.message || "Creation failed");

      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Error creating product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/products")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Create Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={formData.slug} disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  value={formData.categoryId?.toString() || ""}
                  onValueChange={(val) =>
                    handleChange("categoryId", parseInt(val))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c: Category) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Switch
                  checked={formData.status}
                  onCheckedChange={(val) => handleChange("status", val)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Regular Price</Label>
                <Input
                  type="number"
                  value={formData.regularPrice}
                  onChange={(e) =>
                    handleChange("regularPrice", parseFloat(e.target.value))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    handleChange(
                      "discountPercentage",
                      parseFloat(e.target.value),
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isOptional}
                  onCheckedChange={(val) => handleChange("isOptional", val)}
                />
                <Label>Mark as Optional</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(val) => handleChange("isFeatured", val)}
                />
                <Label>Featured Product</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(val) => handleChange("isPopular", val)}
                />
                <Label>Mark as Popular</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {!formData.isOptional && (
          <Card>
            <CardHeader>
              <CardTitle>Optional Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {optionalProducts?.map((product) => {
                  const isSelected = optionalItems?.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        setOptionalItems((prev: number[] = []) => {
                          if (prev.includes(product.id)) {
                            // remove if already selected
                            return prev.filter((id) => id !== product.id);
                          } else {
                            // add if not selected
                            return [...prev, product.id];
                          }
                        });
                      }}
                      className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center transition
                ${isSelected ? "border-blue-500" : "border-gray-300"}`}
                    >
                      <img
                        src={product.image || ""}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-md mb-2"
                      />
                      <p className="text-sm font-medium text-center">
                        {product.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="mx-auto max-w-xs flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-32 w-32 object-cover rounded-lg mb-4"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" /> Remove Image
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mx-auto w-32 h-32 flex items-center justify-center bg-muted rounded-lg mb-4">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("image-upload")?.click();
                    }}
                  >
                    Browse
                  </Button>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Sizes/Variants</CardTitle>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => setVariants([...variants, { name: "", price: 0 }])}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Size
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.map((variant, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Input
                  value={variant.name}
                  onChange={(e) =>
                    handleVariantChange(i, "name", e.target.value)
                  }
                  placeholder="Size name (e.g. Small)"
                />
                <Input
                  value={variant.price}
                  type="number"
                  onChange={(e) =>
                    handleVariantChange(i, "price", e.target.value)
                  }
                  placeholder="Price"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() =>
                    setVariants(variants.filter((_, idx) => idx !== i))
                  }
                  disabled={variants.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
