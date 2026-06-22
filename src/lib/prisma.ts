import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };

function getPrisma(): PrismaClient {
  if (!g.prisma) {
    const datasourceUrl = process.env["DATABASE_URL"];
    g.prisma = datasourceUrl
      ? new PrismaClient({ datasourceUrl })
      : new PrismaClient();
  }
  return g.prisma;
}

export function getDb() {
  return getPrisma();
}
