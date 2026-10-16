import { PrismaClient } from "@prisma/client";
import { isDatabaseConfigured } from "@/lib/env";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

let prismaClient: PrismaClient | null = null;

if (isDatabaseConfigured) {
  prismaClient = global.prismaGlobal ?? new PrismaClient({ log: ["error"] });
  if (process.env.NODE_ENV !== "production") {
    global.prismaGlobal = prismaClient;
  }
}

export const prisma = prismaClient;
