export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "credit_card" | "cash" | "wallet" | "bank_transfer";

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  options?: Record<string, any> | null;
}

// export interface Order {
//   id: string;
//   order_number: string;
//   user_id: string | null;
//   status: OrderStatus;
//   subtotal: number;
//   tax: number;
//   delivery_fee: number;
//   discount: number;
//   total_amount: number;
//   payment_method: PaymentMethod;
//   payment_status: PaymentStatus;
//   delivery_address_id: string | null;
//   delivery_option: string;
//   special_instructions: string | null;
//   estimated_delivery: string | null;
//   placed_at: string;
//   created_at: string;
//   updated_at: string;
//   items?: OrderItem[];
//   delivery_address?: {
//     address_line: string;
//     city: string;
//     state: string;
//     postal_code: string;
//   };
//   timeline?: {
//     id: string;
//     status: string;
//     description: string | null;
//     time: string;
//   }[];
// }

interface Rider {
  id: string;
  name: string;
  is_active: boolean;
}

interface OrderRider {
  id: string;
  order_id: string;
  rider_id: string;
  assigned_at: string;
  delivered_at?: string;
}

// In-memory storage
const orders: Order[] = [];
const orderItems: (OrderItem & { order_id: string })[] = [];
const orderTimelines: {
  id: string;
  order_id: string;
  status: string;
  description: string | null;
  time: string;
}[] = [];
const riders: Rider[] = [
  { id: "r1", name: "Rider One", is_active: true },
  { id: "r2", name: "Rider Two", is_active: false },
];
const orderRiders: OrderRider[] = [];

// Utility
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const generateId = () => Math.random().toString(36).substring(2, 10);
const nowISO = () => new Date().toISOString();

export const createOrder = async (
  order: Omit<
    Order,
    "id" | "created_at" | "updated_at" | "placed_at" | "order_number"
  >,
  items: Omit<OrderItem, "id">[],
): Promise<Order | null> => {
  await delay(100); // simulate network latency

  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `ORD-${year}${month}${day}-${random}`;

  const id = generateId();
  const timestamp = nowISO();

  const newOrder: Order = {
    ...order,
    id,
    order_number: orderNumber,
    placed_at: timestamp,
    created_at: timestamp,
    updated_at: timestamp,
    items: [],
    timeline: [],
  };

  orders.push(newOrder);

  // Add items
  items.forEach((item) => {
    orderItems.push({ ...item, order_id: id });
  });

  // Add initial timeline event
  const timelineEntry = {
    id: generateId(),
    order_id: id,
    status: "pending",
    description: "Order received and pending confirmation",
    time: timestamp,
  };
  orderTimelines.push(timelineEntry);

  return getOrderById(id);
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  await delay(50);

  const order = orders.find((o) => o.id === id);
  if (!order) return null;

  const items = orderItems.filter((item) => item.order_id === id);
  const timeline = orderTimelines
    .filter((t) => t.order_id === id)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Just a dummy delivery address if delivery_address_id exists
  const delivery_address = order.delivery_address_id
    ? {
        address_line: "123 Main St",
        city: "Sample City",
        state: "SC",
        postal_code: "12345",
      }
    : undefined;

  return {
    ...order,
    items,
    timeline,
    delivery_address,
  };
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  description?: string,
): Promise<boolean> => {
  await delay(50);

  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) throw new Error("Order not found");

  orders[orderIndex].status = status;
  orders[orderIndex].updated_at = nowISO();

  const timelineEntry = {
    id: generateId(),
    order_id: id,
    status,
    description: description || getDefaultStatusDescription(status),
    time: nowISO(),
  };
  orderTimelines.push(timelineEntry);

  if (status === "out_for_delivery") {
    const existingRider = orderRiders.find((or) => or.order_id === id);
    if (!existingRider) {
      const availableRider = riders.find((r) => r.is_active);
      if (availableRider) {
        orderRiders.push({
          id: generateId(),
          order_id: id,
          rider_id: availableRider.id,
          assigned_at: nowISO(),
        });

        orderTimelines.push({
          id: generateId(),
          order_id: id,
          status: "rider_assigned",
          description: "Rider assigned automatically for delivery",
          time: nowISO(),
        });
      }
    }
  }

  if (status === "delivered") {
    const riderOrder = orderRiders.find((or) => or.order_id === id);
    if (riderOrder) {
      riderOrder.delivered_at = nowISO();
    }
    orderTimelines.push({
      id: generateId(),
      order_id: id,
      status: "completed",
      description: "Order was successfully delivered and completed",
      time: nowISO(),
    });
  }

  return true;
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  await delay(50);
  return orders
    .filter((o) => o.user_id === userId)
    .sort((a, b) => b.placed_at.localeCompare(a.placed_at));
};

export const getOrdersByStatus = async (
  status: OrderStatus | OrderStatus[],
): Promise<Order[]> => {
  await delay(50);

  let filtered: Order[];
  if (Array.isArray(status)) {
    filtered = orders.filter((o) => status.includes(o.status));
  } else {
    filtered = orders.filter((o) => o.status === status);
  }
  return filtered.sort((a, b) => b.placed_at.localeCompare(a.placed_at));
};

export const getRecentOrders = async (limit = 10): Promise<Order[]> => {
  await delay(50);
  const sorted = [...orders].sort((a, b) =>
    b.placed_at.localeCompare(a.placed_at),
  );
  return sorted.slice(0, limit);
};

export const submitReview = async (
  userId: string,
  orderId: string,
  productId?: string,
  riderId?: string,
  rating = 5,
  comment?: string,
): Promise<boolean> => {
  await delay(50);
  // Dummy: just log review submission
  console.log("Review submitted:", {
    userId,
    orderId,
    productId,
    riderId,
    rating,
    comment,
  });
  return true;
};

function getDefaultStatusDescription(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Order received and pending confirmation";
    case "confirmed":
      return "Order confirmed and being prepared in kitchen";
    case "preparing":
      return "Your order is being prepared in the kitchen";
    case "ready_for_pickup":
      return "Your order is ready for pickup";
    case "out_for_delivery":
      return "Your order is on the way to you";
    case "delivered":
      return "Your order has been delivered successfully";
    case "cancelled":
      return "Order has been cancelled";
    default:
      return "Order status updated";
  }
}
