import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionCard } from "@/components/soc/primitives";
import { buildExportPayload, copyIncidentJson, downloadIncidentJson } from "@/lib/soc/export";
import { useIncidents } from "@/lib/soc/store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "Export the unmodified triage reports returned by the backend for incidents analyzed in this session as JSON.",
      },
      { property: "og:title", content: "Reports — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "Export unmodified incident triage reports as JSON.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { incidents, active, select } = useIncidents();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Exports contain the backend response verbatim. Nothing is rewritten, summarized or added.
        </p>
      </div>

      {incidents.length === 0 ? (
        <EmptyState
          message="No reports available."
          hint="Analyze an alert to generate an exportable triage report."
        />
      ) : (
        <div className="space-y-4">
          <SectionCard title="Available reports" count={incidents.length}>
            <ul className="space-y-2">
              {incidents.map((incident) => (
                <li
                  key={incident.key}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-surface/50 px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => select(incident.key)}
                    className="min-w-0 text-left"
                  >
                    <span className="font-mono text-[0.8125rem] text-foreground">
                      {incident.alert_id ?? "Alert ID not available"}
                    </span>
                    <span className="ml-2 mono-xs text-muted-foreground">
                      {new Date(incident.analyzed_at).toLocaleString()}
                    </span>
                  </button>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => {
                        copyIncidentJson(incident)
                          .then(() => toast.success("Report JSON copied."))
                          .catch(() => toast.error("Clipboard access was blocked by the browser."));
                      }}
                    >
                      <Copy className="size-3.5" aria-hidden />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => downloadIncidentJson(incident)}
                    >
                      <Download className="size-3.5" aria-hidden />
                      JSON
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              PDF export is not available: the backend exposes no report rendering endpoint.
            </p>
          </SectionCard>

          {active && (
            <SectionCard title="Selected report payload" subtitle="Exact export contents.">
              <pre className="max-h-[28rem] overflow-auto rounded-md border border-border bg-panel px-3 py-3 mono-xs whitespace-pre-wrap break-words text-foreground/85">
                {JSON.stringify(buildExportPayload(active), null, 2)}
              </pre>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
}
