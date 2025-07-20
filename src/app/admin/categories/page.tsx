// app/categories/page.tsx

import { getCategories } from "./actions";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic"; // SSR with auto-updates

export default async function CategoriesPage() {
  const categories = await getCategories(); // SSR

  return <CategoriesClient initialCategories={categories} />;
}
