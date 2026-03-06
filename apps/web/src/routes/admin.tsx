import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { BarChart3, Gift, LayoutDashboard, LogOut, ShieldAlert, Trophy, Users } from "lucide-react";
import { useAuth } from "../context/auth-context";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV_ITEMS = [
  { path: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/matches", label: "Matches", icon: Trophy },
  { path: "/admin/rewards", label: "Rewards", icon: Gift },
];

function AdminLayout() {
  const { user, isPending, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="text-[#7090b0]">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] px-4 text-center">
        <ShieldAlert className="h-12 w-12 text-red-400 mb-4" />
        <h1 className="text-xl font-bold text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-[#7090b0]">
          You need admin privileges to access this area.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mt-4 rounded-md bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300"
        >
          Go Home
        </button>
      </div>
    );
  }

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return currentPath === path;
    return currentPath.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#121212]">
      {/* Admin sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[#2a2a2a] bg-[#1a1a1a] lg:flex">
        <div className="border-b border-[#2a2a2a] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-yellow-400 text-[10px] font-extrabold text-black">
              NB
            </div>
            <div>
              <p className="text-sm font-bold text-white">NoBet Admin</p>
              <p className="text-[10px] text-[#7090b0]">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate({ to: item.path })}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-yellow-400/10 text-yellow-400 font-semibold"
                    : "text-[#a0a0a0] hover:bg-[#252525] hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-yellow-400" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#2a2a2a] p-3">
          <button
            type="button"
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#7090b0] hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-12 items-center border-b border-[#2a2a2a] bg-[#1a1a1a] px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-yellow-400 text-[9px] font-extrabold text-black">
            NB
          </div>
          <span className="text-sm font-bold text-white">Admin</span>
        </div>
        <div className="ml-auto flex gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate({ to: item.path })}
                className={`rounded p-1.5 ${
                  isActive(item.path, item.exact)
                    ? "text-yellow-400"
                    : "text-[#7090b0] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-12 lg:pt-0">
        <div className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              {NAV_ITEMS.find((n) => isActive(n.path, n.exact))?.label ?? "Admin Panel"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="text-[11px] text-[#7090b0] hover:text-white"
          >
            ← Back to app
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
