// app/admin/order/page.tsx

import { getOrders } from "./actions";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic"; // SSR with auto-updates

export default async function OrderPage() {
  const orders = await getOrders(); // SSR
  // const categories = await getCategories(); // SSR
  // const deals = await getDeals(); // SSR

  return (
    <OrdersClient
      orders={orders}
      // categories={categories}
      // deals={deals}
    />
  );
}
