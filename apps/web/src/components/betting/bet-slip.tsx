import { cn } from "@/lib/utils";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { useBetSlip } from "../../context/bet-slip-context";

interface BetSlipProps {
  className?: string;
  onClose?: () => void;
}

export function BetSlip({ className, onClose }: BetSlipProps) {
  const { selections, removeSelection, clearSlip, totalOdds } = useBetSlip();
  const [stake, setStake] = useState("");

  const stakeValue = Number.parseFloat(stake) || 0;
  const potentialReturn = stakeValue * totalOdds;

  return (
    <div className={cn("flex h-full flex-col bg-[#1e1e1e]", className)}>
      <div className="flex items-center justify-between border-b border-[#2a2a2a] px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Bet Slip</span>
          {selections.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black">
              {selections.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selections.length > 0 && (
            <button
              type="button"
              onClick={clearSlip}
              className="flex items-center gap-1 text-xs text-[#7090b0] transition-colors hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#7090b0] transition-colors hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {selections.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2a2a2a] text-2xl">
            🎯
          </div>
          <div>
            <p className="text-sm font-medium text-white">Your bet slip is empty</p>
            <p className="mt-1 text-xs text-[#7090b0]">Click on odds to add selections</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="border-b border-[#2a2a2a] px-3 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7090b0]">
                Multiple ({selections.length} selections)
              </span>
            </div>
            {selections.map((sel) => (
              <div
                key={`${sel.matchId}-${sel.market}`}
                className="border-b border-[#2a2a2a] px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">{sel.matchName}</p>
                    <p className="text-[10px] text-[#7090b0]">
                      {sel.market} · {sel.selection}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-bold text-yellow-400">{sel.odds.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => removeSelection(sel.matchId, sel.market)}
                      className="text-[#555] transition-colors hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {selections.length > 1 && (
              <div className="bg-[#252525] px-3 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#a0a0a0]">Combined Odds</span>
                  <span className="font-bold text-yellow-400">{totalOdds.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#2a2a2a] p-3 space-y-3">
            <div>
              <label
                htmlFor="stake-input"
                className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-[#7090b0]"
              >
                Stake (NC)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-yellow-400">
                  NC
                </span>
                <input
                  id="stake-input"
                  type="number"
                  min="1"
                  step="1"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-md border border-[#3a3a3a] bg-[#2a2a2a] py-2 pl-9 pr-3 text-sm text-white placeholder-[#555] focus:border-yellow-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setStake(String(amount))}
                  className="rounded border border-[#3a3a3a] bg-[#2a2a2a] py-1 text-xs font-medium text-[#a0a0a0] transition-colors hover:border-yellow-400/50 hover:text-yellow-400"
                >
                  {amount}
                </button>
              ))}
            </div>

            <div className="space-y-1 rounded-md bg-[#252525] p-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7090b0]">Potential Return</span>
                <span
                  className={cn("font-bold", stakeValue > 0 ? "text-green-400" : "text-[#555]")}
                >
                  NC {potentialReturn > 0 ? potentialReturn.toFixed(2) : "0.00"}
                </span>
              </div>
              {stakeValue > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7090b0]">Profit</span>
                  <span className="font-bold text-green-400">
                    NC {(potentialReturn - stakeValue).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={selections.length === 0 || stakeValue <= 0}
              className={cn(
                "w-full rounded-md py-2.5 text-sm font-bold transition-all",
                selections.length > 0 && stakeValue > 0
                  ? "bg-yellow-400 text-black hover:bg-yellow-300 active:scale-[0.98]"
                  : "cursor-not-allowed bg-[#2a2a2a] text-[#555]"
              )}
            >
              Place Bet
            </button>

            <p className="text-center text-[9px] text-[#555]">
              NoBet uses fictional NoCoins only. No real money involved.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
