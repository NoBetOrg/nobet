import { trpc } from "@nobet/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { Gift, ShoppingBag, Tag, Wallet } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../components/loading";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../context/auth-context";

export const Route = createFileRoute("/rewards")({
  component: RewardsPage,
});

type RewardItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  partnerName: string;
  imageUrl: string | null;
  costNc: number;
  stock: number;
  active: boolean;
};

function RewardCard({
  reward,
  userBalance,
  onRedeem,
}: {
  reward: RewardItem;
  userBalance: number;
  onRedeem: (reward: RewardItem) => void;
}) {
  const canAfford = userBalance >= reward.costNc;
  const inStock = reward.stock > 0;

  return (
    <Card className="border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden transition-colors hover:bg-[#252525]">
      <div className="flex h-28 items-center justify-center bg-[#2a2a2a]">
        {reward.imageUrl ? (
          <img src={reward.imageUrl} alt={reward.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#444]">
            {reward.type === "coupon" ? (
              <Tag className="h-10 w-10" />
            ) : (
              <Gift className="h-10 w-10" />
            )}
            <span className="text-[10px]">{reward.partnerName}</span>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="mb-2 flex items-start justify-between gap-1">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{reward.title}</p>
            <p className="text-[11px] text-[#7090b0]">{reward.partnerName}</p>
          </div>
          <Badge
            className={`shrink-0 border-0 text-[10px] font-bold ${
              reward.type === "coupon"
                ? "bg-blue-900/40 text-blue-400"
                : "bg-purple-900/40 text-purple-400"
            }`}
          >
            {reward.type === "coupon" ? "Coupon" : "Prize"}
          </Badge>
        </div>
        <p className="mb-3 line-clamp-2 text-[11px] text-[#a0a0a0]">{reward.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-extrabold text-yellow-400">
              NC {reward.costNc.toLocaleString()}
            </p>
            <p className="text-[10px] text-[#555]">
              {reward.stock < 10 ? `Only ${reward.stock} left!` : `${reward.stock} available`}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onRedeem(reward)}
            disabled={!canAfford || !inStock}
            className={`text-xs font-bold ${
              canAfford && inStock
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "cursor-not-allowed bg-[#2a2a2a] text-[#555]"
            }`}
          >
            {!inStock ? "Out of stock" : !canAfford ? "Need more NC" : "Redeem"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RewardsPage() {
  const { user } = useAuth();
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<{ code: string; newBalance: number } | null>(
    null
  );

  const allQuery = trpc.rewards.list.useQuery({ type: "all" });
  const myRedemptionsQuery = trpc.rewards.myRedemptions.useQuery(undefined, {
    enabled: !!user,
  });
  const redeemMutation = trpc.rewards.redeem.useMutation({
    onSuccess: (data) => {
      setSelectedReward(null);
      setRedeemSuccess({
        code: data.redemption.code,
        newBalance: data.newBalance,
      });
      allQuery.refetch();
      myRedemptionsQuery.refetch();
    },
  });

  const userBalance = (user as { balance?: number })?.balance ?? 0;
  const rewards = allQuery.data ?? [];

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Rewards Shop</h1>
          <p className="text-sm text-[#7090b0]">Redeem your NoCoins for real rewards</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2">
          <Wallet className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-bold text-yellow-400">
            NC {userBalance.toLocaleString()}
          </span>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="flex h-10 w-full justify-start rounded-none bg-transparent border-b border-[#2a2a2a] px-0 gap-0">
          {[
            { value: "all", label: "All Rewards", icon: <ShoppingBag className="h-3.5 w-3.5" /> },
            { value: "coupon", label: "Coupons", icon: <Tag className="h-3.5 w-3.5" /> },
            { value: "prize", label: "Prizes", icon: <Gift className="h-3.5 w-3.5" /> },
            { value: "mine", label: "My Redemptions", icon: null },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex h-full items-center gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs font-medium text-[#7090b0] data-[state=active]:border-yellow-400 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {(["all", "coupon", "prize"] as const).map((type) => (
          <TabsContent key={type} value={type} className="mt-4">
            {allQuery.isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-52" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {rewards
                  .filter((r) => type === "all" || r.type === type)
                  .map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      userBalance={userBalance}
                      onRedeem={setSelectedReward}
                    />
                  ))}
                {rewards.filter((r) => type === "all" || r.type === type).length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <Gift className="mx-auto h-10 w-10 text-[#444] mb-3" />
                    <p className="text-sm text-[#7090b0]">No rewards available yet</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}

        <TabsContent value="mine" className="mt-4">
          {!user ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#7090b0]">
                <a href="/login" className="text-yellow-400 underline">
                  Sign in
                </a>{" "}
                to see your redemptions
              </p>
            </div>
          ) : myRedemptionsQuery.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : (myRedemptionsQuery.data?.length ?? 0) === 0 ? (
            <div className="py-12 text-center">
              <Gift className="mx-auto h-10 w-10 text-[#444] mb-3" />
              <p className="text-sm text-[#7090b0]">No redemptions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRedemptionsQuery.data?.map((r) => (
                <Card key={r.id} className="border-[#2a2a2a] bg-[#1e1e1e]">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{r.rewardTitle}</p>
                        <p className="text-[11px] text-[#7090b0]">{r.partnerName}</p>
                        <p className="mt-1 font-mono text-xs font-bold text-yellow-400 bg-[#2a2a2a] px-2 py-0.5 rounded w-fit">
                          {r.code}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`border-0 text-[10px] ${
                            r.status === "fulfilled"
                              ? "bg-green-900/40 text-green-400"
                              : r.status === "cancelled"
                                ? "bg-red-900/40 text-red-400"
                                : "bg-yellow-900/40 text-yellow-400"
                          }`}
                        >
                          {r.status}
                        </Badge>
                        <p className="mt-1 text-[10px] text-[#555]">
                          NC {r.costNc.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-[#555]">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Redeem confirmation dialog */}
      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        <DialogContent className="border-[#2a2a2a] bg-[#1e1e1e] text-white">
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
          </DialogHeader>
          {selectedReward && (
            <div className="space-y-4">
              <div className="rounded-lg border border-[#2a2a2a] bg-[#252525] p-4">
                <p className="font-bold text-white">{selectedReward.title}</p>
                <p className="text-sm text-[#7090b0]">{selectedReward.partnerName}</p>
                <p className="mt-2 text-sm text-[#a0a0a0]">{selectedReward.description}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#252525] px-4 py-3">
                <span className="text-sm text-[#a0a0a0]">Cost</span>
                <span className="font-bold text-yellow-400">
                  NC {selectedReward.costNc.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[#252525] px-4 py-3">
                <span className="text-sm text-[#a0a0a0]">Balance after</span>
                <span className="font-bold text-white">
                  NC {(userBalance - selectedReward.costNc).toLocaleString()}
                </span>
              </div>
              {redeemMutation.error && (
                <p className="text-sm text-red-400">{redeemMutation.error.message}</p>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedReward(null)}
              className="border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedReward && redeemMutation.mutate({ rewardId: selectedReward.id })
              }
              disabled={redeemMutation.isPending}
              className="bg-yellow-400 font-bold text-black hover:bg-yellow-300"
            >
              {redeemMutation.isPending ? "Redeeming..." : "Confirm Redemption"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={!!redeemSuccess} onOpenChange={() => setRedeemSuccess(null)}>
        <DialogContent className="border-[#2a2a2a] bg-[#1e1e1e] text-white text-center">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-white">Redemption Successful!</h2>
            <p className="text-sm text-[#a0a0a0]">Your redemption code:</p>
            <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-6 py-3">
              <p className="font-mono text-lg font-bold text-yellow-400">{redeemSuccess?.code}</p>
            </div>
            <p className="text-xs text-[#7090b0]">
              Present this code to the partner to claim your reward
            </p>
            <p className="text-sm text-[#a0a0a0]">
              New balance:{" "}
              <span className="font-bold text-yellow-400">
                NC {redeemSuccess?.newBalance.toLocaleString()}
              </span>
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setRedeemSuccess(null)}
              className="w-full bg-yellow-400 font-bold text-black hover:bg-yellow-300"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
