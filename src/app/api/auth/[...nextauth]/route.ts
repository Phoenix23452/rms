/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    // ---------- CUSTOMER LOGIN ----------
    CredentialsProvider({
      id: "customer-login",
      name: "Customer Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const customer = await prisma.customer.findUnique({
          where: { email: credentials.email },
          include: { user: true },
        });
        console.log("Customer found:", customer);
        if (!customer || !customer.user) return null;
        if (customer.user.role !== "CUSTOMER") return null;
        if (!customer.user.password) return null;
        const valid = await bcrypt.compare(
          credentials.password,
          customer.user.password,
        );
        if (!valid) return null;

        return {
          id: customer.user.id.toString(),
          name: customer.fullName,
          email: customer.email,
          role: "CUSTOMER",
        };
      },
    }),

    // ---------- RIDER LOGIN ----------
    CredentialsProvider({
      id: "rider-login",
      name: "Rider Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const rider = await prisma.rider.findUnique({
          where: { email: credentials.email },
          include: { user: true },
        });
        if (!rider || !rider.user) return null;
        if (rider.user.role !== "RIDER") return null;
        if (!rider.user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          rider.user.password,
        );
        if (!valid) return null;

        return {
          id: rider.user.id.toString(),
          name: rider.fullName,
          email: rider.email,
          role: "RIDER",
        };
      },
    }),

    // ---------- ADMIN LOGIN ----------
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
          include: { user: true },
        });
        if (!admin || !admin.user) return null;
        if (admin.user.role !== "ADMIN") return null;
        if (!admin.user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          admin.user.password,
        );
        if (!valid) return null;

        return {
          id: admin.user.id.toString(),
          name: admin.fullName,
          email: admin.email,
          role: "ADMIN",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
