// app/menu/actions.ts
"use server";
import config from "@/lib/config";
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
export async function getPopularProducts() {
  const res = await fetch(`${API_BASE}/api/products?isPopular=true`, {
    cache: "no-store",
  });
  const { data } = await res.json();
  return data;
}
