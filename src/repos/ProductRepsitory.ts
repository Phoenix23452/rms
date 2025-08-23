import { prisma } from "@/lib/prisma";
import { Product } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(prisma.product);
  }
  async create(data: any): Promise<Product> {
    const { variants, ...productData } = data;

    return this.modelClient.create({
      data: {
        ...productData,
        variants: {
          create: variants ?? [],
        },
      },
      include: {
        variants: true,
      },
    });
  }

  async update(id: number, data: any): Promise<Product> {
    const { variants, ...productData } = data;

    return this.modelClient.update({
      where: { id },
      data: {
        ...productData,
        variants: {
          deleteMany: {}, // delete all previous
          create: variants ?? [],
        },
      },
      include: {
        variants: true,
      },
    });
  }
}
