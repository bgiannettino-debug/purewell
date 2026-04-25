import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Migrations and `prisma db push` need a *direct* Postgres connection —
// Supabase's transaction pooler (port 6543) doesn't support the DDL
// operations Prisma issues during a migration (CREATE TABLE, ALTER TYPE,
// advisory locks, etc.). Runtime queries are different: they live in
// lib/db.ts and read DATABASE_URL via the PrismaPg adapter, which on
// Vercel serverless should point at the *pooler* (port 6543) so each
// invocation doesn't open a fresh connection.
//
// Convention:
//   DATABASE_URL  →  pooler URL (port 6543)  — used at runtime
//   DIRECT_URL    →  direct URL (port 5432)  — used by this config
//
// Falls back to DATABASE_URL if DIRECT_URL isn't set, which keeps
// single-URL local setups working without extra config.
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!migrationUrl) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL must be set in the environment for Prisma migrations.",
  );
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: migrationUrl,
  },
});