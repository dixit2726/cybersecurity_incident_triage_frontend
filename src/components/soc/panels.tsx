import { useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  Network,
  Radio,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { StoredIncident, TriageReport } from "@/lib/soc/types";
import {
  AssessmentBadge,
  BulletList,
  EmptyState,
  Field,
  MatchBadge,
  SectionCard,
  SeverityBadge,
} from "./primitives";

/**
 * Extracts network metadata (Source IP, Destination IP, Protocol, Port)
 * from the alert text, IOC findings, and threat intelligence.
 */
export function extractNetworkDetails(alertText: string, report: TriageReport) {
  let sourceIp: string | null = null;
  let destinationIp: string | null = null;
  let protocol: string | null = null;
  let destinationPort: string | null = null;

  // 1. Regex over raw alert text
  const srcMatch = alertText.match(/(?:Source\s*(?:IP)?|src(?:_ip)?)\s*[:=]\s*([0-9a-fA-F.:]+)/i);
  if (srcMatch?.[1]) sourceIp = srcMatch[1].trim();

  const dstMatch = alertText.match(/(?:Destination\s*(?:IP)?|dst(?:_ip)?)\s*[:=]\s*([0-9a-fA-F.:]+)/i);
  if (dstMatch?.[1]) destinationIp = dstMatch[1].trim();

  const protoMatch = alertText.match(/(?:Protocol|proto)\s*[:=]\s*([A-Za-z0-9_-]+)/i);
  if (protoMatch?.[1]) protocol = protoMatch[1].trim();

  const portMatch = alertText.match(/(?:Destination\s*Port|dst_port|Port)\s*[:=]\s*(\d+)/i);
  if (portMatch?.[1]) destinationPort = portMatch[1].trim();

  // 2. Cross-reference extracted IOC findings
  for (const ioc of report.ioc_findings ?? []) {
    const val = (ioc.ioc ?? "").trim();
    const ctx = (ioc.context ?? "").toLowerCase();
    const type = (ioc.type ?? "").toLowerCase();

    if (type.includes("ip") || type.includes("ipv4")) {
      if (!sourceIp && (ctx.includes("source") || ctx.includes("attacker") || ctx.includes("origin") || ctx.includes("client") || ctx.includes("src"))) {
        sourceIp = val;
      } else if (!destinationIp && (ctx.includes("dest") || ctx.includes("target") || ctx.includes("server") || ctx.includes("dst"))) {
        destinationIp = val;
      }
    }

    if (!destinationIp && type.includes("url") && val) {
      try {
        const u = new URL(val);
        destinationIp = u.hostname;
        if (u.port && !destinationPort) destinationPort = u.port;
        if (!protocol && u.protocol) protocol = u.protocol.replace(":", "").toUpperCase();
      } catch {
        // Not a standard URL
      }
    }
  }

  // 3. Check Threat Intelligence findings for target URL/host
  if (!destinationIp && report.threat_intelligence_findings) {
    for (const ti of report.threat_intelligence_findings) {
      const val = (ti.ioc ?? ti.queried_ioc ?? "").trim();
      if (val.startsWith("http")) {
        try {
          const u = new URL(val);
          destinationIp = u.hostname;
          if (u.port && !destinationPort) destinationPort = u.port;
          if (!protocol && u.protocol) protocol = u.protocol.replace(":", "").toUpperCase();
        } catch {}
      }
    }
  }

  return { sourceIp, destinationIp, protocol, destinationPort };
}

/* =========================================================================
   1. OVERVIEW TAB
   ========================================================================= */

export function OverviewPanel({ incident }: { incident: StoredIncident }) {
  const report = incident.triage_report;
  const severity = report.severity_assessment ?? {};
  const net = extractNetworkDetails(incident.alert_text, report);
  const tiFindings = (report.threat_intelligence_findings ?? []).filter(Boolean);
  const mitreItems = (report.mitre_analysis ?? []).filter(Boolean);
  const actions = (report.recommended_actions ?? []).filter(Boolean);
  const cisaItems = (report.cisa_guidance ?? []).filter(Boolean);

  const destWithPort = net.destinationIp
    ? net.destinationPort
      ? `${net.destinationIp}:${net.destinationPort}`
      : net.destinationIp
    : null;

  return (
    <div className="space-y-4">
      {/* 1. Incident Assessment & Compact Key Metric Cards */}
      <SectionCard title="Incident Assessment" subtitle="Core telemetry and triage parameters">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {/* Severity */}
          <div className="rounded-md border border-border bg-surface/60 p-3">
            <span className="label-caps block text-muted-foreground">Severity</span>
            <div className="mt-1.5 flex items-center">
              <SeverityBadge value={severity.assessed_severity || severity.alert_severity || "UNKNOWN"} />
            </div>
            {severity.alert_severity && severity.alert_severity !== severity.assessed_severity && (
              <span className="mono-xs mt-1 block text-muted-foreground">
                Alert: {severity.alert_severity}
              </span>
            )}
          </div>

          {/* Incident Type */}
          <div className="rounded-md border border-border bg-surface/60 p-3">
            <span className="label-caps block text-muted-foreground">Incident Type</span>
            <p className="mt-1 text-sm font-semibold tracking-tight text-foreground truncate">
              {report.event_type || "Security Incident"}
            </p>
            <span className="mono-xs mt-0.5 block text-muted-foreground truncate">
              {incident.alert_id ?? report.alert_id ?? "Alert ID N/A"}
            </span>
          </div>

          {/* Source -> Destination */}
          <div className="rounded-md border border-border bg-surface/60 p-3 sm:col-span-2 lg:col-span-2">
            <span className="label-caps block text-muted-foreground">Source → Destination</span>
            <div className="mt-1 flex items-center gap-2 overflow-hidden text-xs">
              <span className="font-mono text-[0.8125rem] text-primary truncate" title={net.sourceIp ?? "Unknown"}>
                {net.sourceIp ?? "Internal Host"}
              </span>
              <ArrowRight className="size-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-[0.8125rem] text-foreground font-medium truncate" title={destWithPort ?? "Unknown"}>
                {destWithPort ?? "External Target"}
              </span>
            </div>
            <span className="mono-xs mt-1 block text-muted-foreground">
              Direction: Egress / Flow Telemetry
            </span>
          </div>

          {/* Protocol & Port */}
          <div className="rounded-md border border-border bg-surface/60 p-3">
            <span className="label-caps block text-muted-foreground">Protocol & Port</span>
            <p className="mt-1 font-mono text-xs text-foreground">
              {net.protocol || "IP"} {net.destinationPort ? `:${net.destinationPort}` : ""}
            </p>
            <span className="mono-xs mt-0.5 block text-muted-foreground">
              {report.timestamp ? new Date(report.timestamp).toLocaleDateString() : "Timestamp reported"}
            </span>
          </div>
        </div>

        {severity.justification && (
          <div className="mt-3 rounded-md border border-border/70 bg-surface/30 px-3 py-2">
            <span className="label-caps text-muted-foreground">Severity Justification</span>
            <p className="mt-0.5 text-xs text-foreground/85 leading-relaxed">
              {severity.justification}
            </p>
          </div>
        )}
      </SectionCard>

      {/* 2. Threat Intelligence Section */}
      <SectionCard
        title="Threat Intelligence"
        subtitle="Authoritative indicator lookups against local MISP / external feeds"
        count={tiFindings.length}
      >
        {tiFindings.length === 0 ? (
          <EmptyState message="No threat intelligence lookups returned for this incident." />
        ) : (
          <div className="space-y-3">
            {tiFindings.map((ti, idx) => {
              const iocVal = ti.ioc || ti.queried_ioc || "Unknown";
              const isMatch = Boolean(ti.match_found);
              return (
                <div
                  key={idx}
                  className={`rounded-md border p-3 transition-colors ${
                    isMatch
                      ? "border-ok/40 bg-ok/5"
                      : "border-border bg-surface/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <MatchBadge matched={isMatch} />
                      <span className="rounded bg-surface px-1.5 py-0.5 mono-xs text-muted-foreground border border-border/60">
                        Source: {ti.source || "Threat Feeds"}
                      </span>
                      {ti.threat_type && (
                        <span className="rounded bg-surface px-1.5 py-0.5 mono-xs text-muted-foreground border border-border/60">
                          Threat: {ti.threat_type}
                        </span>
                      )}
                      {ti.ioc_type && (
                        <span className="rounded bg-surface px-1.5 py-0.5 mono-xs uppercase text-muted-foreground border border-border/60">
                          Type: {ti.ioc_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <div className="flex items-center gap-2">
                      <span className="label-caps text-muted-foreground shrink-0">IOC:</span>
                      <code className="font-mono text-xs break-all text-foreground/90 font-medium select-all">
                        {iocVal}
                      </code>
                    </div>
                    {ti.interpretation && (
                      <p className="mt-2 text-xs leading-relaxed text-foreground/80">
                        {ti.interpretation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* 3. AI Assessment */}
      <SectionCard title="AI Assessment" subtitle="Synthesis grounded in extracted telemetry and knowledge retrieval">
        {report.alert_summary && (
          <div className="mb-3 rounded-md border border-border/60 bg-surface/30 p-3">
            <span className="label-caps text-muted-foreground">Alert Summary</span>
            <p className="mt-1 text-xs leading-relaxed text-foreground/90 font-medium">
              {report.alert_summary}
            </p>
          </div>
        )}
        {report.incident_assessment ? (
          <div className="text-xs leading-relaxed text-foreground/90 whitespace-pre-line space-y-2">
            {report.incident_assessment}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No detailed incident assessment returned.</p>
        )}
      </SectionCard>

      {/* 4. Compact Summary Cards: Related MITRE, Recommended Actions, CISA Guidance */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Related MITRE ATT&CK */}
        <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Shield className="size-3.5 text-primary" />
                Related MITRE ATT&CK
              </span>
              <span className="mono-xs text-muted-foreground">{mitreItems.length}</span>
            </div>
            {mitreItems.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground italic">None mapped</p>
            ) : (
              <ul className="mt-2.5 space-y-2">
                {mitreItems.slice(0, 3).map((m, i) => (
                  <li key={i} className="text-xs">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-primary font-semibold">{m.technique_id}</span>
                      <AssessmentBadge value={m.assessment} />
                    </div>
                    <p className="mt-0.5 text-foreground/80 truncate">{m.technique_name}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-ok" />
                Recommended Actions
              </span>
              <span className="mono-xs text-muted-foreground">{actions.length}</span>
            </div>
            {actions.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground italic">None reported</p>
            ) : (
              <ol className="mt-2.5 space-y-1.5">
                {actions.slice(0, 3).map((act, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/85">
                    <span className="font-mono text-muted-foreground">{i + 1}.</span>
                    <span className="line-clamp-2 leading-tight">{act}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* CISA Guidance */}
        <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="size-3.5 text-blue-400" />
                CISA Guidance
              </span>
              <span className="mono-xs text-muted-foreground">{cisaItems.length}</span>
            </div>
            {cisaItems.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground italic">None retrieved</p>
            ) : (
              <ul className="mt-2.5 space-y-1.5">
                {cisaItems.slice(0, 3).map((g, i) => (
                  <li key={i} className="text-xs text-foreground/85 line-clamp-2 leading-tight">
                    • {g}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. EVIDENCE TAB
   ========================================================================= */

export function EvidencePanel({ incident }: { incident: StoredIncident }) {
  const report = incident.triage_report;
  const net = extractNetworkDetails(incident.alert_text, report);
  const iocs = (report.ioc_findings ?? []).filter(Boolean);
  const behaviors = (report.behavioral_evidence ?? []).filter(Boolean);
  const ms = incident.processing_metadata?.processing_time_ms;

  return (
    <div className="space-y-4">
      {/* Extracted Indicators (IOCs) */}
      <SectionCard
        title="Extracted Indicators of Compromise (IOCs)"
        subtitle="System and network indicators parsed from alert telemetry"
        count={iocs.length}
      >
        {iocs.length === 0 ? (
          <EmptyState message="No indicators of compromise were returned for this incident." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%]">Indicator</TableHead>
                  <TableHead className="w-[15%]">Type</TableHead>
                  <TableHead>Context / Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {iocs.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs break-all select-all font-medium text-foreground">
                      {item.ioc?.trim() || "N/A"}
                    </TableCell>
                    <TableCell className="mono-xs uppercase text-muted-foreground">
                      {item.type?.trim() || "unknown"}
                    </TableCell>
                    <TableCell className="text-xs text-foreground/80">
                      {item.context?.trim() || "No context reported"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Network Evidence & Alert Metadata */}
      <SectionCard title="Network Evidence & Alert Metadata" subtitle="Extracted headers, flow vectors, and timestamps">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Source IP" value={net.sourceIp} mono />
          <Field label="Destination IP" value={net.destinationIp} mono />
          <Field label="Destination Port" value={net.destinationPort} mono />
          <Field label="Observed Protocol" value={net.protocol} mono />
          <Field label="Event Type" value={report.event_type} />
          <Field label="Alert Identifier" value={incident.alert_id ?? report.alert_id} mono />
          <Field label="Alert Timestamp" value={report.timestamp} mono />
          <Field
            label="Analyzed At (Local)"
            value={new Date(incident.analyzed_at).toLocaleString()}
            mono
          />
        </div>
        {typeof ms === "number" && (
          <div className="mt-3 border-t border-border/60 pt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Processing Duration</span>
            <span className="font-mono">{ms.toFixed(2)} ms</span>
          </div>
        )}
      </SectionCard>

      {/* Behavioral Evidence */}
      <SectionCard
        title="Behavioral Evidence"
        subtitle="Observed patterns and actions extracted from the alert body"
        count={behaviors.length}
      >
        <BulletList
          items={behaviors}
          emptyMessage="No behavioral evidence returned for this incident."
        />
      </SectionCard>

      {/* Threat Intelligence Evidence */}
      <ThreatIntelPanel incident={incident} />
    </div>
  );
}

/* =========================================================================
   3. DETECTION TAB
   ========================================================================= */

export function DetectionPanel({ incident }: { incident: StoredIncident }) {
  const report = incident.triage_report;
  const mitreList = (report.mitre_analysis ?? []).filter(Boolean);
  const tiFindings = (report.threat_intelligence_findings ?? []).filter(Boolean);
  const cisaGuidance = (report.cisa_guidance ?? []).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* MITRE ATT&CK */}
      <SectionCard
        title="MITRE ATT&CK Mapping"
        subtitle="Adversary tactics and techniques identified from telemetry and behavioral correlation"
        count={mitreList.length}
      >
        {mitreList.length === 0 ? (
          <EmptyState message="No MITRE ATT&CK techniques were mapped for this incident." />
        ) : (
          <div className="space-y-3">
            {mitreList.map((item, i) => (
              <div
                key={i}
                className="rounded-md border border-border bg-surface/50 p-3.5 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {item.technique_id || "T-ID"}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {item.technique_name || "Technique"}
                    </span>
                  </div>
                  <AssessmentBadge value={item.assessment} />
                </div>

                {item.reason && (
                  <p className="mt-2 text-xs leading-relaxed text-foreground/85">
                    {item.reason}
                  </p>
                )}

                {Array.isArray(item.evidence) && item.evidence.length > 0 && (
                  <div className="mt-3 rounded border border-border/60 bg-surface/30 p-2">
                    <span className="label-caps text-muted-foreground block mb-1">
                      Correlated Evidence
                    </span>
                    <ul className="space-y-1">
                      {item.evidence.map((ev, idx) => (
                        <li key={idx} className="mono-xs text-foreground/75 flex items-start gap-1.5">
                          <span className="text-primary">•</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Threat Intelligence (Authoritative values) */}
      <SectionCard
        title="Threat Intelligence Lookups"
        subtitle="Authoritative indicator queries against MISP and public OSINT repositories"
        count={tiFindings.length}
      >
        {tiFindings.length === 0 ? (
          <EmptyState message="No threat intelligence lookups returned for this incident." />
        ) : (
          <div className="space-y-3">
            {tiFindings.map((ti, i) => {
              const qIoc = ti.queried_ioc || ti.ioc || "Unknown";
              return (
                <div
                  key={i}
                  className={`rounded-md border p-3.5 ${
                    ti.match_found
                      ? "border-ok/40 bg-ok/5"
                      : "border-border bg-surface/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <MatchBadge matched={ti.match_found} />
                      <span className="mono-xs px-2 py-0.5 rounded bg-surface border border-border text-foreground/90 font-medium">
                        Source: {ti.source || "Database"}
                      </span>
                    </div>
                    {ti.ioc_type && (
                      <span className="mono-xs text-muted-foreground uppercase">
                        Type: {ti.ioc_type}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                    <div>
                      <span className="label-caps text-muted-foreground">Queried IOC</span>
                      <p className="font-mono text-xs break-all text-foreground mt-0.5 select-all">
                        {qIoc}
                      </p>
                    </div>
                    <div>
                      <span className="label-caps text-muted-foreground">Threat Type</span>
                      <p className="font-mono text-xs text-foreground mt-0.5">
                        {ti.threat_type || "None cataloged"}
                      </p>
                    </div>
                  </div>

                  {ti.interpretation && (
                    <div className="mt-3 border-t border-border/60 pt-2">
                      <span className="label-caps text-muted-foreground">Analyst Interpretation</span>
                      <p className="mt-0.5 text-xs text-foreground/85 leading-relaxed">
                        {ti.interpretation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Detection Guidance */}
      {cisaGuidance.length > 0 && (
        <SectionCard title="CISA Detection Guidance" subtitle="Advisories and detection heuristics relevant to this incident">
          <BulletList items={cisaGuidance} emptyMessage="No CISA detection guidance returned." />
        </SectionCard>
      )}
    </div>
  );
}

/* =========================================================================
   4. RESPONSE TAB
   ========================================================================= */

export function ResponsePanel({ incident }: { incident: StoredIncident }) {
  const report = incident.triage_report;
  const actions = (report.recommended_actions ?? []).filter(Boolean);
  const playbooks = (report.playbook_recommendations ?? []).filter(Boolean);
  const cisa = (report.cisa_guidance ?? []).filter(Boolean);
  const limitations = (report.limitations ?? []).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Recommended Actions */}
      <SectionCard
        title="Recommended Containment & Remediation Actions"
        subtitle="Prioritized operational steps for the SOC response team"
        count={actions.length}
      >
        {actions.length === 0 ? (
          <EmptyState message="No recommended actions were returned for this incident." />
        ) : (
          <ol className="space-y-2.5">
            {actions.map((action, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-md border border-border bg-surface/50 p-3"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/30 font-mono text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-medium leading-relaxed text-foreground">
                    {action}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </SectionCard>

      {/* Response Playbooks */}
      <SectionCard
        title="Response Playbook Guidance"
        subtitle="Standard operating procedures mapped to this event type"
        count={playbooks.length}
      >
        <BulletList
          items={playbooks}
          emptyMessage="No response playbooks were returned for this incident."
        />
      </SectionCard>

      {/* CISA Guidance */}
      <SectionCard
        title="CISA Defensive Guidance"
        subtitle="US Cybersecurity & Infrastructure Security Agency guidelines"
        count={cisa.length}
      >
        <BulletList
          items={cisa}
          emptyMessage="No CISA guidance was retrieved for this incident."
        />
      </SectionCard>

      {/* Limitations */}
      {limitations.length > 0 && (
        <SectionCard title="Assessment Limitations" count={limitations.length}>
          <BulletList
            items={limitations}
            emptyMessage="No limitations reported for this incident."
          />
        </SectionCard>
      )}
    </div>
  );
}

/* =========================================================================
   5. ALERT TAB
   ========================================================================= */

export function AlertSourcePanel({ incident }: { incident: StoredIncident }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard
      .writeText(incident.alert_text)
      .then(() => {
        setCopied(true);
        toast.success("Raw alert copied to clipboard.");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Could not access clipboard."));
  }

  return (
    <SectionCard
      title="Submitted Security Alert"
      subtitle="Original, complete raw alert as supplied by the analyst"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-1.5"
        >
          <Copy className="size-3.5" aria-hidden />
          {copied ? "Copied" : "Copy Alert"}
        </Button>
      }
    >
      <div className="relative">
        <pre className="max-h-[500px] overflow-auto rounded-md border border-border bg-panel p-4 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap break-all select-all">
          {incident.alert_text}
        </pre>
      </div>
    </SectionCard>
  );
}

/* =========================================================================
   BACKWARDS COMPATIBILITY EXPORTS
   ========================================================================= */

export function IocPanel({ incident }: { incident: StoredIncident }) {
  return <EvidencePanel incident={incident} />;
}

export function ThreatIntelPanel({ incident }: { incident: StoredIncident }) {
  const items = (incident.triage_report.threat_intelligence_findings ?? []).filter(Boolean);
  return (
    <SectionCard
      title="Threat Intelligence Findings"
      subtitle="Lookup outcomes as reported by the backend"
      count={items.length}
    >
      {items.length === 0 ? (
        <EmptyState message="No threat intelligence lookups were returned for this incident." />
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-md border border-border bg-surface/50 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs break-all text-foreground font-medium">
                  {item.ioc || item.queried_ioc || "Unknown"}
                </span>
                <MatchBadge matched={item.match_found} />
                <span className="mono-xs text-muted-foreground">
                  {item.source || "Database"}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-foreground/85">
                {item.interpretation || "No interpretation returned."}
              </p>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export function MitrePanel({ incident }: { incident: StoredIncident }) {
  return <DetectionPanel incident={incident} />;
}

export function PlaybookPanel({ incident }: { incident: StoredIncident }) {
  const items = incident.triage_report.playbook_recommendations ?? [];
  return (
    <SectionCard
      title="Response Playbook Recommendations"
      subtitle="Playbook steps returned for this incident"
      count={items.length}
    >
      <BulletList items={items} emptyMessage="No playbook recommendations returned." />
    </SectionCard>
  );
}

export function CisaPanel({ incident }: { incident: StoredIncident }) {
  const items = incident.triage_report.cisa_guidance ?? [];
  return (
    <SectionCard
      title="CISA Guidance"
      subtitle="Guidance retrieved for this incident"
      count={items.length}
    >
      <BulletList items={items} emptyMessage="No CISA guidance returned." />
    </SectionCard>
  );
}

export function ActionsPanel({ incident }: { incident: StoredIncident }) {
  return <ResponsePanel incident={incident} />;
}
