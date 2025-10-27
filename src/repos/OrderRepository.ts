/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { Order } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(prisma.order);
  }

  /**
   * Create a new order with related items and initial timeline entry
   */
  async create(data: any): Promise<Order> {
    const { items, customerId, customer, ...orderData } = data;
    // ✅ Step 1: Resolve customer (either existing or create new)
    let resolvedCustomerId = customerId;
    if (!resolvedCustomerId && customer) {
      // Look up customer by email
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: customer.email },
      });

      if (existingCustomer) {
        resolvedCustomerId = existingCustomer.id;
      } else {
        const newCustomer = await prisma.customer.create({
          data: {
            fullName: customer.fullName,
            phone: customer.phone,
            email: customer.email,
            customerCode: `GUEST-${Date.now()}`,
          },
        });
        resolvedCustomerId = newCustomer.id;
      }
    }
    if (!resolvedCustomerId) {
      throw new Error("Missing customer information");
    }
    return this.modelClient.create({
      data: {
        ...orderData,
        customerId: resolvedCustomerId,
        items: {
          create:
            items?.map((item: any) => ({
              ...item,
              optionalItems: {
                connect:
                  item.optionalItems?.map((variantId: number) => ({
                    id: variantId,
                  })) ?? [],
              },
            })) ?? [],
        },
        timeline: {
          create: {
            status: "Order Placed",
          },
        },
      },
      include: {
        items: {
          include: {
            variant: true,
            optionalItems: true,
          },
        },
        timeline: true,
        customer: true,
      },
    });
  }

  /**
   * Update an order.
   * If the order status changes, automatically append a timeline entry.
   */
  async update(id: number, data: any): Promise<Order> {
    const { items, status, ...orderData } = data;

    const existingOrder = await this.modelClient.findUnique({
      where: { id },
      select: { status: true },
    });

    const statusChanged =
      status && existingOrder?.status !== status ? true : false;

    return this.modelClient.update({
      where: { id },
      data: {
        ...orderData,
        ...(items
          ? {
              items: {
                deleteMany: {}, // Clear old items and reinsert
                create: items.map((item: any) => ({
                  variantId: item.variantId,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  price: item.price,
                  note: item.note,
                  regularPrice: item.regularPrice,
                  discountPercentage: item.discountPercentage,
                  optionalItems: {
                    connect:
                      item.optionalItems?.map((variantId: number) => ({
                        id: variantId,
                      })) ?? [],
                  },
                })),
              },
            }
          : {}),
        ...(statusChanged
          ? {
              status,
              timeline: {
                create: {
                  status: this.mapStatusLabel(status),
                },
              },
            }
          : {}),
      },
      include: {
        items: {
          include: {
            variant: true,
            optionalItems: true,
          },
        },
        timeline: true,
        customer: true,
      },
    });
  }

  /**
   * Utility to map enum status values to readable timeline labels
   */
  private mapStatusLabel(status: string): string {
    const map: Record<string, string> = {
      PANDING: "Order Placed",
      CONFIRMED: "Order Confirmed",
      DISPATCHED: "Order Dispatched",
      DELIVERED: "Order Delivered",
      CANCELLED: "Order Cancelled",
    };
    return map[status] || status;
  }
}
