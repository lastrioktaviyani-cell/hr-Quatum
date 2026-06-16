import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };

function getPrisma(): PrismaClient {
  if (!g.prisma) g.prisma = new PrismaClient();
  return g.prisma;
}

export function getDb() {
  return getPrisma();
}
