// app/products/actions.ts
"use server";

import config from "@/lib/config";
import { revalidatePath } from "next/cache";

const API_BASE = config.env.apiEndpoint || "http://localhost:3000";

export async function getProducts() {
  const res = await fetch(
    `${API_BASE}/api/products?include=variants,category`,
    {
      cache: "no-store",
    },
  );
  const { data } = await res.json();
  return data;
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/api/categories`, {
    cache: "no-store",
  });
  const { data } = await res.json();
  return data;
}

export async function createProduct(product: any) {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  revalidatePath("/admin/products");
  return res.json();
}

export async function updateProduct(id: number, updated: any) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  revalidatePath("/products");
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
  });
  revalidatePath("/admin/products");
  return res.json();
}

// app/products/actions.ts
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.url; // 👈 image URL from ImageKit
}

export async function createDeal(deal: any) {
  const res = await fetch(`${API_BASE}/api/deals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deal),
  });
  revalidatePath("/admin/products?deals");
  return res.json();
}

export async function getDeals() {
  const res = await fetch(
    `${API_BASE}/api/deals?include=dealItems.product.variants`,
    {
      cache: "no-store",
    },
  );
  const { data } = await res.json();
  return data;
}

export async function deleteDeal(id: number) {
  const res = await fetch(`${API_BASE}/api/deals/${id}`, {
    method: "DELETE",
  });
  revalidatePath("/admin/products?deals");
  return res.json();
}
