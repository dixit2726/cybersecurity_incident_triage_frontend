import { createFileRoute, Link } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionCard, SeverityBadge } from "@/components/soc/primitives";
import { useIncidents } from "@/lib/soc/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Incident History — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "Alerts analyzed during the current console session, with the severity assessment returned by the triage backend.",
      },
      { property: "og:title", content: "Incident History — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "Session record of alerts analyzed by the incident triage backend.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { incidents, activeKey, select, remove, clearAll } = useIncidents();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">Incident History</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Analyses performed in this browser session. The backend does not persist incidents, so
          history is cleared when the session ends.
        </p>
      </div>

      <SectionCard
        title="Analyzed incidents"
        count={incidents.length}
        actions={
          incidents.length > 0 ? (
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear session history
            </Button>
          ) : undefined
        }
      >
        {incidents.length === 0 ? (
          <EmptyState
            message="No incident history available yet."
            hint="Each analysis you run in this session is listed here."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Event type</TableHead>
                  <TableHead>Assessed severity</TableHead>
                  <TableHead>Analyzed at (local)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow
                    key={incident.key}
                    className={incident.key === activeKey ? "bg-accent/40" : undefined}
                  >
                    <TableCell className="font-mono text-[0.8125rem]">
                      {incident.alert_id ?? "Not available"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {incident.triage_report.event_type?.trim() || (
                        <span className="text-muted-foreground italic">Not available</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge
                        value={incident.triage_report.severity_assessment?.assessed_severity}
                      />
                    </TableCell>
                    <TableCell className="mono-xs text-muted-foreground">
                      {new Date(incident.analyzed_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => select(incident.key)}
                          asChild
                        >
                          <Link to="/">Open</Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(incident.key)}>
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
