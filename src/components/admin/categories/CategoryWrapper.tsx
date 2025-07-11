"use client";

import { useEffect, useState, useTransition } from "react";
import AddCategoryDialog from "@/components/admin/categories/AddCategoryDialog";
import CategoryTable from "@/components/admin/categories/CategoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
  status: string;
  order: number;
}

export default function CategoryClientWrapper({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isPending, startTransition] = useTransition();

  const addCategory = async (data: Omit<Category, "id" | "productsCount">) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, order: categories.length }),
      });

      if (!res.ok) throw new Error("Failed to add category");
      const json = await res.json();

      toast.success("Category added");

      // Append new category locally
      startTransition(() => {
        setCategories((prev) => [...prev, json.data]);
      });
    } catch (err) {
      toast.error("Failed to add category");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-8 w-full sm:w-auto"
              readOnly
            />
          </div>
          <AddCategoryDialog onAddCategory={addCategory} />
        </div>                                  
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryTable
            categories={categories}
            setCategories={setCategories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
