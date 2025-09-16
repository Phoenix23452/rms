// app/Home/page.tsx

import { useIsMobile } from "@/hooks/use-mobile";
import { getCategories } from "./actions";
import HomePage from "./HomePage";

export const dynamic = "force-dynamic"; // SSR with auto-updates

export default async function Home() {
  const categories = await getCategories(); // SSR
  const { isMobile } = await useIsMobile();

  return <HomePage isMobile={isMobile} categories={categories} />;
}
