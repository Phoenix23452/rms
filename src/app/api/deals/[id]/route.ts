// app/api/deals/[id]/route.ts
import { createItemAPIHandlers } from "@/lib/apiHandler";
import DealRepository from "@/repos/DealRepsitory";

const repo = new DealRepository();

const handlers = createItemAPIHandlers(repo, "category");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
