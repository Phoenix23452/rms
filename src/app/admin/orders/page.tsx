// app/admin/order/page.tsx

import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic"; // SSR with auto-updates

export default async function OrderPage() {
  // const products = await getProducts(); // SSR
  // const categories = await getCategories(); // SSR
  // const deals = await getDeals(); // SSR

  return (
    <OrdersClient
    // initialProducts={products}
    // categories={categories}
    // deals={deals}
    />
  );
}
