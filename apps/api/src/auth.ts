import { accounts, db, sessions, users, verifications } from "@nobet/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRole: "admin",
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:5173", "https://nobet-web.vercel.app"],
  user: {
    additionalFields: {
      balance: {
        type: "number",
        defaultValue: 1000,
      },
      banned: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
});

export type Auth = typeof auth;
