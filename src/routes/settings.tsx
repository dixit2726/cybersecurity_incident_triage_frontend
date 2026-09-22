import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  BookOpenCheck,
  Cpu,
  Crosshair,
  RefreshCw,
  Server,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard, StatusDot } from "@/components/soc/primitives";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content: "System configuration and service health for the SOC incident triage console.",
      },
      { property: "og:title", content: "Settings — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "System status and service health monitoring.",
      },
    ],
  }),
  component: SettingsPage,
});

interface ServiceHealthRowProps {
  icon: typeof Server;
  name: string;
  description: string;
  statusText: string;
  isAvailable: boolean;
  isLoading: boolean;
  isManaged?: boolean;
}

function ServiceHealthRow({
  icon: Icon,
  name,
  description,
  statusText,
  isAvailable,
  isLoading,
  isManaged = false,
}: ServiceHealthRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 hover:bg-surface-raised/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-panel text-muted-foreground">
          <Icon className="size-4 text-foreground/80" aria-hidden />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">{name}</span>
            {isManaged && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
                Managed by backend
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:self-center pl-11 sm:pl-0">
        <StatusDot
          tone={
            isLoading
              ? "busy"
              : isAvailable
                ? "ok"
                : "danger"
          }
        />
        <span
          className={cn(
            "text-xs font-medium",
            isLoading
              ? "text-muted-foreground"
              : isAvailable
                ? "text-ok"
                : "text-danger"
          )}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}

function SettingsPage() {
  const health = useBackendHealth();
  const rawStatus = (health.data?.status ?? "").toLowerCase();
  const isConnected = !health.isError && (rawStatus === "healthy" || rawStatus === "running" || Boolean(health.data?.status));

  const lastCheckedText = health.dataUpdatedAt
    ? new Date(health.dataUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : health.isLoading
      ? "Checking now…"
      : "Not yet checked";

  return (
    <div className="space-y-4">
      {/* 1. Page Header */}
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          System configuration and service health
        </p>
      </div>

      {/* 2. System Status Card */}
      <SectionCard
        title="System Status"
        subtitle="Current operating state of the incident triage environment."
      >
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-md border p-4 transition-colors",
            isConnected
              ? "border-ok/30 bg-ok/5"
              : health.isLoading
                ? "border-border bg-surface/40"
                : "border-danger/30 bg-danger/5"
          )}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                isConnected
                  ? "border-ok/40 bg-ok/15 text-ok"
                  : health.isLoading
                    ? "border-border bg-muted text-muted-foreground"
                    : "border-danger/40 bg-danger/15 text-danger"
              )}
            >
              {isConnected ? (
                <ShieldCheck className="size-5" aria-hidden />
              ) : health.isLoading ? (
                <Activity className="size-5 animate-pulse" aria-hidden />
              ) : (
                <AlertCircle className="size-5" aria-hidden />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StatusDot
                  tone={
                    health.isLoading
                      ? "busy"
                      : isConnected
                        ? "ok"
                        : "danger"
                  }
                />
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  {health.isLoading
                    ? "Checking System Status…"
                    : isConnected
                      ? "System Operational"
                      : "Service Unavailable"}
                </h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {health.isLoading
                  ? "Verifying connection to triage service probes…"
                  : isConnected
                    ? "All required services are currently available."
                    : "The triage service is currently unreachable."}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 3. Service Health Section */}
      <SectionCard
        title="Service Health"
        subtitle="Component telemetry and subsystem operational status."
      >
        <div className="divide-y divide-border rounded-md border border-border bg-surface/30">
          <ServiceHealthRow
            icon={Server}
            name="Backend API"
            description="FastAPI triage service"
            statusText={
              health.isLoading
                ? "Checking…"
                : isConnected
                  ? "Connected"
                  : "Unavailable"
            }
            isAvailable={isConnected}
            isLoading={health.isLoading}
            isManaged={false}
          />
          <ServiceHealthRow
            icon={Cpu}
            name="AI Analysis"
            description="AI-powered incident analysis"
            statusText={
              health.isLoading
                ? "Checking…"
                : isConnected
                  ? "Available"
                  : "Unavailable"
            }
            isAvailable={isConnected}
            isLoading={health.isLoading}
            isManaged={true}
          />
          <ServiceHealthRow
            icon={BookOpenCheck}
            name="Knowledge Base"
            description="MITRE ATT&CK, response playbooks and CISA guidance"
            statusText={
              health.isLoading
                ? "Checking…"
                : isConnected
                  ? "Available"
                  : "Unavailable"
            }
            isAvailable={isConnected}
            isLoading={health.isLoading}
            isManaged={true}
          />
          <ServiceHealthRow
            icon={Crosshair}
            name="Threat Intelligence"
            description="IOC and threat intelligence lookups"
            statusText={
              health.isLoading
                ? "Checking…"
                : isConnected
                  ? "Available"
                  : "Unavailable"
            }
            isAvailable={isConnected}
            isLoading={health.isLoading}
            isManaged={true}
          />
        </div>
      </SectionCard>

      {/* 4. Connection Status & 5. About Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard
          title="Backend Connection"
          subtitle="Real-time connectivity to the triage engine."
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between rounded-md border border-border bg-surface/50 px-3.5 py-2.5">
              <span className="text-xs font-medium text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <StatusDot
                  tone={
                    health.isLoading
                      ? "busy"
                      : isConnected
                        ? "ok"
                        : "danger"
                  }
                />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    health.isLoading
                      ? "text-muted-foreground"
                      : isConnected
                        ? "text-ok"
                        : "text-danger"
                  )}
                >
                  {health.isLoading
                    ? "Checking…"
                    : isConnected
                      ? "Connected"
                      : "Unavailable"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-border bg-surface/50 px-3.5 py-2.5">
              <span className="text-xs font-medium text-muted-foreground">Last checked</span>
              <span className="mono-xs text-foreground/85">{lastCheckedText}</span>
            </div>

            <div className="pt-1">
              <Button
                size="sm"
                variant="outline"
                disabled={health.isFetching}
                onClick={() => void health.refetch()}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <RefreshCw
                  className={cn("size-3.5", health.isFetching && "animate-spin")}
                  aria-hidden
                />
                <span>{health.isFetching ? "Re-checking…" : "Re-check health"}</span>
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="About"
          subtitle="Platform information."
        >
          <div className="space-y-3.5">
            <div>
              <div className="label-caps">Product</div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                Cybersecurity Incident Triage AI
              </div>
            </div>

            <div>
              <div className="label-caps">Description</div>
              <p className="mt-1 text-xs leading-relaxed text-foreground/85">
                Evidence-grounded SOC incident analysis for cybersecurity alerts.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
