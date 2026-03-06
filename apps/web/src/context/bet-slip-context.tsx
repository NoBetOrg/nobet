import { createContext, useCallback, useContext, useState } from "react";
import type { BetSelection } from "../data/mock-matches";

interface BetSlipContextValue {
  selections: BetSelection[];
  addSelection: (sel: BetSelection) => void;
  removeSelection: (matchId: string, market: string) => void;
  clearSlip: () => void;
  isSelected: (matchId: string, market: string, selection: string) => boolean;
  totalOdds: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const BetSlipContext = createContext<BetSlipContextValue | null>(null);

export function BetSlipProvider({ children }: { children: React.ReactNode }) {
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addSelection = useCallback((sel: BetSelection) => {
    setSelections((prev) => {
      const existingIndex = prev.findIndex(
        (s) => s.matchId === sel.matchId && s.market === sel.market
      );
      if (existingIndex !== -1) {
        if (prev[existingIndex].selection === sel.selection) {
          return prev.filter((_, i) => i !== existingIndex);
        }
        const updated = [...prev];
        updated[existingIndex] = sel;
        return updated;
      }
      return [...prev, sel];
    });
  }, []);

  const removeSelection = useCallback((matchId: string, market: string) => {
    setSelections((prev) => prev.filter((s) => !(s.matchId === matchId && s.market === market)));
  }, []);

  const clearSlip = useCallback(() => setSelections([]), []);

  const isSelected = useCallback(
    (matchId: string, market: string, selection: string) =>
      selections.some(
        (s) => s.matchId === matchId && s.market === market && s.selection === selection
      ),
    [selections]
  );

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);

  return (
    <BetSlipContext.Provider
      value={{
        selections,
        addSelection,
        removeSelection,
        clearSlip,
        isSelected,
        totalOdds,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlip must be used within BetSlipProvider");
  return ctx;
}
