import { redemptions, rewards, users } from "@nobet/db";
import { redeemRewardSchema } from "@nobet/shared";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc/trpc.js";

function generateRedemptionCode(): string {
  return `NB-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

export const rewardsRouter = router({
  /** List all active rewards with stock */
  list: publicProcedure
    .input(
      z.object({
        type: z.enum(["prize", "coupon", "all"]).default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(rewards.active, true), gt(rewards.stock, 0)];
      if (input.type !== "all") {
        conditions.push(eq(rewards.type, input.type));
      }

      return ctx.db
        .select()
        .from(rewards)
        .where(and(...conditions))
        .orderBy(rewards.costNc);
    }),

  /** Get a single reward by ID */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [reward] = await ctx.db.select().from(rewards).where(eq(rewards.id, input.id));

      if (!reward) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Reward not found" });
      }
      return reward;
    }),

  /** Redeem a reward (deducts NC, creates redemption record) */
  redeem: protectedProcedure.input(redeemRewardSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;

    // Fetch reward
    const [reward] = await ctx.db.select().from(rewards).where(eq(rewards.id, input.rewardId));

    if (!reward) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Reward not found" });
    }
    if (!reward.active) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This reward is no longer available",
      });
    }
    if (reward.stock <= 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This reward is out of stock",
      });
    }

    // Fetch user balance
    const [user] = await ctx.db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    if (user.balance < reward.costNc) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Insufficient balance. Need NC ${reward.costNc}, you have NC ${user.balance}`,
      });
    }

    // Deduct balance and reduce stock atomically
    await ctx.db
      .update(users)
      .set({ balance: user.balance - reward.costNc })
      .where(eq(users.id, userId));

    await ctx.db
      .update(rewards)
      .set({ stock: sql`${rewards.stock} - 1` })
      .where(eq(rewards.id, reward.id));

    // Create redemption record
    const [redemption] = await ctx.db
      .insert(redemptions)
      .values({
        userId,
        rewardId: reward.id,
        costNc: reward.costNc,
        status: "pending",
        code: generateRedemptionCode(),
      })
      .returning();

    return {
      redemption,
      newBalance: user.balance - reward.costNc,
    };
  }),

  /** Get the current user's redemption history */
  myRedemptions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: redemptions.id,
        rewardId: redemptions.rewardId,
        rewardTitle: rewards.title,
        partnerName: rewards.partnerName,
        costNc: redemptions.costNc,
        status: redemptions.status,
        code: redemptions.code,
        createdAt: redemptions.createdAt,
      })
      .from(redemptions)
      .innerJoin(rewards, eq(redemptions.rewardId, rewards.id))
      .where(eq(redemptions.userId, ctx.user.id))
      .orderBy(desc(redemptions.createdAt));
  }),
});
