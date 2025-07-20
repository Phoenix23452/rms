import { prisma } from "@/lib/prisma";
import { Category } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(prisma.category);
  }

  async create(data: Partial<Category>): Promise<Category> {
    // Get total count of existing categories
    const total = await this.modelClient.count();

    // Automatically set order
    const categoryWithOrder = {
      ...data,
      order: total + 1,
    };

    return this.modelClient.create({
      data: categoryWithOrder,
    });
  }
}
