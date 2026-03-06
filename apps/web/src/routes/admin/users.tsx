import { trpc } from "@nobet/api-client";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [balanceDialog, setBalanceDialog] = useState<{
    userId: string;
    name: string | null;
    balance: number;
  } | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceReason, setBalanceReason] = useState("");

  const utils = trpc.useUtils();
  const listQuery = trpc.admin.listUsers.useQuery({ page, limit: 20, search });

  const banMutation = trpc.admin.banUser.useMutation({
    onSuccess: () => utils.admin.listUsers.invalidate(),
  });
  const unbanMutation = trpc.admin.unbanUser.useMutation({
    onSuccess: () => utils.admin.listUsers.invalidate(),
  });
  const balanceMutation = trpc.admin.updateUserBalance.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
      setBalanceDialog(null);
      setBalanceAmount("");
      setBalanceReason("");
    },
  });

  const totalPages = Math.ceil((listQuery.data?.total ?? 0) / 20);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">User Management</h1>
          <p className="text-sm text-[#7090b0]">{listQuery.data?.total ?? "—"} total users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(searchInput);
                  setPage(1);
                }
              }}
              placeholder="Search users..."
              className="h-8 rounded-md border border-[#3a3a3a] bg-[#2a2a2a] pl-8 pr-3 text-sm text-white placeholder-[#555] focus:border-yellow-400/50 focus:outline-none w-48"
            />
          </div>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSearchInput("");
              }}
            >
              <X className="h-4 w-4 text-[#555] hover:text-white" />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2a2a2a] hover:bg-transparent">
              {["Name", "Email", "Balance", "Role", "Status", "Joined", "Actions"].map((h) => (
                <TableHead key={h} className="text-[11px] font-medium uppercase text-[#7090b0]">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {listQuery.isLoading
              ? ["a", "b", "c", "d", "e"].map((k) => (
                  <TableRow key={k} className="border-[#2a2a2a]">
                    {["c1", "c2", "c3", "c4", "c5", "c6", "c7"].map((c) => (
                      <TableCell key={c}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : listQuery.data?.items.map((u) => (
                  <TableRow key={u.id} className="border-[#2a2a2a] hover:bg-[#252525]">
                    <TableCell className="text-sm font-medium text-white">
                      {u.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-[#a0a0a0]">{u.email}</TableCell>
                    <TableCell className="text-sm font-bold text-yellow-400">
                      NC {u.balance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border-0 text-[10px] ${
                          u.role === "admin"
                            ? "bg-yellow-900/40 text-yellow-400"
                            : "bg-[#2a2a2a] text-[#7090b0]"
                        }`}
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`border-0 text-[10px] ${
                          u.banned ? "bg-red-900/40 text-red-400" : "bg-green-900/40 text-green-400"
                        }`}
                      >
                        {u.banned ? "banned" : "active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[#555]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-[#7090b0] hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-[#2a2a2a] bg-[#1e1e1e] text-white"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              setBalanceDialog({ userId: u.id, name: u.name, balance: u.balance })
                            }
                            className="cursor-pointer hover:bg-[#2a2a2a]"
                          >
                            Adjust Balance
                          </DropdownMenuItem>
                          {u.banned ? (
                            <DropdownMenuItem
                              onClick={() => unbanMutation.mutate({ userId: u.id })}
                              className="cursor-pointer text-green-400 hover:bg-[#2a2a2a]"
                            >
                              <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                              Unban User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => banMutation.mutate({ userId: u.id })}
                              className="cursor-pointer text-red-400 hover:bg-[#2a2a2a]"
                            >
                              <ShieldOff className="mr-2 h-3.5 w-3.5" />
                              Ban User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#7090b0]">
          <p>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="h-7 border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="h-7 border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Balance adjustment dialog */}
      <Dialog open={!!balanceDialog} onOpenChange={() => setBalanceDialog(null)}>
        <DialogContent className="border-[#2a2a2a] bg-[#1e1e1e] text-white">
          <DialogHeader>
            <DialogTitle>Adjust NoCoins Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-[#a0a0a0]">
              User: <span className="font-bold text-white">{balanceDialog?.name}</span>
              {" — "}
              Current:{" "}
              <span className="text-yellow-400">NC {balanceDialog?.balance.toLocaleString()}</span>
            </p>
            <div>
              <label htmlFor="bal-amount" className="mb-1.5 block text-xs text-[#7090b0]">
                Amount (positive to add, negative to subtract)
              </label>
              <Input
                id="bal-amount"
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                placeholder="e.g. 500 or -200"
                className="border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555]"
              />
            </div>
            <div>
              <label htmlFor="bal-reason" className="mb-1.5 block text-xs text-[#7090b0]">
                Reason
              </label>
              <Input
                id="bal-reason"
                type="text"
                value={balanceReason}
                onChange={(e) => setBalanceReason(e.target.value)}
                placeholder="e.g. Promotional bonus"
                className="border-[#3a3a3a] bg-[#2a2a2a] text-white placeholder-[#555]"
              />
            </div>
            {balanceMutation.error && (
              <p className="text-sm text-red-400">{balanceMutation.error.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBalanceDialog(null)}
              className="border-[#3a3a3a] bg-transparent text-white hover:bg-[#2a2a2a]"
            >
              Cancel
            </Button>
            <Button
              disabled={!balanceAmount || !balanceReason || balanceMutation.isPending}
              onClick={() => {
                if (!balanceDialog) return;
                balanceMutation.mutate({
                  userId: balanceDialog.userId,
                  amount: Number(balanceAmount),
                  reason: balanceReason,
                });
              }}
              className="bg-yellow-400 font-bold text-black hover:bg-yellow-300"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
