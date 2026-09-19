import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StoredIncident } from "@/lib/soc/types";
import {
  AssessmentBadge,
  BulletList,
  EmptyState,
  Field,
  MatchBadge,
  SectionCard,
  SeverityBadge,
} from "./primitives";

/** Renders only values present in the backend report. Nothing is inferred. */

export function OverviewPanel({ incident }: { incident: StoredIncident }) {
  const report = incident.triage_report;
  const severity = report.severity_assessment ?? {};
  const ms = incident.processing_metadata?.processing_time_ms;

  return (
    <div className="space-y-4">
      <SectionCard title="Incident assessment">
        {report.alert_summary?.trim() ? (
          <p className="text-sm leading-relaxed text-foreground/90">{report.alert_summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Alert summary not available.</p>
        )}
        {report.incident_assessment?.trim() ? (
          <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-foreground/90">
            {report.incident_assessment}
          </p>
        ) : null}
      </SectionCard>

      <SectionCard title="Severity assessment">
        <div className="flex flex-wrap items-center gap-3">
          <SeverityBadge label="Alert" value={severity.alert_severity} />
          <SeverityBadge label="Assessed" value={severity.assessed_severity} />
        </div>
        <div className="mt-3">
          <div className="label-caps">Justification</div>
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">
            {severity.justification?.trim() || (
              <span className="text-muted-foreground italic">Not available</span>
            )}
          </p>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Alert details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Alert ID" value={incident.alert_id ?? report.alert_id} mono />
            <Field label="Event type" value={report.event_type} />
            <Field label="Alert timestamp" value={report.timestamp} mono />
            <Field
              label="Analyzed at (local)"
              value={new Date(incident.analyzed_at).toLocaleString()}
              mono
            />
          </div>
        </SectionCard>

        <SectionCard title="Processing information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Processing time"
              value={typeof ms === "number" ? `${ms.toFixed(2)} ms` : null}
              mono
            />
            <Field
              label="Live threat intel requested"
              value={incident.enable_live ? "Enabled" : "Disabled"}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Model and retrieval counts are only shown when the backend returns them.
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Key evidence" count={report.behavioral_evidence?.length}>
        <BulletList
          items={report.behavioral_evidence}
          emptyMessage="No behavioral evidence returned for this incident."
        />
      </SectionCard>
    </div>
  );
}

export function EvidencePanel({ incident }: { incident: StoredIncident }) {
  const report = incident.triage_report;
  return (
    <div className="space-y-4">
      <SectionCard
        title="Behavioral evidence"
        subtitle="Extracted from the submitted alert by the backend parser."
        count={report.behavioral_evidence?.length}
      >
        <BulletList
          items={report.behavioral_evidence}
          emptyMessage="No behavioral evidence returned."
        />
      </SectionCard>

      <IocPanel incident={incident} />
      <ThreatIntelPanel incident={incident} />
      <MitrePanel incident={incident} />

      <div className="grid gap-4 xl:grid-cols-2">
        <PlaybookPanel incident={incident} />
        <CisaPanel incident={incident} />
      </div>

      <SectionCard
        title="Raw retrieval evidence"
        subtitle="Chunk IDs, source documents and similarity scores from the RAG stores."
      >
        <EmptyState
          message="Not available in the current backend."
          hint="POST /api/v1/triage returns the synthesized triage report only. The evidence package (chunk_id, source, evidence_text, similarity score) is not exposed by an endpoint, so it cannot be displayed here."
        />
      </SectionCard>
    </div>
  );
}

export function IocPanel({ incident }: { incident: StoredIncident }) {
  const items = (incident.triage_report.ioc_findings ?? []).filter(Boolean);
  return (
    <SectionCard
      title="IOC findings"
      subtitle="Indicators extracted by the backend parser."
      count={items.length}
    >
      {items.length === 0 ? (
        <EmptyState message="No indicators of compromise were returned for this incident." />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[38%]">Indicator</TableHead>
                <TableHead className="w-[14%]">Type</TableHead>
                <TableHead>Context</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={`${item.ioc ?? "ioc"}-${i}`}>
                  <TableCell className="font-mono text-[0.8125rem] break-all">
                    {item.ioc?.trim() || "Not available"}
                  </TableCell>
                  <TableCell className="mono-xs uppercase text-muted-foreground">
                    {item.type?.trim() || "unknown"}
                  </TableCell>
                  <TableCell className="text-sm text-foreground/85">
                    {item.context?.trim() || "Not available"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </SectionCard>
  );
}

export function ThreatIntelPanel({ incident }: { incident: StoredIncident }) {
  const items = (incident.triage_report.threat_intelligence_findings ?? []).filter(Boolean);
  return (
    <SectionCard
      title="Threat intelligence findings"
      subtitle="Lookup outcomes exactly as reported by the backend. A no-match result does not mean the indicator is benign."
      count={items.length}
    >
      {items.length === 0 ? (
        <EmptyState message="No threat-intelligence lookups were returned for this incident." />
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={`${item.ioc ?? "ti"}-${i}`}
              className="rounded-md border border-border bg-surface/50 px-3 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[0.8125rem] break-all text-foreground">
                  {item.ioc?.trim() || "Not available"}
                </span>
                <MatchBadge matched={item.match_found} />
                <span className="mono-xs text-muted-foreground">
                  {item.source?.trim() || "source not reported"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {item.interpretation?.trim() || "No interpretation returned."}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

export function MitrePanel({ incident }: { incident: StoredIncident }) {
  const items = (incident.triage_report.mitre_analysis ?? []).filter(Boolean);
  return (
    <SectionCard
      title="MITRE ATT&CK analysis"
      subtitle="Techniques returned by the backend. Retrieval similarity is not a confidence value."
      count={items.length}
    >
      {items.length === 0 ? (
        <EmptyState message="No MITRE ATT&CK techniques were returned for this incident." />
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={`${item.technique_id ?? "t"}-${i}`}
              className="rounded-md border border-border bg-surface/50 px-3 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-mono text-[0.8125rem] text-primary">
                    {item.technique_id?.trim() || "ID not available"}
                  </span>
                  <span className="ml-2 text-sm font-medium text-foreground">
                    {item.technique_name?.trim() || "Name not available"}
                  </span>
                </div>
                <AssessmentBadge value={item.assessment} />
              </div>
              {item.reason?.trim() && (
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.reason}</p>
              )}
              {Array.isArray(item.evidence) && item.evidence.length > 0 && (
                <div className="mt-3 border-t border-border pt-2">
                  <div className="label-caps">Supporting evidence</div>
                  <ul className="mt-1 space-y-1">
                    {item.evidence
                      .filter((e) => typeof e === "string" && e.trim() !== "")
                      .map((e, j) => (
                        <li key={j} className="mono-xs text-foreground/75">
                          • {e}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

export function PlaybookPanel({ incident }: { incident: StoredIncident }) {
  const items = incident.triage_report.playbook_recommendations ?? [];
  return (
    <SectionCard
      title="Response playbook recommendations"
      subtitle="Only playbook steps returned for this incident."
      count={items.length}
    >
      <BulletList
        items={items}
        emptyMessage="No playbook recommendations were returned for this incident."
      />
    </SectionCard>
  );
}

export function CisaPanel({ incident }: { incident: StoredIncident }) {
  const items = incident.triage_report.cisa_guidance ?? [];
  return (
    <SectionCard
      title="CISA guidance"
      subtitle="Guidance retrieved by the backend for this incident."
      count={items.length}
    >
      <BulletList items={items} emptyMessage="No CISA guidance was returned for this incident." />
    </SectionCard>
  );
}

export function ActionsPanel({ incident }: { incident: StoredIncident }) {
  const report = incident.triage_report;
  return (
    <div className="space-y-4">
      <SectionCard
        title="Recommended actions"
        subtitle="Advisory only. Confirm evidence before containment or remediation."
        count={report.recommended_actions?.length}
      >
        <BulletList
          items={report.recommended_actions}
          emptyMessage="No recommended actions were returned for this incident."
        />
      </SectionCard>
      <SectionCard title="Limitations" count={report.limitations?.length}>
        <BulletList
          items={report.limitations}
          emptyMessage="No limitations were reported for this incident."
        />
      </SectionCard>
    </div>
  );
}

export function AlertSourcePanel({ incident }: { incident: StoredIncident }) {
  return (
    <SectionCard
      title="Submitted alert"
      subtitle="Untrusted analyst input, rendered as plain text."
    >
      <pre className="max-h-96 overflow-auto rounded-md border border-border bg-panel px-3 py-3 mono-xs whitespace-pre-wrap break-words text-foreground/85">
        {incident.alert_text}
      </pre>
    </SectionCard>
  );
}
