// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Ensure the SQLite DB (esp. on Vercel /tmp) has the required table/trigger.
 * Safe to call multiple times. No-op if provider != sqlite (i.e., DATABASE_URL not starting with file:)
 */
export async function ensureSqliteDb() {
  const url = process.env.DATABASE_URL || "";
  if (!url.startsWith("file:")) return;

  try {
    // Create table if not exists (matches Prisma model HtmlOutput)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "HtmlOutput" (
        "id"        INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "title"     TEXT    NOT NULL,
        "content"   TEXT    NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Trigger to auto-update updatedAt on UPDATE
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER IF NOT EXISTS "HtmlOutput_updatedAt"
      AFTER UPDATE ON "HtmlOutput"
      FOR EACH ROW BEGIN
        UPDATE "HtmlOutput"
        SET "updatedAt" = CURRENT_TIMESTAMP
        WHERE rowid = NEW.rowid;
      END;
    `);
  } catch (e) {
    console.error("[db] ensureSqliteDb failed", e);
  }
}
