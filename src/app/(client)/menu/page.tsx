// app/Menu/page.tsx

import { useIsMobile } from "@/hooks/use-mobile";
import MenuPage from "./MenuPage";
import { getCategories, getProducts } from "./actions";

export const dynamic = "force-dynamic"; // SSR with auto-updates

export default async function Home() {
  const categories = await getCategories(); // SSR
  const popularProducts = await getProducts(); // SSR
  const { isMobile } = await useIsMobile();

  return (
    <MenuPage
      isMobile={isMobile}
      categories={categories}
      products={popularProducts}
    />
  );
}
