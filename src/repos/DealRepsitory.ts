import { prisma } from "@/lib/prisma";
import { Deal } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class DealRepository extends BaseRepository<Deal> {
  constructor() {
    super(prisma.deal);
  }

  async create(data: any): Promise<Deal> {
    const { dealItems, ...dealData } = data;

    return this.modelClient.create({
      data: {
        ...dealData,
        dealItems: {
          create: dealItems ?? [],
        },
      },
      include: {
        dealItems: true,
      },
    });
  }

  async update(id: number, data: any): Promise<Deal> {
    const { dealItems, ...dealData } = data;

    return this.modelClient.update({
      where: { id },
      data: {
        ...dealData,
        dealItems: {
          deleteMany: {}, // delete all previous
          create: dealItems ?? [],
        },
      },
      include: {
        dealItems: true,
      },
    });
  }
}
