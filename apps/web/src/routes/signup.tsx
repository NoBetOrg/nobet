import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message ?? "Could not create account");
      } else {
        navigate({ to: "/" });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-400">
            <Wallet className="h-7 w-7 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Join <span className="text-yellow-400">NoBet</span>
          </h1>
          <p className="mt-1 text-sm text-[#a0a0a0]">Start with NC 1,000.00 — free</p>
        </div>

        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm text-[#a0a0a0]">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555] focus:border-yellow-400/50"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm text-[#a0a0a0]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555] focus:border-yellow-400/50"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm text-[#a0a0a0]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555] focus:border-yellow-400/50"
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-900/20 border border-red-800/40 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-yellow-400 font-bold text-black hover:bg-yellow-300"
            >
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-[#7090b0]">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-400 hover:underline">
              Sign in
            </a>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-[#555]">
          NoBet uses fictional NoCoins only — no real money involved.
        </p>
      </div>
    </div>
  );
}
