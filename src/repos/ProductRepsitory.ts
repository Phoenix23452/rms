import { prisma } from "@/lib/prisma";
import { Product } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(prisma.category);
  }
}
