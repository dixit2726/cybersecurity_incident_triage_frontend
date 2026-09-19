import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, SectionCard, StatusDot } from "@/components/soc/primitives";
import { useBackendHealth } from "@/components/soc/AppShell";
import {
  diagnoseApiBaseUrl,
  getApiBaseUrl,
  getDefaultApiBaseUrl,
  setApiBaseUrl,
} from "@/lib/soc/api";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "Configure the triage backend address and review the live health status reported by the FastAPI service.",
      },
      { property: "og:title", content: "Settings — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "Backend connection settings for the incident triage console.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [value, setValue] = useState("");
  const health = useBackendHealth();
  const queryClient = useQueryClient();

  useEffect(() => {
    setValue(getApiBaseUrl());
  }, []);

  const status = (health.data?.status ?? "").toLowerCase();
  const diagnosis = value ? diagnoseApiBaseUrl(value) : null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The console is a presentation layer. All parsing, retrieval, threat intelligence and AI
          reasoning stay in the backend service.
        </p>
      </div>

      <SectionCard
        title="Backend connection"
        subtitle="Address of the FastAPI triage service, as reachable from this browser."
      >
        <div className="max-w-xl space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="api-base" className="label-caps">
              API base URL
            </Label>
            <Input
              id="api-base"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              spellCheck={false}
              className="bg-panel font-mono text-[0.8125rem]"
              placeholder={getDefaultApiBaseUrl()}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                setApiBaseUrl(value);
                setValue(getApiBaseUrl());
                void queryClient.invalidateQueries({ queryKey: ["soc", "health"] });
                toast.success("Backend address saved for this browser.");
              }}
            >
              Save address
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setApiBaseUrl("");
                setValue(getDefaultApiBaseUrl());
                void queryClient.invalidateQueries({ queryKey: ["soc", "health"] });
              }}
            >
              Reset to default
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void health.refetch()}>
              Re-check health
            </Button>
          </div>
          {diagnosis && (
            <div className="rounded-md border border-[var(--warn)]/40 bg-[var(--warn)]/10 px-3 py-2.5">
              <div className="text-sm font-medium text-foreground">
                This address cannot be reached from this page
              </div>
              <p className="mt-1 text-xs text-foreground/80">{diagnosis}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            The address is stored in this browser only. No credentials or API keys are held by the
            interface — the backend keeps its own keys server-side.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Where the address comes from"
        subtitle="Resolution order used by the interface."
      >
        <ol className="space-y-2 text-sm text-foreground/85">
          <li>
            <span className="font-medium">1. This Settings page</span> — the value you save, stored
            per browser. Currently:{" "}
            <span className="font-mono text-[0.8125rem]">{getApiBaseUrl()}</span>
          </li>
          <li>
            <span className="font-medium">2. Build configuration</span> —{" "}
            <span className="font-mono text-[0.8125rem]">VITE_API_BASE_URL</span>, set per
            environment. No public address is hard-coded anywhere in the interface.
          </li>
          <li>
            <span className="font-medium">3. Local default</span> —{" "}
            <span className="font-mono text-[0.8125rem]">http://127.0.0.1:8000</span>, valid only
            when the console itself runs on your machine.
          </li>
        </ol>
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p>
            A hosted HTTPS page can only call a publicly reachable HTTPS backend. A localhost address
            resolves to whichever machine issues the request, so it never reaches your development
            machine from a hosted page.
          </p>
          <p>
            The backend must also allow this page's address. Add it to the service's{" "}
            <span className="font-mono">ALLOWED_ORIGINS</span> setting before starting it; no backend
            code change is required.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="System status" subtitle="Reported by GET /health on the backend.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="label-caps">API backend</div>
            <div className="mt-1 flex items-center gap-2">
              <StatusDot
                tone={health.isLoading ? "idle" : health.isError ? "danger" : status ? "ok" : "warn"}
              />
              <span className="mono-xs text-foreground/85">
                {health.isLoading
                  ? "Checking…"
                  : health.isError
                    ? "Unreachable"
                    : status || "Status not reported"}
              </span>
            </div>
          </div>
          <Field label="Endpoint" value={`${getApiBaseUrl()}/health`} mono />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Component-level health for the RAG engines, threat-intelligence services and the AI
          reasoning layer is not available in the current backend, which exposes a single overall
          health status.
        </p>
      </SectionCard>
    </div>
  );
}
