"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  SearchIcon,
  FilterIcon,
  PlusIcon,
  Edit,
  Trash,
  Camera,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "./actions";

// Mock data for products
const products = [
  {
    id: 1,
    name: "Chicken Burger",
    slug: "chicken-burger",
    category: "Burgers",
    status: "Active",
    price: 8.5,
    offerPrice: null,
    isPopular: true,
    thumbnail: "https://placehold.co/100x100",
    variants: [
      { size: "Regular", price: 8.5 },
      { size: "Large", price: 10.5 },
    ],
    description:
      "Juicy chicken patty with fresh lettuce, tomato, and our special sauce on a toasted bun.",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    slug: "margherita-pizza",
    category: "Pizza",
    status: "Active",
    price: 11.99,
    offerPrice: 9.99,
    isPopular: true,
    thumbnail: "https://placehold.co/100x100",
    variants: [
      { size: "Small", price: 11.99 },
      { size: "Medium", price: 14.99 },
      { size: "Large", price: 17.99 },
    ],
    description:
      "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil.",
  },
  {
    id: 3,
    name: "Grilled Fish",
    slug: "grilled-fish",
    category: "Fish",
    status: "Active",
    price: 12.5,
    offerPrice: null,
    isPopular: false,
    thumbnail: "https://placehold.co/100x100",
    variants: [{ size: "Regular", price: 12.5 }],
    description:
      "Fresh fish fillet grilled to perfection, served with a side of vegetables and lemon.",
  },
  {
    id: 4,
    name: "Chocolate Milkshake",
    slug: "chocolate-milkshake",
    category: "Beverages",
    status: "Active",
    price: 4.5,
    offerPrice: null,
    isPopular: false,
    thumbnail: "https://placehold.co/100x100",
    variants: [
      { size: "Small", price: 4.5 },
      { size: "Regular", price: 5.5 },
      { size: "Large", price: 6.5 },
    ],
    description:
      "Rich and creamy chocolate milkshake topped with whipped cream.",
  },
  {
    id: 5,
    name: "French Fries",
    slug: "french-fries",
    category: "Sides",
    status: "Active",
    price: 3.5,
    offerPrice: null,
    isPopular: true,
    thumbnail: "https://placehold.co/100x100",
    variants: [
      { size: "Small", price: 3.5 },
      { size: "Medium", price: 4.5 },
      { size: "Large", price: 5.5 },
    ],
    description: "Crispy golden fries served with ketchup.",
  },
];

// Mock data for deals
const deals = [
  {
    id: 1,
    name: "Family Feast",
    price: 35.99,
    offerPrice: 29.99,
    status: "Active",
    thumbnail: "https://placehold.co/100x100",
    items: [
      "2x Large Pizzas",
      "1x Garlic Bread",
      "1x 2L Soft Drink",
      "1x Large Fries",
    ],
    description:
      "The perfect meal for the whole family! Includes two large pizzas of your choice, garlic bread, soft drink, and fries.",
  },
  {
    id: 2,
    name: "Burger Combo",
    price: 12.99,
    offerPrice: 10.99,
    status: "Active",
    thumbnail: "https://placehold.co/100x100",
    items: ["1x Chicken Burger", "1x Medium Fries", "1x Medium Soft Drink"],
    description:
      "Our popular chicken burger with medium fries and a soft drink of your choice.",
  },
  {
    id: 3,
    name: "Weekend Special",
    price: 24.99,
    offerPrice: null,
    status: "Inactive",
    thumbnail: "https://placehold.co/100x100",
    items: [
      "1x Medium Pizza",
      "1x Garlic Bread",
      "2x Regular Fries",
      "2x Regular Soft Drinks",
    ],
    description:
      "Perfect for a weekend treat. Medium pizza with garlic bread, fries, and drinks.",
  },
];

// Available product categories

