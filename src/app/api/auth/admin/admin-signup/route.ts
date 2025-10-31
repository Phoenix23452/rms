import { createAPIHandlers } from "@/lib/apiHandler";
import UserRepository from "@/repos/UserRepository";
import bcrypt from "bcryptjs";

const repo = new UserRepository();

// Extend repo with password hashing logic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
repo.create = async (data: any) => {
  const { password, ...rest } = data;
  const hashed = await bcrypt.hash(password, 10);

  return await new UserRepository().create({
    ...rest,
    password: hashed,
    role: "ADMIN",
  });
};

const handlers = createAPIHandlers(repo, "admin");

export const POST = handlers.POST;
