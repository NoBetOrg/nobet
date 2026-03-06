import { cn } from "@/lib/utils";
import { PlusCircle, Wallet } from "lucide-react";

interface BalanceDisplayProps {
  balance?: number;
  className?: string;
  compact?: boolean;
}

export function BalanceDisplay({
  balance = 1000,
  className,
  compact = false,
}: BalanceDisplayProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <Wallet className="h-3.5 w-3.5 text-yellow-400" />
        <span className="text-sm font-bold text-yellow-400">NC {formatted}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1.5 rounded-md bg-[#2a2a2a] px-3 py-1.5">
        <Wallet className="h-4 w-4 text-yellow-400" />
        <div className="flex flex-col leading-none">
          <span className="text-[10px] text-[#7090b0]">NoCoins</span>
          <span className="text-sm font-bold text-yellow-400">NC {formatted}</span>
        </div>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-500"
      >
        <PlusCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Deposit</span>
      </button>
    </div>
  );
}
