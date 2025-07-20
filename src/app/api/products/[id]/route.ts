// app/api/products/[id]/route.ts
import { createItemAPIHandlers } from "@/lib/apiHandler";
import ProductRepository from "@/repos/ProductRepsitory";

const repo = new ProductRepository();
const handlers = createItemAPIHandlers(repo, "category");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
