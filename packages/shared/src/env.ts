import { z } from "zod";

/**
 * Server-side environment variables schema
 * These are validated at startup in Node.js environments
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validates server environment variables
 * Call this at the start of your API entry point
 */
export function validateServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid server environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Server environment validation failed");
  }

  return result.data;
}
