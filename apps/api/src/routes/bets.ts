import { and, bets, desc, eq, matches, users } from "@nobet/db";
import { placeBetSchema } from "@nobet/shared";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc/trpc.js";

export const betsRouter = router({
  /** Place a bet on a match */
  placeBet: protectedProcedure.input(placeBetSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;

    // Fetch match and validate it's still bettable
    const [match] = await ctx.db.select().from(matches).where(eq(matches.id, input.matchId));

    if (!match) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Match not found" });
    }
    if (match.status === "finished") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Match has already finished",
      });
    }

    // Fetch user balance
    const [user] = await ctx.db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    if (user.balance < input.stake) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Insufficient balance. You have NC ${user.balance}, need NC ${input.stake}`,
      });
    }

    // Deduct stake from balance
    await ctx.db
      .update(users)
      .set({ balance: user.balance - input.stake })
      .where(eq(users.id, userId));

    // Create the bet
    const [newBet] = await ctx.db
      .insert(bets)
      .values({
        userId,
        matchId: input.matchId,
        selection: input.selection,
        market: input.market,
        odds: String(input.odds),
        stake: input.stake,
        status: "pending",
      })
      .returning();

    return { bet: newBet, newBalance: user.balance - input.stake };
  }),

  /** Get all bets for the current user */
  getUserBets: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "won", "lost", "void", "all"]).default("all"),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(bets.userId, ctx.user.id)];
      if (input.status !== "all") {
        conditions.push(eq(bets.status, input.status));
      }

      const userBets = await ctx.db
        .select({
          id: bets.id,
          matchId: bets.matchId,
          homeTeam: matches.homeTeam,
          awayTeam: matches.awayTeam,
          league: matches.league,
          selection: bets.selection,
          market: bets.market,
          odds: bets.odds,
          stake: bets.stake,
          payout: bets.payout,
          status: bets.status,
          createdAt: bets.createdAt,
          resolvedAt: bets.resolvedAt,
        })
        .from(bets)
        .innerJoin(matches, eq(bets.matchId, matches.id))
        .where(and(...conditions))
        .orderBy(desc(bets.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return userBets;
    }),
});
