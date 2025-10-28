import React from "react";
import OrderByIdClient from "./OrderByIdClient";

export default async function SingleOrder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <OrderByIdClient id={id} />
    </div>
  );
}
