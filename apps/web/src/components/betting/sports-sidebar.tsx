import { cn } from "@/lib/utils";
import { ChevronRight, Star, TrendingUp, Trophy, Tv } from "lucide-react";
import type { Sport } from "../../data/mock-matches";

interface SportsSidebarProps {
  sports: Sport[];
  activeSport?: string;
  onSportSelect?: (sportId: string) => void;
  className?: string;
}

const QUICK_LINKS = [
  { id: "featured", icon: Star, label: "Featured", color: "text-yellow-400" },
  { id: "live", icon: Tv, label: "Live Now", color: "text-green-400" },
  { id: "popular", icon: TrendingUp, label: "Popular", color: "text-blue-400" },
  { id: "competitions", icon: Trophy, label: "Competitions", color: "text-orange-400" },
];

export function SportsSidebar({
  sports,
  activeSport,
  onSportSelect,
  className,
}: SportsSidebarProps) {
  return (
    <aside className={cn("flex h-full flex-col overflow-y-auto bg-[#1a2e1a]", className)}>
      <div className="border-b border-[#2d4a2d] p-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#7aaa7a]">
          Quick Links
        </h2>
      </div>
      <div className="py-1">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => onSportSelect?.(link.id)}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                activeSport === link.id
                  ? "bg-[#2d4a2d] text-white"
                  : "text-[#b0d0b0] hover:bg-[#243824] hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", link.color)} />
              <span className="text-sm font-medium">{link.label}</span>
            </button>
          );
        })}
      </div>

      <div className="border-b border-t border-[#2d4a2d] p-3">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#7aaa7a]">Sports</h2>
      </div>
      <div className="py-1">
        {sports.map((sport) => (
          <button
            key={sport.id}
            type="button"
            onClick={() => onSportSelect?.(sport.id)}
            className={cn(
              "flex w-full items-center justify-between px-3 py-2 text-left transition-colors",
              activeSport === sport.id
                ? "bg-[#2d4a2d] text-white"
                : "text-[#b0d0b0] hover:bg-[#243824] hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base leading-none">{sport.icon}</span>
              <span className="text-sm font-medium">{sport.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#7aaa7a]">{sport.eventCount}</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#4a6a4a]" />
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
