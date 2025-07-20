// app/categories/actions.ts
"use server";

import config from "@/lib/config";
import { revalidatePath } from "next/cache";

const API_BASE = config.env.apiEndpoint || "http://localhost:3000";

export async function getCategories() {
  const res = await fetch(
    `${API_BASE}/api/categories?include=_count.products`,
    {
      cache: "no-store",
    },
  );
  const { data } = await res.json();
  return data;
}

export async function addCategory(category: any) {
  await fetch(`${API_BASE}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  revalidatePath("/categories");
}

export async function deleteCategory(id: number) {
  await fetch(`${API_BASE}/api/categories/${id}`, { method: "DELETE" });
  revalidatePath("/categories");
}

export async function updateCategory(id: number, updated: any) {
  await fetch(`${API_BASE}/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  revalidatePath("/categories");
}

export async function reorderCategory(id: number, direction: "up" | "down") {
  await fetch(`${API_BASE}/api/categories/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, direction }),
  });
  revalidatePath("/categories");
}
