import { trpc } from "@nobet/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus, Power } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../../components/loading";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";

export const Route = createFileRoute("/admin/rewards")({
  component: AdminRewards,
});

function AdminRewards() {
  const [tab, setTab] = useState<"rewards" | "redemptions">("rewards");
  const [rewardPage, setRewardPage] = useState(1);
  const [redemptionPage, setRedemptionPage] = useState(1);
  const [redemptionStatus, setRedemptionStatus] = useState<
    "all" | "pending" | "fulfilled" | "cancelled"
  >("all");
  const [createOpen, setCreateOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "coupon" as "coupon" | "prize",
    partnerName: "",
    imageUrl: "",
    costNc: "",
    stock: "",
  });

  const utils = trpc.useUtils();
  const rewardsQuery = trpc.admin.listRewards.useQuery({ page: rewardPage, limit: 20 });
  const redemptionsQuery = trpc.admin.listRedemptions.useQuery({
    page: redemptionPage,
    limit: 20,
    status: redemptionStatus,
  });

  const createMutation = trpc.admin.createReward.useMutation({
    onSuccess: () => {
      utils.admin.listRewards.invalidate();
      setCreateOpen(false);
      setForm({
        title: "",
        description: "",
        type: "coupon",
        partnerName: "",
        imageUrl: "",
        costNc: "",
        stock: "",
      });
    },
  });

  const toggleMutation = trpc.admin.toggleReward.useMutation({
    onSuccess: () => utils.admin.listRewards.invalidate(),
  });

  const fulfillMutation = trpc.admin.fulfillRedemption.useMutation({
    onSuccess: () => utils.admin.listRedemptions.invalidate(),
  });

  const rewardTotalPages = Math.ceil((rewardsQuery.data?.total ?? 0) / 20);
  const redemptionTotalPages = Math.ceil((redemptionsQuery.data?.total ?? 0) / 20);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Rewards Management</h1>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-yellow-400 font-bold text-black hover:bg-yellow-300"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create Reward
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="flex h-9 w-fit items-center rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] gap-0 p-1">
          <TabsTrigger
            value="rewards"
            className="rounded-md px-3 py-1 text-xs text-[#7090b0] data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-none"
          >
            Rewards ({rewardsQuery.data?.total ?? "—"})
          </TabsTrigger>
          <TabsTrigger
            value="redemptions"
            className="rounded-md px-3 py-1 text-xs text-[#7090b0] data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:shadow-none"
          >
            Redemptions ({redemptionsQuery.data?.total ?? "—"})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "rewards" && (
        <>
          <div className="rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2a2a2a] hover:bg-transparent">
                  {["Title", "Partner", "Type", "Cost (NC)", "Stock", "Active", "Actions"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-[11px] font-medium uppercase text-[#7090b0]"
                      >
                        {h}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardsQuery.isLoading
                  ? ["a", "b", "c", "d", "e"].map((k) => (
                      <TableRow key={k} className="border-[#2a2a2a]">
                        {["c1", "c2", "c3", "c4", "c5", "c6", "c7"].map((c) => (
                          <TableCell key={c}>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : rewardsQuery.data?.items.map((r) => (
                      <TableRow key={r.id} className="border-[#2a2a2a] hover:bg-[#252525]">
                        <TableCell className="text-sm font-medium text-white">{r.title}</TableCell>
                        <TableCell className="text-xs text-[#a0a0a0]">{r.partnerName}</TableCell>
                        <TableCell>
                          <Badge
                            className={`border-0 text-[10px] ${r.type === "coupon" ? "bg-blue-900/40 text-blue-400" : "bg-purple-900/40 text-purple-400"}`}
                          >
                            {r.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-bold text-yellow-400">
                          {r.costNc.toLocaleString()}
                        </TableCell>
                        <TableCell
                          className={`text-sm ${r.stock < 10 ? "text-orange-400 font-bold" : "text-white"}`}
                        >
                          {r.stock}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={r.active}
                            onCheckedChange={() => toggleMutation.mutate({ id: r.id })}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleMutation.mutate({ id: r.id })}
                            className="h-7 w-7 text-[#7090b0] hover:text-white"
                          >
                            <Power className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
          {rewardTotalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-[#7090b0]">
              <p>
                Page {rewardPage} of {rewardTotalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRewardPage(Math.max(1, rewardPage - 1))}
                  disabled={rewardPage === 1}
                  className="h-7 border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRewardPage(Math.min(rewardTotalPages, rewardPage + 1))}
                  disabled={rewardPage === rewardTotalPages}
                  className="h-7 border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "redemptions" && (
        <>
          <div className="flex gap-2">
            {(["all", "pending", "fulfilled", "cancelled"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setRedemptionStatus(s);
                  setRedemptionPage(1);
                }}
                className={`rounded-md px-3 py-1 text-xs capitalize transition-colors ${
                  redemptionStatus === s
                    ? "bg-yellow-400 font-bold text-black"
                    : "bg-[#2a2a2a] text-[#7090b0] hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2a2a2a] hover:bg-transparent">
                  {["User", "Reward", "Partner", "Code", "Cost", "Status", "Date", "Actions"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-[11px] font-medium uppercase text-[#7090b0]"
                      >
                        {h}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {redemptionsQuery.isLoading
                  ? ["a", "b", "c", "d", "e"].map((k) => (
                      <TableRow key={k} className="border-[#2a2a2a]">
                        {["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"].map((c) => (
                          <TableCell key={c}>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : redemptionsQuery.data?.items.map((r) => (
                      <TableRow key={r.id} className="border-[#2a2a2a] hover:bg-[#252525]">
                        <TableCell>
                          <p className="text-xs font-medium text-white">{r.userName ?? "—"}</p>
                          <p className="text-[10px] text-[#555]">{r.userEmail}</p>
                        </TableCell>
                        <TableCell className="text-xs text-white">{r.rewardTitle}</TableCell>
                        <TableCell className="text-xs text-[#7090b0]">{r.partnerName}</TableCell>
                        <TableCell>
                          <span className="font-mono text-xs font-bold text-yellow-400">
                            {r.code}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-yellow-400">
                          NC {r.costNc.toLocaleString()}
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-[10px] text-[#555]">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {r.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => fulfillMutation.mutate({ redemptionId: r.id })}
                              disabled={fulfillMutation.isPending}
                              className="h-7 bg-green-600 px-2 text-xs font-bold text-white hover:bg-green-500"
                            >
                              Fulfill
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          {redemptionTotalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-[#7090b0]">
              <p>
                Page {redemptionPage} of {redemptionTotalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRedemptionPage(Math.max(1, redemptionPage - 1))}
                  disabled={redemptionPage === 1}
                  className="h-7 border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setRedemptionPage(Math.min(redemptionTotalPages, redemptionPage + 1))
                  }
                  disabled={redemptionPage === redemptionTotalPages}
                  className="h-7 border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create reward dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-[#2a2a2a] bg-[#1e1e1e] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Reward</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="rTitle" className="text-xs text-[#7090b0]">
                Title
              </Label>
              <Input
                id="rTitle"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 20% off at Amazon"
                className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555]"
              />
            </div>
            <div>
              <Label htmlFor="rDesc" className="text-xs text-[#7090b0]">
                Description
              </Label>
              <Textarea
                id="rDesc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the reward..."
                className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555] resize-none"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-[#7090b0]">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v as "coupon" | "prize" })}
                >
                  <SelectTrigger className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#2a2a2a] bg-[#1e1e1e] text-white">
                    <SelectItem value="coupon" className="hover:bg-[#2a2a2a]">
                      Coupon
                    </SelectItem>
                    <SelectItem value="prize" className="hover:bg-[#2a2a2a]">
                      Prize
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rPartner" className="text-xs text-[#7090b0]">
                  Partner Name
                </Label>
                <Input
                  id="rPartner"
                  value={form.partnerName}
                  onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
                  placeholder="e.g. Amazon"
                  className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555]"
                />
              </div>
              <div>
                <Label htmlFor="rCost" className="text-xs text-[#7090b0]">
                  Cost (NC)
                </Label>
                <Input
                  id="rCost"
                  type="number"
                  min="1"
                  value={form.costNc}
                  onChange={(e) => setForm({ ...form, costNc: e.target.value })}
                  placeholder="500"
                  className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555]"
                />
              </div>
              <div>
                <Label htmlFor="rStock" className="text-xs text-[#7090b0]">
                  Stock
                </Label>
                <Input
                  id="rStock"
                  type="number"
                  min="1"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="100"
                  className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="rImage" className="text-xs text-[#7090b0]">
                Image URL (optional)
              </Label>
              <Input
                id="rImage"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1 border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555]"
              />
            </div>
          </div>
          {createMutation.error && (
            <p className="text-sm text-red-400">{createMutation.error.message}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              className="border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
            >
              Cancel
            </Button>
            <Button
              disabled={
                !form.title ||
                !form.description ||
                !form.partnerName ||
                !form.costNc ||
                !form.stock ||
                createMutation.isPending
              }
              onClick={() =>
                createMutation.mutate({
                  title: form.title,
                  description: form.description,
                  type: form.type,
                  partnerName: form.partnerName,
                  imageUrl: form.imageUrl || undefined,
                  costNc: Number(form.costNc),
                  stock: Number(form.stock),
                })
              }
              className="bg-yellow-400 font-bold text-black hover:bg-yellow-300"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
