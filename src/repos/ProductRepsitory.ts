/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { Product } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(prisma.product);
  }
  async create(data: any): Promise<Product> {
    const { variants, optionalItems, ...productData } = data;

    return this.modelClient.create({
      data: {
        ...productData,
        variants: {
          create: variants ?? [],
        },
        optionalItems: {
          connect:
            optionalItems?.map((itemId: number) => ({ id: itemId })) ?? [],
        },
      },
      include: {
        variants: true,
      },
    });
  }

  async update(id: number, data: any): Promise<Product> {
    const { variants, optionalItems, ...productData } = data;

    return this.modelClient.update({
      where: { id },
      data: {
        ...productData,
        variants: {
          deleteMany: {}, // delete all previous
          create: variants ?? [],
        },
        optionalItems: {
          set: optionalItems?.map((itemId: number) => ({ id: itemId })) ?? [], // This will overwrite the existing optionalItems
        },
      },
      include: {
        variants: true,
      },
    });
  }
}
