// app/api/orders/route.ts
import { createAPIHandlers } from "@/lib/apiHandler";
import OrderRepository from "@/repos/OrderRepository";

const repo = new OrderRepository();
const handlers = createAPIHandlers(repo, "order");

export const GET = handlers.GET;
export const POST = handlers.POST;
