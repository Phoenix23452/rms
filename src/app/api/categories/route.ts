// app/api/categories/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import CategoryRepository from "@/repos/CategoryRepsitory";

const repo = new CategoryRepository();
const handlers = createAPIHandlers(repo, "category");

export const GET = handlers.GET;
export const POST = handlers.POST;
