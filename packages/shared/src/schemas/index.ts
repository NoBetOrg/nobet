import { z } from "zod";

// ─── Match Schemas ────────────────────────────────────────────────────────────

export const createMatchSchema = z.object({
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  league: z.string().min(1, "League is required"),
  sport: z.string().min(1, "Sport is required"),
  oddsHome: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid odds format"),
  oddsDraw: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  oddsAway: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid odds format"),
  startTime: z.string().datetime(),
});

export const updateMatchSchema = createMatchSchema.partial().extend({
  id: z.string().uuid(),
  status: z.enum(["upcoming", "live", "finished"]).optional(),
  scoreHome: z.number().int().min(0).optional(),
  scoreAway: z.number().int().min(0).optional(),
});

export const resolveMatchSchema = z.object({
  matchId: z.string().uuid(),
  result: z.enum(["home", "draw", "away"]),
  scoreHome: z.number().int().min(0),
  scoreAway: z.number().int().min(0),
});

// ─── Bet Schemas ──────────────────────────────────────────────────────────────

export const placeBetSchema = z.object({
  matchId: z.string().uuid(),
  selection: z.enum(["Home", "Draw", "Away"]),
  market: z.enum(["1X2", "ML"]),
  odds: z.number().positive(),
  stake: z.number().int().min(1, "Minimum stake is 1 NC"),
});

// ─── Reward Schemas ───────────────────────────────────────────────────────────

export const createRewardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["prize", "coupon"]),
  partnerName: z.string().min(1, "Partner name is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  costNc: z.number().int().min(1, "Cost must be at least 1 NC"),
  stock: z.number().int().min(1, "Stock must be at least 1"),
});

export const updateRewardSchema = createRewardSchema.partial().extend({
  id: z.string().uuid(),
});

export const redeemRewardSchema = z.object({
  rewardId: z.string().uuid(),
});

// ─── Admin Schemas ────────────────────────────────────────────────────────────

export const updateUserBalanceSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int(), // positive to add, negative to subtract
  reason: z.string().min(1, "Reason is required"),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

// ─── Type exports ─────────────────────────────────────────────────────────────

export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;
export type ResolveMatchInput = z.infer<typeof resolveMatchSchema>;
export type PlaceBetInput = z.infer<typeof placeBetSchema>;
export type CreateRewardInput = z.infer<typeof createRewardSchema>;
export type UpdateRewardInput = z.infer<typeof updateRewardSchema>;
export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>;
export type UpdateUserBalanceInput = z.infer<typeof updateUserBalanceSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
