import { createContext, useContext } from "react";
import { authClient } from "../lib/auth-client";

type Session = typeof authClient.$Infer.Session;
type User = Session["user"] | null;

interface AuthContextValue {
  user: User;
  session: Session["session"] | null;
  isPending: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sessionResult = authClient.useSession();
  const session = sessionResult.data;
  const isPending = sessionResult.isPending;
  const refetch = sessionResult.refetch;

  const user = session?.user ?? null;
  const isAdmin = user?.role === "admin";

  const signOut = async () => {
    await authClient.signOut();
    refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: session?.session ?? null,
        isPending,
        isAdmin,
        signOut,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
