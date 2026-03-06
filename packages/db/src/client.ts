import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

let _db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePostgres> | null = null;

function initializeDb() {
  if (_db) return _db;

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Smart driver selection based on connection string
  const isNeon = DATABASE_URL.includes("neon.tech");

  _db = isNeon
    ? drizzleNeon(neon(DATABASE_URL), { schema })
    : drizzlePostgres(postgres(DATABASE_URL), { schema });

  return _db;
}

export const db = new Proxy({} as ReturnType<typeof initializeDb>, {
  get(_target, prop) {
    const instance = initializeDb();
    return instance[prop as keyof typeof instance];
  },
});

export type Database = typeof db;
