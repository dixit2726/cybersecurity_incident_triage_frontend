import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EmptyState, ErrorPanel, SectionCard, SeverityBadge } from "@/components/soc/primitives";
import { fetchIncident, fetchIncidents, describeError } from "@/lib/soc/api";
import { addIncidentFromResponse, useIncidents } from "@/lib/soc/store";
import type { DbIncidentSummary } from "@/lib/soc/types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Incident History — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "Persistent historical records of triaged cybersecurity incidents stored in Supabase PostgreSQL.",
      },
      { property: "og:title", content: "Incident History — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "Database incident history record for Cybersecurity Incident Triage AI.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { incidents: sessionIncidents, select, activeKey, clearAll } = useIncidents();
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const limit = 20;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["soc", "db_incidents", page],
    queryFn: () => fetchIncidents(limit, page * limit),
    staleTime: 10_000,
  });

  const dbIncidents: DbIncidentSummary[] = data?.incidents ?? [];
  const total = data?.total ?? 0;
  const hasDbRecords = dbIncidents.length > 0;

  async function handleOpenDbIncident(inc: DbIncidentSummary) {
    setOpeningId(inc.id);
    try {
      const res = await fetchIncident(inc.id);
      if (res?.incident) {
        const item = res.incident;
        addIncidentFromResponse({
          response: {
            success: true,
            alert_id: item.incident_id ?? item.id,
            triage_report: item.triage_report,
            processing_metadata: null,
          },
          alertText: item.alert_text || "",
          enableLive: false,
        });
        toast.success(`Loaded incident ${item.incident_id || inc.id} into workspace.`);
        navigate({ to: "/" });
      } else {
        toast.error("Failed to load incident details from database.");
      }
    } catch (err) {
      const desc = describeError(err);
      toast.error(`${desc.title}: ${desc.body}`);
    } finally {
      setOpeningId(null);
    }
  }

  function handleOpenSessionIncident(key: string) {
    select(key);
    navigate({ to: "/" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Database className="size-4 text-primary" aria-hidden />
            Incident History
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Historical incident triage reports persisted in Supabase PostgreSQL and current browser session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} aria-hidden />
            Refresh
          </Button>
          {sessionIncidents.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear session cache
            </Button>
          )}
        </div>
      </div>

      {isError && (
        <ErrorPanel
          title="Database history unavailable"
          body="Could not query Supabase incident records from backend. Showing session incidents if available."
        />
      )}

      {/* Main Database Incidents Section */}
      <SectionCard
        title="Persisted Incidents (Supabase)"
        subtitle="Saved automatically upon completion of each AI triage analysis."
        count={total || dbIncidents.length}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground gap-2">
            <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
            Loading incident history from database…
          </div>
        ) : dbIncidents.length === 0 ? (
          <EmptyState
            message="No persisted incidents found in database."
            hint="Run an analysis on the Analyze Alert page. Verified triage reports are saved to Supabase automatically."
          />
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident / Alert ID</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Network Path</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Triaged At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dbIncidents.map((inc) => (
                    <TableRow key={inc.id}>
                      <TableCell className="font-mono text-[0.8125rem] font-medium text-foreground">
                        {inc.incident_id || inc.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {inc.event_type?.trim() || (
                          <span className="text-muted-foreground italic">Security Incident</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <SeverityBadge value={inc.severity ?? undefined} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {inc.source_ip ? (
                          <span>
                            {inc.source_ip}
                            {inc.destination_ip ? ` → ${inc.destination_ip}` : ""}
                            {inc.destination_port ? `:${inc.destination_port}` : ""}
                          </span>
                        ) : (
                          <span className="italic">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {inc.analyst_review_required ? (
                          <Badge variant="outline" className="border-amber-500/40 text-amber-500 bg-amber-500/10 text-[0.6875rem]">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-[0.6875rem]">
                            Reviewed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="mono-xs text-muted-foreground">
                        {inc.created_at ? new Date(inc.created_at).toLocaleString() : "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDbIncident(inc)}
                          disabled={openingId === inc.id}
                          className="gap-1.5"
                        >
                          {openingId === inc.id ? (
                            <Loader2 className="size-3.5 animate-spin" aria-hidden />
                          ) : null}
                          Open Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {total > limit && (
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total} incidents
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={(page + 1) * limit >= total || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* Session Fallback Section if there are active session analyses */}
      {sessionIncidents.length > 0 && (
        <SectionCard
          title="Current Session Analyses"
          subtitle="In-memory cache from current browser session."
          count={sessionIncidents.length}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Assessed Severity</TableHead>
                  <TableHead>Analyzed At (Local)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionIncidents.map((incident) => (
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenSessionIncident(incident.key)}
                      >
                        Open Workspace
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
