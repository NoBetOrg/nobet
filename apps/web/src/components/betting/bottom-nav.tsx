import { cn } from "@/lib/utils";
import { Home, Menu, Radio, ShoppingCart, Trophy } from "lucide-react";
import { useBetSlip } from "../../context/bet-slip-context";

type Tab = "home" | "live" | "sports" | "betslip" | "menu";

interface BottomNavProps {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

export function BottomNav({ activeTab = "home", onTabChange }: BottomNavProps) {
  const { selections, setIsOpen, isOpen } = useBetSlip();

  const tabs: { id: Tab; icon: React.ElementType; label: string }[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "live", icon: Radio, label: "Live" },
    { id: "sports", icon: Trophy, label: "Sports" },
    { id: "betslip", icon: ShoppingCart, label: "Bet Slip" },
    { id: "menu", icon: Menu, label: "Menu" },
  ];

  const handleTabChange = (tab: Tab) => {
    if (tab === "betslip") {
      setIsOpen(!isOpen);
    } else {
      onTabChange?.(tab);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#2a2a2a] bg-[#1a1a1a] lg:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === "betslip" ? isOpen : activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center py-2 text-xs transition-colors",
              isActive ? "text-yellow-400" : "text-[#6b7280] hover:text-[#a0a0a0]"
            )}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {tab.id === "betslip" && selections.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[9px] font-bold text-black">
                  {selections.length}
                </span>
              )}
            </div>
            <span className="mt-0.5 leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
