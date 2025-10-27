// app/checkout/actions.ts
"use server";

import config from "@/lib/config";
import { revalidatePath } from "next/cache";

const API_BASE = config.env.apiEndpoint || "http://localhost:3000";

export async function addOrder(order: CreateOrderDto) {
  await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  revalidatePath("/orders");
}
