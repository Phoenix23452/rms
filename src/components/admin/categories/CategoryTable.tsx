"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CategoryRow } from "./CategoryRow";

interface Category {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
  status: string;
  order: number;
}

export default function CategoryTable({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSaveEdit = (id: number, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updated } : cat)),
    );
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <div className="overflow-x-auto">
      <Input
        placeholder="Search categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border text-sm text-muted-foreground">
            <th className="py-3 px-4 text-left font-medium">Order</th>
            <th className="py-3 px-4 text-left font-medium">Name</th>
            <th className="py-3 px-4 text-left font-medium">Slug</th>
            <th className="py-3 px-4 text-left font-medium">Products</th>
            <th className="py-3 px-4 text-left font-medium">Status</th>
            <th className="py-3 px-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length ? (
            filteredCategories.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                isEditing={editingId === cat.id}
                onStartEdit={() => setEditingId(cat.id)}
                onCancelEdit={() => setEditingId(null)}
                onSaveEdit={handleSaveEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="py-6 text-center text-muted-foreground"
              >
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
