// app/api/products/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import ProductRepository from "@/repos/ProductRepsitory";

const repo = new ProductRepository();
const handlers = createAPIHandlers(repo, "product");

export const GET = handlers.GET;
export const POST = handlers.POST;
