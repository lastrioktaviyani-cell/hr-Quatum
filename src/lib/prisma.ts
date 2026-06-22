import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const g = globalThis as GlobalWithPrisma;

function createPrismaClient(): PrismaClient {
  const datasourceUrl = process.env["DATABASE_URL"];
  if (!datasourceUrl) {
    throw new Error(
      "DATABASE_URL belum diset. Buat file .env di root project, lihat .env.example.",
    );
  }
  return new PrismaClient({
    datasourceUrl,
    // Keep connection footprint small — Supabase session-mode pooler
    // caps at ~15 concurrent connections per project. Each Prisma query
    // borrows one, and dev-mode HMR + multiple server components can
    // blow past that quickly.
    log: process.env["NODE_ENV"] === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrisma(): PrismaClient {
  // Reuse a single PrismaClient across the Node process. In Next.js dev
  // mode the module graph is re-evaluated on every change — caching the
  // instance on globalThis prevents a new client (and its connection
  // pool) on each reload.
  if (!g.prisma) {
    g.prisma = createPrismaClient();
  }
  return g.prisma;
}

export function getDb() {
  return getPrisma();
}
