/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { User } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user);
  }
  /**
   * Generate unique codes for customers, riders, and admins
   */
  private generateCode(prefix: string): string {
    return `${prefix}-${Date.now()}`;
  }

  /**
   * Create a new user with optional relations (customer, rider, admin)
   */
  async create(data: any): Promise<User> {
    const { customer, rider, admin, ...userData } = data;
    let connectedCustomerId: number | undefined;
    // ✅ Step 1: If there's a customer payload, handle guest logic
    if (customer?.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: customer.email },
      });

      if (existingCustomer) {
        // If existing customer is a guest, update their code and link later
        if (existingCustomer.customerCode.startsWith("GUEST-")) {
          const updatedCustomer = await prisma.customer.update({
            where: { id: existingCustomer.id },
            data: {
              customerCode: `CUST-${Date.now()}`,
              fullName: customer.fullName ?? existingCustomer.fullName,
              phone: customer.phone ?? existingCustomer.phone,
              status: "ACTIVE",
            },
          });
          connectedCustomerId = updatedCustomer.id;
        } else {
          // If already a registered customer, reuse their ID
          connectedCustomerId = existingCustomer.id;
        }
      } else {
        // Otherwise, create a new customer entry
        const newCustomer = await prisma.customer.create({
          data: {
            customerCode: `CUST-${Date.now()}`,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            status: "ACTIVE",
          },
        });
        connectedCustomerId = newCustomer.id;
      }
    }
    // ✅ Prepare rider creation with auto riderCode
    const riderData = rider
      ? {
          ...rider,
          riderCode: rider.riderCode ?? this.generateCode("RID"),
          status: rider.status ?? "ACTIVE",
        }
      : undefined;

    // ✅ Prepare admin creation with auto adminCode
    const adminData = admin
      ? {
          ...admin,
          adminCode: admin.adminCode ?? this.generateCode("ADM"),
          status: admin.status ?? "ACTIVE",
        }
      : undefined;
    return this.modelClient.create({
      data: {
        ...userData,
        ...(connectedCustomerId
          ? {
              customer: {
                connect: { id: connectedCustomerId },
              },
            }
          : customer
            ? {
                customer: {
                  create: customer,
                },
              }
            : {}),
        ...(riderData
          ? {
              rider: {
                create: riderData,
              },
            }
          : {}),
        ...(adminData
          ? {
              admin: {
                create: adminData,
              },
            }
          : {}),
      },
      include: {
        customer: true,
        rider: true,
        admin: true,
      },
    });
  }

  /**
   * Update a user and related profile (customer, rider, admin)
   */
  async update(id: number, data: any): Promise<User> {
    const { customer, rider, admin, ...userData } = data;

    return this.modelClient.update({
      where: { id },
      data: {
        ...userData,
        ...(customer
          ? {
              customer: {
                upsert: {
                  create: customer,
                  update: customer,
                },
              },
            }
          : {}),
        ...(rider
          ? {
              rider: {
                upsert: {
                  create: rider,
                  update: rider,
                },
              },
            }
          : {}),
        ...(admin
          ? {
              admin: {
                upsert: {
                  create: admin,
                  update: admin,
                },
              },
            }
          : {}),
      },
      include: {
        customer: true,
        rider: true,
        admin: true,
      },
    });
  }

  /**
   * Find user by email with relations
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.modelClient.findUnique({
      where: { email },
      include: {
        customer: true,
        rider: true,
        admin: true,
      },
    });
  }
}
