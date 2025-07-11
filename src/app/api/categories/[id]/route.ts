// app/api/categories/[id]/route.ts
import { createItemAPIHandlers } from "@/lib/apiHandler";
import CategoryRepository from "@/repos/CategoryRepsitory";

const repo = new CategoryRepository();

const handlers = createItemAPIHandlers(repo, "category");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
