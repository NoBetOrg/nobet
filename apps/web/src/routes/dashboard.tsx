import { trpc } from "@nobet/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ShieldCheck, TrendingDown, TrendingUp, Trophy, Wallet } from "lucide-react";
import { Skeleton } from "../components/loading";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../context/auth-context";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function formatNc(amount: number) {
  return `NC ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

function StatCard({
  title,
  value,
  icon,
  accent = "text-white",
  sub,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent?: string;
  sub?: string;
}) {
  return (
    <Card className="border-[#2a2a2a] bg-[#1e1e1e]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#7090b0]">
              {title}
            </p>
            <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
            {sub && <p className="mt-0.5 text-xs text-[#555]">{sub}</p>}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2a2a2a]">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthlyChart({
  data,
}: {
  data: { month: string; label: string; amount: number }[];
}) {
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((d) => {
        const height = Math.round((d.amount / max) * 100);
        return (
          <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] font-medium text-green-400">
              {d.amount > 0 ? formatNc(d.amount) : ""}
            </span>
            <div className="relative w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t bg-green-600/60 transition-all duration-500"
                style={{ height: `${Math.max(height, d.amount > 0 ? 4 : 0)}%` }}
              />
            </div>
            <span className="text-[9px] text-[#555] text-center leading-tight">
              {d.label.split(" ").map((part) => (
                <span key={part} className="block">
                  {part}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DashboardPage() {
  const { user, isPending: authPending } = useAuth();
  const statsQuery = trpc.dashboard.getStats.useQuery(undefined, {
    enabled: !!user,
  });

  if (authPending) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <ShieldCheck className="h-12 w-12 text-[#444] mb-4" />
        <h2 className="text-lg font-bold text-white">Sign in to view your dashboard</h2>
        <p className="text-sm text-[#7090b0] mt-2">Track your avoided losses and progress</p>
        <a
          href="/login"
          className="mt-4 rounded-md bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300"
        >
          Sign In
        </a>
      </div>
    );
  }

  const stats = statsQuery.data;

  return (
    <div className="p-4 space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-white">Your Dashboard</h1>
        <p className="text-sm text-[#7090b0]">
          See how much you&apos;ve avoided losing by using NoBet
        </p>
      </div>

      {/* Hero: Avoided Loss */}
      <div className="rounded-xl border border-green-800/40 bg-gradient-to-br from-green-900/40 to-[#1a1a1a] p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-green-300">Total Avoided Loss</span>
            </div>
            <p className="text-4xl font-extrabold text-white">
              {stats ? formatNc(stats.avoidedLoss) : "—"}
            </p>
            <p className="mt-2 text-sm text-[#a0a0a0]">
              {stats && stats.avoidedLoss > 0
                ? "You would have lost this much with a real betting app. Keep it up!"
                : "Place some bets and see how much you're saving!"}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600/20 text-3xl">
            🛡️
          </div>
        </div>

        {stats && stats.totalBets > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-[#7090b0] mb-1">
              <span>Savings rate</span>
              <span className="text-green-400 font-medium">
                {Math.round((stats.avoidedLoss / Math.max(stats.totalStaked, 1)) * 100)}%
              </span>
            </div>
            <Progress
              value={Math.round((stats.avoidedLoss / Math.max(stats.totalStaked, 1)) * 100)}
              className="h-2 bg-[#2a2a2a] [&>div]:bg-green-500"
            />
          </div>
        )}
      </div>

      {/* Stats grid */}
      {statsQuery.isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Current Balance"
            value={formatNc(stats.currentBalance)}
            icon={<Wallet className="h-4 w-4 text-yellow-400" />}
            accent="text-yellow-400"
          />
          <StatCard
            title="Total Bets"
            value={String(stats.totalBets)}
            icon={<BarChart3 className="h-4 w-4 text-[#7090b0]" />}
            sub={`${stats.wonBets}W / ${stats.lostBets}L`}
          />
          <StatCard
            title="Win Rate"
            value={`${stats.winRate}%`}
            icon={<Trophy className="h-4 w-4 text-yellow-400" />}
            accent={stats.winRate >= 50 ? "text-green-400" : "text-[#a0a0a0]"}
          />
          <StatCard
            title="Total Staked"
            value={formatNc(stats.totalStaked)}
            icon={<TrendingDown className="h-4 w-4 text-[#7090b0]" />}
          />
        </div>
      ) : null}

      {/* Monthly chart */}
      {stats && stats.monthlyAvoidedLoss.length > 0 && (
        <Card className="border-[#2a2a2a] bg-[#1e1e1e]">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <CardTitle className="text-sm font-semibold text-white">
                Monthly Avoided Loss
              </CardTitle>
            </div>
            <p className="text-xs text-[#7090b0]">Last 6 months</p>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={stats.monthlyAvoidedLoss} />
          </CardContent>
        </Card>
      )}

      {/* Recent losing bets */}
      {stats && stats.recentLosses.length > 0 && (
        <Card className="border-[#2a2a2a] bg-[#1e1e1e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white">Recent Losing Bets</CardTitle>
            <p className="text-xs text-[#7090b0]">Money you would have lost for real</p>
          </CardHeader>
          <CardContent className="space-y-0">
            {stats.recentLosses.map((bet) => (
              <div
                key={bet.id}
                className="flex items-center justify-between border-b border-[#2a2a2a] py-2.5 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {bet.homeTeam} v {bet.awayTeam}
                  </p>
                  <p className="text-[11px] text-[#7090b0]">
                    {bet.league} · {bet.selection} @ {Number(bet.odds).toFixed(2)}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <Badge className="border-0 bg-red-900/30 text-red-400 text-xs">
                    -{formatNc(bet.stake)}
                  </Badge>
                  <p className="text-[10px] text-[#555] mt-0.5">
                    {new Date(bet.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {stats && stats.totalBets === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-sm font-medium text-white">No bets yet</p>
          <p className="text-xs text-[#7090b0] mt-1">Start betting with NoCoins on the homepage</p>
        </div>
      )}
    </div>
  );
}
