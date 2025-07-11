import { prisma } from "@/lib/prisma";
import { Category } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(prisma.category);
  }
}
