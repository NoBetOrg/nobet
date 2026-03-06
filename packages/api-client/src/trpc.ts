import type { AppRouter } from "@nobet/api/router";
import { createTRPCReact } from "@trpc/react-query";

export type { AppRouter } from "@nobet/api/router";

export const trpc = createTRPCReact<AppRouter>();
