import { trpc } from "@nobet/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Gift, TrendingDown, Users } from "lucide-react";
import { Skeleton } from "../../components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function StatCard({
  title,
  value,
  icon,
  accent = "text-white",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
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
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2a2a2a]">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminOverview() {
  const overviewQuery = trpc.admin.getOverview.useQuery();
  const data = overviewQuery.data;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Platform Overview</h1>
        <p className="text-sm text-[#7090b0]">Real-time statistics and activity</p>
      </div>

      {overviewQuery.isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={data?.totalUsers ?? 0}
            icon={<Users className="h-4 w-4 text-blue-400" />}
            accent="text-blue-400"
          />
          <StatCard
            title="Total Bets"
            value={data?.totalBets ?? 0}
            icon={<BarChart3 className="h-4 w-4 text-[#7090b0]" />}
          />
          <StatCard
            title="NC in Circulation"
            value={`NC ${(data?.totalNcInCirculation ?? 0).toLocaleString()}`}
            icon={<TrendingDown className="h-4 w-4 text-yellow-400" />}
            accent="text-yellow-400"
          />
          <StatCard
            title="Rewards Redeemed"
            value={data?.totalRewardsRedeemed ?? 0}
            icon={<Gift className="h-4 w-4 text-purple-400" />}
            accent="text-purple-400"
          />
        </div>
      )}

      {data && data.pendingBets > 0 && (
        <div className="rounded-lg border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300">
            <span className="font-bold">{data.pendingBets}</span> pending bets awaiting match
            resolution
          </p>
        </div>
      )}

      {/* Recent users */}
      <Card className="border-[#2a2a2a] bg-[#1e1e1e]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-white">Recent Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {data?.recentUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between border-b border-[#2a2a2a] py-2.5 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-white">{u.name ?? "—"}</p>
                <p className="text-[11px] text-[#7090b0]">{u.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-yellow-400">NC {u.balance.toLocaleString()}</p>
                <p className="text-[10px] text-[#555]">
                  {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
