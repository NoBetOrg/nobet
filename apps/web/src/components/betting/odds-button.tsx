import { cn } from "@/lib/utils";
import { useBetSlip } from "../../context/bet-slip-context";
import type { BetSelection } from "../../data/mock-matches";

interface OddsButtonProps {
  label: string;
  odds: number;
  matchId: string;
  matchName: string;
  market: string;
  selection: string;
  className?: string;
  disabled?: boolean;
}

export function OddsButton({
  label,
  odds,
  matchId,
  matchName,
  market,
  selection,
  className,
  disabled = false,
}: OddsButtonProps) {
  const { addSelection, isSelected } = useBetSlip();
  const selected = isSelected(matchId, market, selection);

  const handleClick = () => {
    if (disabled) return;
    const bet: BetSelection = {
      matchId,
      matchName,
      market,
      selection,
      odds,
    };
    addSelection(bet);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "group flex min-w-[64px] flex-col items-center justify-center rounded px-2 py-1.5 transition-all duration-150",
        "border text-xs font-medium",
        selected
          ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
          : "border-[#3d5a80] bg-[#1e3250] text-white hover:border-yellow-400/60 hover:bg-[#243d6a]",
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      <span
        className={cn(
          "text-[10px] leading-none",
          selected ? "text-yellow-400/80" : "text-[#7090b0]"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "mt-0.5 text-sm font-bold leading-none",
          selected ? "text-yellow-300" : "text-white"
        )}
      >
        {odds.toFixed(2)}
      </span>
    </button>
  );
}
