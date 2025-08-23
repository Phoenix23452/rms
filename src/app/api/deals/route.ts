// app/api/deals/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import DealRepository from "@/repos/DealRepsitory";

const repo = new DealRepository();
const handlers = createAPIHandlers(repo, "deal");

export const GET = handlers.GET;
export const POST = handlers.POST;
