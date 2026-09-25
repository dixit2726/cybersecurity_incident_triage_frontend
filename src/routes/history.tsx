import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, History, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, SectionCard, SeverityBadge } from "@/components/soc/primitives";
import { extractNetworkDetails } from "@/components/soc/panels";
import { useIncidents } from "@/lib/soc/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Incident History — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content: "History of cybersecurity alert analyses initiated from user input.",
      },
    ],
  }),
  component: UserHistoryPage,
});

function UserHistoryPage() {
  const navigate = useNavigate();
  const { incidents, select, activeKey, remove, clearAll } = useIncidents();

  function handleOpen(key: string, alertId?: string | null) {
    select(key);
    navigate({ to: "/" });
    toast.success(`Loaded incident ${alertId || "report"} into workspace.`);
  }

  function handleRemove(key: string, alertId?: string | null) {
    remove(key);
    toast.info(`Removed incident ${alertId || ""} from history.`);
  }

  function handleClearAll() {
    if (window.confirm("Are you sure you want to clear your local incident history?")) {
      clearAll();
      toast.success("Incident history cleared.");
    }
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="User Incident History"
        subtitle="Saved analyses initiated from your alert submissions. Supabase remote database records are not displayed here."
        count={incidents.length}
        actions={
          incidents.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="gap-1.5 text-muted-foreground hover:text-danger hover:border-danger/40"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Clear History
            </Button>
          ) : undefined
        }
      >
        {incidents.length === 0 ? (
          <div className="py-8">
            <EmptyState
              icon={<History className="size-8 text-muted-foreground/60" />}
              message="No user-submitted alert analyses yet."
              hint="When you paste and analyze alerts in the Analyze Alert console, your triaged reports are stored here for quick reference."
            />
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: "/" })}
                className="gap-1.5"
              >
                Go to Analyze Alert
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[18%]">Incident / Alert ID</TableHead>
                  <TableHead className="w-[20%]">Event Type</TableHead>
                  <TableHead className="w-[12%]">Severity</TableHead>
                  <TableHead className="w-[26%]">Network Flow</TableHead>
                  <TableHead className="w-[14%]">Analyzed At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => {
                  const rep = incident.triage_report;
                  const net = extractNetworkDetails(incident.alert_text, rep);
                  const isCurrent = incident.key === activeKey;
                  const alertId = incident.alert_id ?? rep.alert_id;

                  const destStr = net.destinationIp
                    ? net.destinationPort
                      ? `${net.destinationIp}:${net.destinationPort}`
                      : net.destinationIp
                    : null;

                  return (
                    <TableRow
                      key={incident.key}
                      className={isCurrent ? "bg-primary/5 border-l-2 border-primary" : undefined}
                    >
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span>{alertId ?? "Alert ID N/A"}</span>
                          {isCurrent && (
                            <span className="rounded bg-primary/10 px-1 py-0.2 mono-xs text-[0.625rem] text-primary uppercase">
                              Active
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-foreground/90 font-medium">
                        {rep.event_type || "Security Incident"}
                      </TableCell>
                      <TableCell>
                        <SeverityBadge
                          value={rep.severity_assessment?.assessed_severity}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {net.sourceIp || destStr ? (
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-foreground/80">{net.sourceIp ?? "Internal"}</span>
                            <ArrowRight className="size-3 text-muted-foreground shrink-0" />
                            <span className="text-primary font-medium">{destStr ?? "Target"}</span>
                          </div>
                        ) : (
                          <span className="italic text-muted-foreground">Flow not reported</span>
                        )}
                      </TableCell>
                      <TableCell className="mono-xs text-muted-foreground">
                        {new Date(incident.analyzed_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant={isCurrent ? "default" : "outline"}
                            onClick={() => handleOpen(incident.key, alertId)}
                            className="gap-1 text-xs"
                          >
                            <ArrowUpRight className="size-3.5" />
                            Open
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemove(incident.key, alertId)}
                            className="text-muted-foreground hover:text-danger px-2"
                            title="Remove from history"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
