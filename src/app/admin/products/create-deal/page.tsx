"use client";
import React, { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProducts } from "../actions";
import { af } from "date-fns/locale";

const useNavigation = () => {
  const router = useRouter();

  const navigation = (path: string) => {
    router.push(path);
  };

  return navigation;
};

type DealItem = {
  productId: number | "";
  quantity: number;
  note: string;
};

type Deal = {
  name: string;
  regularPrice: number;
  offerPrice: number;
  description: string;
  isFeatured: boolean;
  status: boolean;
  availableFrom: string;
  availableUntil: string;
  startDate: string;
  endDate: string;
  availableDays: string[];
  image: string;
  dealItems: DealItem[];
};

const CreateDealPage = () => {
  const navigate = useNavigation();

  const [deal, setDeal] = useState<Deal>({
    name: "",
    regularPrice: 0,
    offerPrice: 0,
    description: "",
    isFeatured: false,
    status: true,
    availableFrom: "10:00",
    availableUntil: "22:00",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    image: "", // optional if you're handling image upload
    dealItems: [],
  });

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const total = deal.dealItems.reduce((acc, item) => {
      const product = availableProducts.find(
        (p: Product) => p.id === item.productId,
      );
      const price = product?.regularPrice || 0;
      return acc + price * item.quantity;
    }, 0);

    setDeal((prev) => ({ ...prev, regularPrice: total }));
  }, [deal.dealItems, availableProducts]);

  // Add new deal item
  const addDealItem = () => {
    const newItem = { productId: 0, quantity: 1, note: "" };
    setDeal((prev) => ({
      ...prev,
      dealItems: [...prev.dealItems, newItem],
    }));
  };

  // Remove deal item by index
  const removeDealItem = (index: number) => {
    setDeal((prev) => ({
      ...prev,
      dealItems: prev.dealItems.filter((_, i) => i !== index),
    }));
  };
  console.log(availableProducts);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Deal to be submitted:", deal);

    // TODO: Call backend API to save the deal
    // await createDeal(deal);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Create Deal</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card>
          <CardHeader d>
            <CardTitle>Deal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Deal Name</Label>
              <Input
                id="name"
                placeholder="Enter deal name"
                value={deal.name}
                onChange={(e) => setDeal({ ...deal, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Regular Price ($)</Label>
                <Input
                  id="price"
                  placeholder={0.0}
                  type="number"
                  step="0.01"
                  value={deal.regularPrice}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerPrice">Offer Price ($)</Label>
                <Input
                  id="offerPrice"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={deal.offerPrice}
                  onChange={(e) =>
                    setDeal({ ...deal, offerPrice: e.target.value })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty if no special offer price
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 ">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={deal.status ? "true" : "false"} // Convert boolean to string for UI
                  onValueChange={(v) =>
                    setDeal({ ...deal, status: v === "true" })
                  } // Convert back to boolean
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter deal description"
                rows={4}
                value={deal.description}
                onChange={(e) =>
                  setDeal({ ...deal, description: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={deal.isFeatured}
                onCheckedChange={(value) =>
                  setDeal({ ...deal, isFeatured: value })
                }
              />
              <Label htmlFor="featured">Mark as Featured Deal</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <div className="mx-auto w-32 h-32 flex items-center justify-center bg-muted rounded-lg mb-4">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag and drop an image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 600 x 400px. Max file size: 5MB
                </p>
                <Button variant="outline" size="sm" className="mx-auto">
                  Browse
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Deal Items</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                addDealItem();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deal.dealItems.map((item: DealItem, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-center border-b border-border pb-4"
                >
                  <div className="col-span-4">
                    <Label htmlFor={`item-${index}`} className="mb-1 block">
                      Item
                    </Label>
                    <Select
                      value={
                        item.productId === "" ? "" : item.productId.toString()
                      }
                      onValueChange={(value) => {
                        const updatedItems = [...deal.dealItems];
                        updatedItems[index].productId =
                          value === "" ? "" : Number(value);
                        setDeal({ ...deal, dealItems: updatedItems });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"0"}>Select Product</SelectItem>
                        {availableProducts?.map((product: Product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name} - ${product.regularPrice.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`} className="mb-1 block">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const updatedItems = [...deal.dealItems];
                        updatedItems[index].quantity = Number(e.target.value);
                        setDeal({ ...deal, dealItems: updatedItems });
                      }}
                    />
                  </div>
                  <div className="col-span-5">
                    <Label htmlFor={`note-${index}`} className="mb-1 block">
                      Note
                    </Label>
                    <Input
                      id={`note-${index}`}
                      placeholder="E.g. size, options"
                      value={item.note || ""}
                      onChange={(e) => {
                        const updatedItems = [...deal.dealItems];
                        updatedItems[index].note = e.target.value;
                        setDeal({ ...deal, dealItems: updatedItems });
                      }}
                    />
                  </div>
                  <div className="col-span-1 flex items-end justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => removeDealItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Deal Total Value:
                  </span>
                  <span className="font-medium">$37.00</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Deal Price:</span>
                  <span className="font-medium">$29.99</span>
                </div>
                <div className="flex justify-between text-sm mt-1 text-green-600">
                  <span>Customer Saving:</span>
                  <span>$7.01 (19% off)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeFrom">Available From</Label>
                  <Input
                    type="time"
                    id="timeFrom"
                    value={deal.availableFrom}
                    onChange={(e) =>
                      setDeal({ ...deal, availableFrom: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeTo">Available Until</Label>
                  <Input
                    type="time"
                    id="timeTo"
                    value={deal.availableUntil}
                    onChange={(e) =>
                      setDeal({ ...deal, availableUntil: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">Start Date</Label>
                  <Input
                    type="date"
                    id="dateFrom"
                    value={deal.startDate}
                    onChange={(e) =>
                      setDeal({ ...deal, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">End Date</Label>
                  <Input
                    type="date"
                    id="dateTo"
                    value={deal.endDate}
                    onChange={(e) =>
                      setDeal({ ...deal, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available Days</Label>
                <div className="grid grid-cols-4 gap-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day}`}
                          checked={deal.availableDays.includes(day)}
                          onCheckedChange={(checked) => {
                            setDeal((prev) => {
                              const updatedDays = checked
                                ? [...prev.availableDays, day]
                                : prev.availableDays.filter((d) => d !== day);
                              return { ...prev, availableDays: updatedDays };
                            });
                          }}
                        />
                        <Label htmlFor={`day-${day}`}>{day}</Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit">Create Deal</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDealPage;
