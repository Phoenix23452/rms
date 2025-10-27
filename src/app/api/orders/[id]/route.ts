// app/api/orders/[id]/route.ts
import { createItemAPIHandlers } from "@/lib/apiHandler";
import OrderRepository from "@/repos/OrderRepository";

const repo = new OrderRepository();

const handlers = createItemAPIHandlers(repo, "order");

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
