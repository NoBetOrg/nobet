import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  minute?: number;
  score?: { home: number; away: number };
  compact?: boolean;
  className?: string;
}

export function LiveIndicator({ minute, score, compact = false, className }: LiveIndicatorProps) {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <span className="animate-live-pulse inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-bold text-green-500">LIVE</span>
        {minute !== undefined && <span className="text-xs text-green-400">{minute}'</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1.5 rounded bg-green-600/20 px-2 py-0.5">
        <span className="animate-live-pulse inline-block h-2 w-2 rounded-full bg-green-500" />
        <span className="text-xs font-bold text-green-400">LIVE</span>
        {minute !== undefined && <span className="text-xs text-green-300">{minute}'</span>}
      </div>
      {score !== undefined && (
        <span className="text-sm font-bold text-white">
          {score.home} - {score.away}
        </span>
      )}
    </div>
  );
}
