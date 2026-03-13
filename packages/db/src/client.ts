import { neon } from "@neondatabase/serverless";
import { type NeonHttpDatabase, drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { type PostgresJsDatabase, drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

type Database = NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;

let _db: Database | null = null;

function initializeDb(): Database {
  if (_db) return _db;

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Smart driver selection based on connection string
  const isNeon = DATABASE_URL.includes("neon.tech");

  const dbInstance = isNeon
    ? drizzleNeon(neon(DATABASE_URL), { schema })
    : drizzlePostgres(postgres(DATABASE_URL), { schema });

  _db = dbInstance as Database;

  return _db;
}

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = initializeDb();
    return instance[prop as keyof Database];
  },
});

export type { Database };
