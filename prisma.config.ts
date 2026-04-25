// Mirror Next.js's dotenv loading order so prisma CLI commands see the
// same env values the dev server does: .env.local wins over .env. The
// stock `dotenv/config` import only loads .env, which silently uses
// stale values if .env.local has the canonical ones (the situation
// that just bit us — DATABASE_URL was set 3x in .env with an old
// password, while .env.local had the freshly-rotated value).
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // first wins; doesn't override
dotenv.config({ path: ".env" });

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