const ProductsClient = ({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [editedProduct, setEditedProduct] = useState<any>(null);

  // Filter products based on search query and category
  const filteredProducts = initialProducts?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category?.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter deals based on search query
  const filteredDeals = deals.filter((deal) => {
    return deal.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleEditProduct = (product: any) => {
    setCurrentProduct(product);
    setEditedProduct({ ...product }); // Create a copy to edit
    setEditDialogOpen(true);
    console.log(editedProduct);
  };

  const handleDeleteProduct = (product: any) => {
    setCurrentProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editedProduct) return;

    // In a real application, we would make an API call here
    // For now, we'll just update the product in our local array
    const index = products.findIndex((p) => p.id === editedProduct.id);
    if (index !== -1) {
      products[index] = { ...editedProduct };
    }

    setEditDialogOpen(false);
    toast({
      title: "Product Updated",
      description: `${editedProduct.name} has been updated successfully.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!currentProduct) return;

    // In a real application, we would make an API call here
    // For now, we'll just remove the product from our local array
    const index = products.findIndex((p) => p.id === currentProduct.id);
    if (index !== -1) {
      products.splice(index, 1);
    }

    setDeleteDialogOpen(false);
    toast({
      title: "Product Deleted",
      description: `${currentProduct.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload
    if (e.target.files && e.target.files[0]) {
      // In a real application, we would upload the file to a server and get a URL back
      // For now, we'll just use a placeholder
      setEditedProduct({
        ...editedProduct,
        thumbnail: URL.createObjectURL(e.target.files[0]),
      });

      toast({
        title: "Image Updated",
        description: "Product image has been updated. Save changes to apply.",
      });
    }
  };

  const updateProductField = (field: string, value: any) => {
    setEditedProduct({
      ...editedProduct,
      [field]: value,
    });
  };

  const updateVariantField = (index: number, field: string, value: any) => {
    const updatedVariants = [...editedProduct.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === "price" ? parseFloat(value) : value,
    };

    setEditedProduct({
      ...editedProduct,
      variants: updatedVariants,
    });
  };

  const addVariant = () => {
    const newVariant = { size: "New Size", price: 0 };
    setEditedProduct({
      ...editedProduct,
      variants: [...editedProduct.variants, newVariant],
    });
  };

  const removeVariant = (index: number) => {
    const updatedVariants = [...editedProduct.variants];
    updatedVariants.splice(index, 1);

    setEditedProduct({
      ...editedProduct,
      variants: updatedVariants,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/admin/products/create")}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/products/create-deal")}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="products"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab}...`}
                className="pl-8 w-full sm:w-[260px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === "products" && (
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="products" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border text-sm text-muted-foreground">
                      <th className="py-3 px-4 text-left font-medium">
                        Product
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Category
                      </th>
                      <th className="py-3 px-4 text-left font-medium">Price</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Variants
                      </th>
                      <th className="py-3 px-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts?.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-md object-cover mr-3"
                              />
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {product.slug}
                                </div>
                                {product.isPopular && (
                                  <Badge
                                    variant="secondary"
                                    className="mt-1 text-xs bg-rose-100 text-rose-800 hover:bg-rose-100"
                                  >
                                    Popular
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">
                              {product.category?.name}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {product.discountPercentage ? (
                              <div>
                                <span className="font-medium">
                                  ${product.discountPercentage.toFixed(2)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  ${product.regularPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium">
                                ${product.regularPrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                product.status
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }
                            >
                              {product.status ? "Active" : "InActive"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {product.variants?.map((variant, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-secondary px-2 py-1 rounded-full"
                                >
                                  {variant.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No products found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border text-sm text-muted-foreground">
                      <th className="py-3 px-4 text-left font-medium">Deal</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Items Included
                      </th>
                      <th className="py-3 px-4 text-left font-medium">Price</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Status
                      </th>
                      <th className="py-3 px-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.length > 0 ? (
                      filteredDeals.map((deal) => (
                        <tr
                          key={deal.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img
                                src={deal.thumbnail}
                                alt={deal.name}
                                className="h-12 w-12 rounded-md object-cover mr-3"
                              />
                              <div className="font-medium">{deal.name}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                            >
                              {deal.items.length} items
                              <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                          </td>
                          <td className="py-3 px-4">
                            {deal.offerPrice ? (
                              <div>
                                <span className="font-medium">
                                  ${deal.offerPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  ${deal.price.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium">
                                ${deal.price.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                deal.status === "Active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }
                            >
                              {deal.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No deals found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          {editedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-start gap-4">
                  <div className="relative group">
                    <img
                      src={editedProduct.image}
                      alt={editedProduct.name}
                      className="h-24 w-24 rounded-md object-cover border"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-md">
                      <Label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer flex flex-col items-center justify-center text-white"
                      >
                        <Camera className="h-6 w-6" />
                        <span className="text-xs">Change</span>
                      </Label>
                      <Input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="product-name">Name</Label>
                    <Input
                      id="product-name"
                      value={editedProduct.name}
                      onChange={(e) =>
                        updateProductField("name", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={editedProduct.description || ""}
                    onChange={(e) =>
                      updateProductField("description", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <Select
                    value={editedProduct.category.slug}
                    onValueChange={(selectedSlug) => {
                      const selectedCategory = categories.find(
                        (cat) => cat.slug === selectedSlug,
                      );
                      updateProductField("category", selectedCategory); // You can also just pass selectedCategory.id
                      console.log(editedProduct.category);
                    }}
                  >
                    <SelectTrigger id="product-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.name !== "All Categories")
                        .map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="product-status">Status</Label>
                  <Select
                    value={editedProduct.status}
                    onValueChange={(value) =>
                      updateProductField("status", value)
                    }
                  >
                    <SelectTrigger id="product-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="product-price">Regular Price ($)</Label>
                    <Input
                      id="product-price"
                      type="number"
                      step="0.01"
                      value={editedProduct.regularPrice}
                      onChange={(e) =>
                        updateProductField("price", parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="product-offer-price">
                      Discount Percentage ($)
                    </Label>
                    <Input
                      id="product-offer-price"
                      type="number"
                      step="0.01"
                      value={editedProduct.discountPercentage || ""}
                      onChange={(e) =>
                        updateProductField(
                          "offerPrice",
                          e.target.value ? parseFloat(e.target.value) : null,
                        )
                      }
                      placeholder="No offer"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="product-popular"
                    checked={editedProduct.isPopular}
                    onChange={(e) =>
                      updateProductField("isPopular", e.target.checked)
                    }
                  />
                  <Label htmlFor="product-popular">Mark as popular</Label>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Product Variants</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addVariant}
                    >
                      <PlusIcon className="h-4 w-4 mr-1" /> Add Variant
                    </Button>
                  </div>

                  {editedProduct.variants.map((variant: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        placeholder="Size/Variant"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariantField(index, "size", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Price ($)"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariantField(index, "price", e.target.value)
                        }
                        className="w-20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {currentProduct?.name}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsClient;
