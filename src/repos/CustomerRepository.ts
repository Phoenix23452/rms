/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { Customer, UserStatus } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super(prisma.customer);
  }

  /**
   * Create a new customer
   * Automatically assigns a unique customerCode (CUST-{timestamp})
   * If a guest with the same email exists, convert it to a registered customer
   */
  async create(data: any): Promise<Customer> {
    const { email, fullName, phone, ...rest } = data;

    if (!email) {
      throw new Error("Email is required to create a customer");
    }

    // ✅ Step 1: Look for an existing customer by email
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      // If guest → upgrade to registered
      if (existingCustomer.customerCode.startsWith("GUEST-")) {
        return prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            fullName: fullName ?? existingCustomer.fullName,
            phone: phone ?? existingCustomer.phone,
            customerCode: `CUST-${Date.now()}`,
            status: UserStatus.ACTIVE,
            ...rest,
          },
        });
      }

      // Otherwise, just return the existing registered customer
      return existingCustomer;
    }

    // ✅ Step 2: Create a brand new registered customer
    return prisma.customer.create({
      data: {
        fullName,
        phone,
        email,
        customerCode: `CUST-${Date.now()}`,
        status: UserStatus.ACTIVE,
        ...rest,
      },
    });
  }

  /**
   * Update a customer by ID
   */
  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    return this.modelClient.update({
      where: { id },
      data,
    });
  }

  /**
   * Find a customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    return this.modelClient.findUnique({
      where: { email },
      include: {
        user: true,
        orders: true,
        addresses: true,
      },
    });
  }

  /**
   * Find a customer by phone number
   */
  async findByPhone(phone: string): Promise<Customer | null> {
    return this.modelClient.findFirst({
      where: { phone },
      include: {
        user: true,
        orders: true,
      },
    });
  }

  /**
   * Promote a guest customer (GUEST-xxxx) to registered (CUST-xxxx)
   * Optionally attach to a User
   */
  async promoteGuest(customerId: number, userId?: number): Promise<Customer> {
    const existingCustomer = await this.modelClient.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      throw new Error("Customer not found");
    }

    if (!existingCustomer.customerCode.startsWith("GUEST-")) {
      return existingCustomer; // Already registered
    }

    return this.modelClient.update({
      where: { id: customerId },
      data: {
        customerCode: `CUST-${Date.now()}`,
        status: UserStatus.ACTIVE,
        ...(userId ? { user: { connect: { id: userId } } } : {}),
      },
    });
  }

  /**
   * Soft delete or deactivate a customer
   */
  async deactivate(id: number): Promise<Customer> {
    return this.modelClient.update({
      where: { id },
      data: {
        status: UserStatus.INACTIVE,
      },
    });
  }
}
