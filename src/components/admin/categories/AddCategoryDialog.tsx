"use client";

import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AddCategoryDialog({ categories }: { categories: any }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    order: 0,
    status: true,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await onAddCategory(category);
    console.log("New Category:", category);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(category),
      });

      if (!res.ok) throw new Error("Failed to create category");

      const { data } = await res.json();
      toast.success("Category created!");

      // Optionally: update parent state or reload
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter category name"
              value={category.name}
              onChange={(e) =>
                setCategory((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={category.slug}
              onChange={(e) =>
                setCategory((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={category.status}
              onCheckedChange={(checked) =>
                setCategory((prev) => ({ ...prev, status: checked }))
              }
            />
            <Label htmlFor="status">Active</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
