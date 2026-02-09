import { z } from "zod";

import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: "ok", timestamp: new Date().toISOString() };
  }),

  // Placeholder — will be expanded in Phase 1
  gym: router({
    list: publicProcedure.query(() => {
      return [];
    }),
    getById: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
      return { id: input.id, name: "Placeholder Gym" };
    }),
  }),
});

export type AppRouter = typeof appRouter;
