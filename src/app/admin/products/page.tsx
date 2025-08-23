// app/admin/product/page.tsx

import { getCategories, getProducts } from "./actions";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic"; // SSR with auto-updates

export default async function CategoriesPage() {
  const products = await getProducts(); // SSR
  const categories = await getCategories(); // SSR

  return <ProductsClient initialProducts={products} categories={categories} />;
}
