import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useIncidents } from "@/lib/soc/store";
import type { StoredIncident } from "@/lib/soc/types";
import { EmptyState, SectionCard } from "./primitives";

/** Renders a section only when a real analyzed incident exists in this session. */
export function ActiveIncidentSection({
  title,
  description,
  emptyMessage,
  children,
}: {
  title: string;
  description: string;
  emptyMessage: string;
  children: (incident: StoredIncident) => ReactNode;
}) {
  const { active, incidents, select } = useIncidents();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {incidents.length > 1 && (
        <SectionCard title="Analyzed incident" subtitle="Select which analysis to view.">
          <div className="flex flex-wrap gap-1.5">
            {incidents.map((incident) => (
              <button
                key={incident.key}
                type="button"
                onClick={() => select(incident.key)}
                className={`rounded-sm border px-2 py-1 mono-xs transition-colors ${
                  incident.key === active?.key
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border bg-surface text-foreground/70 hover:text-foreground"
                }`}
              >
                {incident.alert_id ?? new Date(incident.analyzed_at).toLocaleTimeString()}
              </button>
            ))}
          </div>
        </SectionCard>
      )}

      {active ? (
        children(active)
      ) : (
        <div className="space-y-3">
          <EmptyState message={emptyMessage} hint="Analyze an alert to populate this section." />
          <div>
            <Button asChild size="sm" variant="outline">
              <Link to="/">Go to Analyze Alert</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
