import { Link } from "@tanstack/react-router";
import { useIsMutating } from "@tanstack/react-query";
import {
  Activity,
  History,
  Home,
  Info,
  Settings2,
  ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { useIncidents } from "@/lib/soc/store";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { StatusDot } from "./primitives";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/history", label: "Incident History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings2 },
  { to: "/about", label: "About", icon: Info },
] as const;

function HealthBadge() {
  const isBusy = useIsMutating() > 0;
  const { data, isError, isLoading, isFetching } = useBackendHealth();

  if (isBusy) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5">
        <StatusDot tone="busy" />
        <span className="mono-xs text-foreground/85">Processing…</span>
      </div>
    );
  }

  const status = (data?.status ?? "").toLowerCase();
  const tone = isLoading || isFetching ? "idle" : isError ? "danger" : status ? "ok" : "warn";
  const label = isLoading
    ? "Checking backend…"
    : isError
      ? "API unreachable"
      : status
        ? `API ${status}`
        : "API status unknown";

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5">
      <StatusDot tone={tone as "ok" | "warn" | "danger" | "idle" | "busy"} />
      <span className="mono-xs text-foreground/85">{label}</span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { active, incidents } = useIncidents();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
          <ShieldAlert className="size-5 text-primary" aria-hidden />
          <div className="min-w-0">
            <p className="truncate text-[0.8125rem] font-semibold text-sidebar-foreground">
              Incident Triage AI
            </p>
            <p className="mono-xs text-muted-foreground">SOC Console</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[0.8125rem] text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className:
                  "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary",
              }}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border px-4 py-3">
          <p className="label-caps">Session analyses</p>
          <p className="mono-xs mt-1 text-foreground/80">{incidents.length}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-panel/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 md:px-6">
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
                Incident Triage AI
              </h1>
              <p className="mono-xs text-muted-foreground">SOC Console</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <HealthBadge />
              {active ? (
                <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5">
                  <Activity className="size-3.5 text-primary" aria-hidden />
                  <span className="mono-xs text-foreground/85">
                    {active.alert_id ?? "Alert ID Active"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-md border border-border bg-surface/50 px-2.5 py-1.5">
                  <Activity className="size-3.5 text-muted-foreground" aria-hidden />
                  <span className="mono-xs text-muted-foreground">No active alert</span>
                </div>
              )}
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-2 py-2 md:hidden">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="shrink-0 rounded-md px-2.5 py-1.5 mono-xs text-foreground/75 hover:bg-accent"
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">{children}</main>
        <footer className="border-t border-border px-4 py-3 md:px-6">
          <p className="text-xs text-muted-foreground">
            AI-generated triage is advisory. A human SOC analyst makes the final determination.
          </p>
        </footer>
      </div>
    </div>
  );
}
