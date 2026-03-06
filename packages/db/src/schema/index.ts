import { boolean, integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ─── Users ────────────────────────────────────────────────────────────────────
// Note: users.id is text (not uuid) because Better Auth generates its own
// non-UUID string IDs (e.g. "W408XApxCxASpgCy53ShLCH4H6veTHvL").

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: text("name"),
  image: text("image"),
  role: text("role").notNull().default("user"), // "user" | "admin"
  balance: integer("balance").notNull().default(1000), // NoCoins (starts at 1000 NC)
  banned: boolean("banned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ─── Better Auth Tables ────────────────────────────────────────────────────────
// Required by Better Auth for sessions, accounts, verifications

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type Session = typeof sessions.$inferSelect;

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type Account = typeof accounts.$inferSelect;

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export type Verification = typeof verifications.$inferSelect;

// ─── Matches ──────────────────────────────────────────────────────────────────

export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  league: text("league").notNull(),
  sport: text("sport").notNull(),
  status: text("status").notNull().default("upcoming"), // "upcoming" | "live" | "finished"
  oddsHome: numeric("odds_home", { precision: 6, scale: 2 }).notNull(),
  oddsDraw: numeric("odds_draw", { precision: 6, scale: 2 }),
  oddsAway: numeric("odds_away", { precision: 6, scale: 2 }).notNull(),
  scoreHome: integer("score_home"),
  scoreAway: integer("score_away"),
  result: text("result"), // "home" | "draw" | "away" | null
  startTime: timestamp("start_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

// ─── Bets ─────────────────────────────────────────────────────────────────────

export const bets = pgTable("bets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  matchId: uuid("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  selection: text("selection").notNull(), // "Home" | "Draw" | "Away"
  market: text("market").notNull(), // "1X2" | "ML"
  odds: numeric("odds", { precision: 6, scale: 2 }).notNull(),
  stake: integer("stake").notNull(), // NoCoins staked
  payout: integer("payout"), // NoCoins paid out (null until resolved)
  status: text("status").notNull().default("pending"), // "pending" | "won" | "lost" | "void"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export type Bet = typeof bets.$inferSelect;
export type NewBet = typeof bets.$inferInsert;

// ─── Rewards ──────────────────────────────────────────────────────────────────

export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "prize" | "coupon"
  partnerName: text("partner_name").notNull(),
  imageUrl: text("image_url"),
  costNc: integer("cost_nc").notNull(), // NoCoins required to redeem
  stock: integer("stock").notNull().default(100),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Reward = typeof rewards.$inferSelect;
export type NewReward = typeof rewards.$inferInsert;

// ─── Redemptions ──────────────────────────────────────────────────────────────

export const redemptions = pgTable("redemptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rewardId: uuid("reward_id")
    .notNull()
    .references(() => rewards.id, { onDelete: "cascade" }),
  costNc: integer("cost_nc").notNull(),
  status: text("status").notNull().default("pending"), // "pending" | "fulfilled" | "cancelled"
  code: text("code").notNull(), // redemption code generated on creation
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Redemption = typeof redemptions.$inferSelect;
export type NewRedemption = typeof redemptions.$inferInsert;
