import { and, bets, count, eq, matches, sql, sum, users } from "@nobet/db";
import { protectedProcedure, router } from "../trpc/trpc.js";

export const dashboardRouter = router({
  /** Get the user's avoided-loss dashboard stats */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // Get current balance
    const [user] = await ctx.db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, userId));

    // Aggregate bet stats
    const betStats = await ctx.db
      .select({
        status: bets.status,
        totalStake: sum(bets.stake),
        totalPayout: sum(bets.payout),
        betCount: count(bets.id),
      })
      .from(bets)
      .where(eq(bets.userId, userId))
      .groupBy(bets.status);

    let totalBets = 0;
    let totalStaked = 0;
    let avoidedLoss = 0;
    let wonBets = 0;
    let lostBets = 0;

    for (const row of betStats) {
      const stake = Number(row.totalStake ?? 0);
      const cnt = Number(row.betCount ?? 0);
      totalBets += cnt;
      totalStaked += stake;
      if (row.status === "lost") {
        avoidedLoss += stake;
        lostBets += cnt;
      }
      if (row.status === "won") {
        wonBets += cnt;
      }
    }

    const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0;

    // Monthly avoided loss (last 6 months)
    const monthlyData = await ctx.db
      .select({
        month: sql<string>`to_char(${bets.createdAt}, 'YYYY-MM')`,
        amount: sum(bets.stake),
      })
      .from(bets)
      .where(
        and(
          eq(bets.userId, userId),
          eq(bets.status, "lost"),
          sql`${bets.createdAt} >= now() - interval '6 months'`
        )
      )
      .groupBy(sql`to_char(${bets.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${bets.createdAt}, 'YYYY-MM')`);

    // Build 6-month labels (fill gaps with 0)
    const now = new Date();
    const monthlyAvoidedLoss = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-US", { month: "short", year: "numeric" });
      const found = monthlyData.find((m) => m.month === key);
      monthlyAvoidedLoss.push({ month: key, label, amount: Number(found?.amount ?? 0) });
    }

    // Recent losing bets
    const recentLosses = await ctx.db
      .select({
        id: bets.id,
        matchId: bets.matchId,
        homeTeam: matches.homeTeam,
        awayTeam: matches.awayTeam,
        league: matches.league,
        selection: bets.selection,
        odds: bets.odds,
        stake: bets.stake,
        createdAt: bets.createdAt,
      })
      .from(bets)
      .innerJoin(matches, eq(bets.matchId, matches.id))
      .where(and(eq(bets.userId, userId), eq(bets.status, "lost")))
      .orderBy(sql`${bets.createdAt} desc`)
      .limit(10);

    return {
      currentBalance: user?.balance ?? 0,
      totalBets,
      totalStaked,
      avoidedLoss,
      wonBets,
      lostBets,
      winRate,
      monthlyAvoidedLoss,
      recentLosses,
    };
  }),
});
