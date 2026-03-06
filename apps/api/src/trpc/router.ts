import { adminRouter } from "../routes/admin.js";
import { betsRouter } from "../routes/bets.js";
import { dashboardRouter } from "../routes/dashboard.js";
import { healthRouter } from "../routes/health.js";
import { rewardsRouter } from "../routes/rewards.js";
import { router } from "./trpc.js";

export const appRouter = router({
  health: healthRouter,
  bets: betsRouter,
  dashboard: dashboardRouter,
  rewards: rewardsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
