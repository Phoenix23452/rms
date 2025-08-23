"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  reorderCategory,
} from "./actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CategoryRow } from "@/components/admin/categories/CategoryRow";
import AddCategoryDialog from "@/components/admin/categories/AddCategoryDialog";

export default function CategoriesClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  //   const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");

  const filtered = initialCategories?.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <AddCategoryDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground text-sm">
                <th className="pl-8 pr-4 py-2 font-semibold">Order</th>
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">Slug</th>
                <th className="px-4 py-2 font-semibold">Products</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="pl-4 pr-8 py-2 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onDelete={async () => {
                    await deleteCategory(cat.id);
                    toast("Deleted");
                  }}
                  onSaveEdit={async (data) => {
                    await updateCategory(cat.id, data);
                    toast("Updated");
                  }}
                  onReorder={async (direction) => {
                    await reorderCategory(cat.id, direction);
                    toast("Reordered");
                  }}
                />
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
