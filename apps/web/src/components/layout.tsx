import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Gift,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { useBetSlip } from "../context/bet-slip-context";
import { BalanceDisplay } from "./betting/balance-display";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { selections, setIsOpen, isOpen } = useBetSlip();
  const { user, isAdmin, signOut, isPending } = useAuth();
  const navigate = useNavigate();

  const userBalance = (user as { balance?: number })?.balance ?? 0;
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.slice(0, 2).toUpperCase() ?? "?");

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a2a2a] bg-[#1a1a1a]">
      <div className="flex h-13 items-center gap-2 px-3 sm:px-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="mr-1 text-[#a0a0a0] transition-colors hover:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="shrink-0 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-400 text-black font-extrabold text-sm leading-none select-none">
            NB
          </div>
          <span className="hidden text-base font-extrabold tracking-tight text-white sm:inline">
            No<span className="text-yellow-400">Bet</span>
          </span>
        </Link>

        <div
          className={`${searchOpen ? "flex" : "hidden sm:flex"} flex-1 items-center rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-1.5 gap-2 max-w-md mx-auto`}
        >
          <Search className="h-4 w-4 shrink-0 text-[#7090b0]" />
          <input
            type="text"
            placeholder="Search sports, teams, competitions..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#555] focus:outline-none min-w-0"
          />
          {searchOpen && (
            <button type="button" onClick={() => setSearchOpen(false)}>
              <X className="h-4 w-4 text-[#7090b0]" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="text-[#a0a0a0] transition-colors hover:text-white sm:hidden"
          >
            <Search className="h-5 w-5" />
          </button>

          {user && <BalanceDisplay balance={userBalance} />}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="relative hidden lg:flex items-center gap-1.5 rounded-md bg-[#2a2a2a] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#333]"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Bet Slip</span>
            {selections.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black">
                {selections.length}
              </span>
            )}
          </button>

          {isPending ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full outline-none ring-0 focus:ring-0"
                >
                  <Avatar className="h-8 w-8 cursor-pointer border border-[#3a3a3a] bg-[#2a2a2a]">
                    <AvatarFallback className="bg-yellow-400/20 text-yellow-400 text-xs font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border-[#2a2a2a] bg-[#1e1e1e] text-white"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.name ?? user.email}
                  </p>
                  <p className="text-[10px] text-[#7090b0] truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="cursor-pointer hover:bg-[#2a2a2a]"
                >
                  <BarChart3 className="mr-2 h-3.5 w-3.5 text-green-400" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/rewards" })}
                  className="cursor-pointer hover:bg-[#2a2a2a]"
                >
                  <Gift className="mr-2 h-3.5 w-3.5 text-purple-400" />
                  Rewards
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/admin" })}
                      className="cursor-pointer hover:bg-[#2a2a2a]"
                    >
                      <Settings className="mr-2 h-3.5 w-3.5 text-yellow-400" />
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-red-400 hover:bg-[#2a2a2a]"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              className="flex items-center gap-1.5 rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-bold text-black transition-colors hover:bg-yellow-300"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex h-9 items-center gap-0 overflow-x-auto border-t border-[#2a2a2a] px-3 scrollbar-none sm:px-4">
        {[
          "Football",
          "Basketball",
          "Tennis",
          "Baseball",
          "Ice Hockey",
          "Cricket",
          "Esports",
          "MMA",
        ].map((sport) => (
          <button
            key={sport}
            type="button"
            className="shrink-0 px-3 py-1.5 text-xs font-medium text-[#a0a0a0] transition-colors hover:text-white whitespace-nowrap first:pl-0"
          >
            {sport}
          </button>
        ))}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#1a1a1a] lg:block">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 rounded-md border border-yellow-400/20 bg-yellow-400/5 p-3">
          <p className="text-center text-xs text-yellow-400/80">
            ⚠️ NoBet uses fictional NoCoins only. No real money is involved. This app is designed to
            help people stop gambling with real money.
          </p>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-400 text-[10px] font-extrabold text-black">
              NB
            </div>
            <span className="text-sm font-bold text-white">
              No<span className="text-yellow-400">Bet</span>
            </span>
          </div>
          <p className="text-xs text-[#555]">
            © {new Date().getFullYear()} NoBet. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Terms", "Privacy", "Responsible Play", "Help"].map((link) => (
              <button
                key={link}
                type="button"
                className="text-xs text-[#555] transition-colors hover:text-[#a0a0a0]"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
