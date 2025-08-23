import { prisma } from "@/lib/prisma";
import { Deal } from "@/prisma/app/generated/prisma/client";
import BaseRepository from "@/repos/BaseRepository";

export default class DealRepository extends BaseRepository<Deal> {
  constructor() {
    super(prisma.deal);
  }
}
