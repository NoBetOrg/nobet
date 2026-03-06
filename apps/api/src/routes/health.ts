import { publicProcedure, router } from "../trpc/trpc.js";

export const healthRouter = router({
  check: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),
});
