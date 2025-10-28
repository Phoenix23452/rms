import React from "react";
import OrderByIdClient from "./OrderByIdClient";
import { getOrdersById } from "../actions";

export default async function SingleOrder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("Order ID:", id);
  const order = (await getOrdersById(Number(id)))[0];
  console.log("Fetched Order:", order);
  return (
    <div>
      <OrderByIdClient order={order} />
    </div>
  );
}
