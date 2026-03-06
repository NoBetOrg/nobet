import { db } from "@nobet/db";
import { auth } from "../auth.js";

export async function createContext(req: Request) {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;

  try {
    session = await auth.api.getSession({ headers: req.headers });
  } catch {
    session = null;
  }

  return {
    db,
    session: session?.session ?? null,
    user: session?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
