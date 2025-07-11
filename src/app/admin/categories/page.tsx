import AddCategoryDialog from "@/components/admin/categories/AddCategoryDialog";
import CategoryTable from "@/components/admin/categories/CategoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import config from "@/lib/config";
import { Search } from "lucide-react";
import React from "react";

// ✅ SSR function to fetch categories from API
const getCategories = async () => {
  const res = await fetch(
    `${config.env.apiEndpoint}/api/categories?include=_count.products`,
    {
      cache: "no-store", // ensures fresh data on each request
    },
  );

  if (!res.ok) throw new Error("Failed to fetch categories");

  const json = await res.json();

  // ✅ map _count.products to productsCount (nullable-safe)
  return json.data.map((category: any) => ({
    ...category,
    productsCount: category._count?.products ?? null,
  }));
};

export default async function CategoryPage() {
  const categories = await getCategories();

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
              // handled inside client component
              readOnly
            />
          </div>
          <AddCategoryDialog categories={categories} />
        </div>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryTable initialCategories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}

// const getCategories = async () => {
//   return [
//     {
//       id: 1,
//       name: "Burgers",
//       slug: "burgers",
//       productsCount: 12,
//       status: "Active",
//       order: 1,
//     },
//     {
//       id: 2,
//       name: "Pizza",
//       slug: "pizza",
//       productsCount: 10,
//       status: "Active",
//       order: 2,
//     },
//     {
//       id: 3,
//       name: "Fish",
//       slug: "fish",
//       productsCount: 8,
//       status: "Active",
//       order: 3,
//     },
//     {
//       id: 4,
//       name: "Chicken",
//       slug: "chicken",
//       productsCount: 15,
//       status: "Active",
//       order: 4,
//     },
//     {
//       id: 5,
//       name: "Sides",
//       slug: "sides",
//       productsCount: 9,
//       status: "Active",
//       order: 5,
//     },
//     {
//       id: 6,
//       name: "Beverages",
//       slug: "beverages",
//       productsCount: 14,
//       status: "Active",
//       order: 6,
//     },
//     {
//       id: 7,
//       name: "Desserts",
//       slug: "desserts",
//       productsCount: 7,
//       status: "Active",
//       order: 7,
//     },
//     {
//       id: 8,
//       name: "Seasonal",
//       slug: "seasonal",
//       productsCount: 4,
//       status: "Inactive",
//       order: 8,
//     },
//   ];
// };
