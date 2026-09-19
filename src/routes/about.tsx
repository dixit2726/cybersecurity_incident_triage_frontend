import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  Bot,
  CheckCircle2,
  Cpu,
  Crosshair,
  Database,
  FileCode,
  FileText,
  History,
  Info,
  Layers,
  ListChecks,
  Network,
  Radar,
  ScrollText,
  Server,
  Settings2,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { SectionCard } from "@/components/soc/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "Architectural overview and functional guide for the Cybersecurity Incident Triage AI platform.",
      },
      { property: "og:title", content: "About — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content:
          "Learn how Incident Triage AI parses alerts, retrieves multi-source RAG evidence, and synthesizes incident triage for SOC analysts.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-6 text-primary" aria-hidden />
          <h1 className="text-xl font-bold tracking-tight text-foreground">Incident Triage AI</h1>
        </div>
        <p className="mt-1 text-sm font-medium text-primary/90">
          Evidence-Grounded SOC Incident Analysis
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          An operational guide to the platform architecture, multi-source RAG retrieval pipeline,
          threat-intelligence enrichment, and console functionality.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="flex items-start gap-3 rounded-md border border-warn/40 bg-warn/10 p-3.5 text-warn">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="space-y-0.5 text-xs leading-relaxed">
          <span className="font-semibold">Core Operating Principle:</span> AI-generated triage is
          advisory. Analysts should validate the underlying evidence before taking containment or
          remediation actions.
        </div>
      </div>

      {/* Compact System Workflow Visual Near Top */}
      <SectionCard
        title="System Workflow"
        subtitle="End-to-end evidence collection and AI reasoning pipeline"
      >
        <div className="hidden grid-cols-7 gap-2 lg:grid">
          {[
            { step: "1. Alert", desc: "Complete security alert payload", icon: Radar },
            { step: "2. Parse", desc: "Metadata, IOCs, behavioral cues", icon: FileCode },
            { step: "3. RAG Retrieval", desc: "MITRE, Playbooks, CISA guidance", icon: Layers },
            { step: "4. Threat Intel", desc: "Local cache & live enrichment", icon: Crosshair },
            { step: "5. Evidence", desc: "Assembled Evidence Package", icon: Database },
            { step: "6. AI Synthesis", desc: "Grounded Gemini reasoning", icon: Bot },
            { step: "7. Review", desc: "Human SOC determination", icon: CheckCircle2 },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col rounded-md border border-border bg-surface/60 p-3"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-4 text-primary" />
                  {idx < 6 && (
                    <ArrowRight className="absolute -right-2.5 top-1/2 z-10 size-3 -translate-y-1/2 text-muted-foreground" />
                  )}
                </div>
                <div className="mt-2 text-xs font-semibold text-foreground">{item.step}</div>
                <p className="mt-1 text-[0.6875rem] leading-tight text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile/Tablet Fallback Workflow */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs lg:hidden">
          {[
            "Complete Security Alert",
            "Alert Parser",
            "MITRE / Playbook / CISA Retrieval",
            "Threat Intelligence",
            "Evidence Package",
            "AI Triage Synthesis",
            "Analyst Review",
          ].map((s, idx, arr) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="rounded bg-surface px-2 py-1 mono-xs text-foreground/90 border border-border">
                {s}
              </span>
              {idx < arr.length - 1 && (
                <ArrowRight className="size-3 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* SECTION 1 — What is Incident Triage AI? */}
      <SectionCard title="1. What is Incident Triage AI?">
        <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
          <p>
            <strong>Incident Triage AI</strong> is a cybersecurity incident-triage platform designed
            to help security operations center (SOC) analysts systematically process complete
            security alerts. Rather than acting as a black-box conversational chatbot, the platform
            follows a strictly deterministic, evidence-grounded workflow.
          </p>
          <div className="rounded border border-border/80 bg-panel/60 p-3 mono-xs space-y-1 text-foreground/80">
            <div className="text-primary font-semibold">Deterministic Execution Flow:</div>
            <div>
              Complete Security Alert → Alert Parser → MITRE / Playbook / CISA Retrieval → Threat
              Intelligence → Evidence Package → AI Triage Synthesis → Analyst Review
            </div>
          </div>
          <p>
            The system is entirely evidence-grounded. The underlying AI reasoning layer operates
            strictly over the collected <strong>Evidence Package</strong>, which binds parsed alert
            artifacts, similarity-retrieved knowledge bases, and live reputation scores together. It
            never hallucinates findings or fabricates indicators.
          </p>
        </div>
      </SectionCard>

      {/* How the Knowledge Sources Help */}
      <SectionCard
        title="How the Knowledge Sources Help"
        subtitle="Analyst-friendly overview of the three core cybersecurity knowledge sources"
      >
        <div className="space-y-6">
          {/* Exact Component/Question Table */}
          <div className="overflow-x-auto rounded-md border border-border bg-panel/60">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/70">
                  <th className="px-4 py-3 font-semibold text-foreground">Component</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Main question</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr className="transition-colors hover:bg-surface/40">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                    MITRE ATT&CK
                  </td>
                  <td className="px-4 py-3 text-foreground/90">
                    🔍 What is the attacker doing?
                  </td>
                </tr>
                <tr className="transition-colors hover:bg-surface/40">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                    Response Playbooks
                  </td>
                  <td className="px-4 py-3 text-foreground/90">
                    🛠️ How should we investigate and respond?
                  </td>
                </tr>
                <tr className="transition-colors hover:bg-surface/40">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                    CISA Guidance
                  </td>
                  <td className="px-4 py-3 text-foreground/90">
                    📚 What established guidance can support our response?
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Short Explanations */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border/80 bg-surface/40 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <span className="text-base" aria-hidden>🔍</span>
                <span>MITRE ATT&CK</span>
              </div>
              <p className="text-xs text-foreground/85 leading-relaxed">
                Identifies relevant attacker behaviors and techniques from the MITRE ATT&CK knowledge base.
              </p>
            </div>

            <div className="rounded-md border border-border/80 bg-surface/40 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <span className="text-base" aria-hidden>🛠️</span>
                <span>Response Playbooks</span>
              </div>
              <p className="text-xs text-foreground/85 leading-relaxed">
                Provides structured investigation and response procedures, including triage, investigation, containment, eradication, recovery, and escalation.
              </p>
            </div>

            <div className="rounded-md border border-border/80 bg-surface/40 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                <span className="text-base" aria-hidden>📚</span>
                <span>CISA Guidance</span>
              </div>
              <p className="text-xs text-foreground/85 leading-relaxed">
                Provides relevant cybersecurity guidance and recommendations from CISA to support incident investigation and response.
              </p>
            </div>
          </div>

          {/* Visual Workflow */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Investigation & Triage Workflow
            </div>
            {/* Desktop / Large Screen Horizontal Workflow */}
            <div className="hidden lg:flex items-center justify-between gap-1 rounded-md border border-border bg-panel/70 p-3.5">
              <div className="flex-1 rounded border border-border/70 bg-surface/70 p-2.5 text-center">
                <div className="text-xs font-bold text-foreground">Security Alert</div>
                <div className="mt-0.5 text-[0.6875rem] text-muted-foreground">Incoming raw payload</div>
              </div>

              <ArrowRight className="size-4 text-primary shrink-0" />

              <div className="flex-1 rounded border border-primary/30 bg-surface/70 p-2.5 text-center">
                <div className="text-xs font-bold text-foreground">🔍 MITRE ATT&CK</div>
                <div className="mt-0.5 text-[0.6875rem] text-primary/90 font-medium">What is the attacker doing?</div>
              </div>

              <ArrowRight className="size-4 text-primary shrink-0" />

              <div className="flex-1 rounded border border-primary/30 bg-surface/70 p-2.5 text-center">
                <div className="text-xs font-bold text-foreground">🛠️ Response Playbooks</div>
                <div className="mt-0.5 text-[0.6875rem] text-primary/90 font-medium">How should we investigate/respond?</div>
              </div>

              <ArrowRight className="size-4 text-primary shrink-0" />

              <div className="flex-1 rounded border border-primary/30 bg-surface/70 p-2.5 text-center">
                <div className="text-xs font-bold text-foreground">📚 CISA Guidance</div>
                <div className="mt-0.5 text-[0.6875rem] text-primary/90 font-medium">What established guidance can support our response?</div>
              </div>

              <ArrowRight className="size-4 text-primary shrink-0" />

              <div className="flex-1 rounded border border-border/70 bg-surface/70 p-2.5 text-center">
                <div className="text-xs font-bold text-foreground">🤖 AI Triage</div>
                <div className="mt-0.5 text-[0.6875rem] text-muted-foreground">Evidence-grounded analysis</div>
              </div>

              <ArrowRight className="size-4 text-primary shrink-0" />

              <div className="flex-1 rounded border border-border/70 bg-surface/70 p-2.5 text-center">
                <div className="text-xs font-bold text-foreground">👤 Analyst Review</div>
                <div className="mt-0.5 text-[0.6875rem] text-muted-foreground">Final human validation</div>
              </div>
            </div>

            {/* Mobile / Tablet Vertical Workflow */}
            <div className="flex flex-col items-stretch gap-1.5 lg:hidden rounded-md border border-border bg-panel/70 p-3">
              <div className="rounded border border-border/70 bg-surface/70 p-2 text-center">
                <div className="text-xs font-bold text-foreground">Security Alert</div>
              </div>

              <div className="flex justify-center"><ArrowDown className="size-3.5 text-primary" /></div>

              <div className="rounded border border-primary/30 bg-surface/70 p-2 text-center">
                <div className="text-xs font-bold text-foreground">🔍 MITRE ATT&CK</div>
                <div className="text-[0.6875rem] text-primary/90 font-medium">What is the attacker doing?</div>
              </div>

              <div className="flex justify-center"><ArrowDown className="size-3.5 text-primary" /></div>

              <div className="rounded border border-primary/30 bg-surface/70 p-2 text-center">
                <div className="text-xs font-bold text-foreground">🛠️ Response Playbooks</div>
                <div className="text-[0.6875rem] text-primary/90 font-medium">How should we investigate/respond?</div>
              </div>

              <div className="flex justify-center"><ArrowDown className="size-3.5 text-primary" /></div>

              <div className="rounded border border-primary/30 bg-surface/70 p-2 text-center">
                <div className="text-xs font-bold text-foreground">📚 CISA Guidance</div>
                <div className="text-[0.6875rem] text-primary/90 font-medium">What established guidance can support our response?</div>
              </div>

              <div className="flex justify-center"><ArrowDown className="size-3.5 text-primary" /></div>

              <div className="rounded border border-border/70 bg-surface/70 p-2 text-center">
                <div className="text-xs font-bold text-foreground">🤖 AI Triage</div>
                <div className="text-[0.6875rem] text-muted-foreground">Evidence-grounded analysis</div>
              </div>

              <div className="flex justify-center"><ArrowDown className="size-3.5 text-primary" /></div>

              <div className="rounded border border-border/70 bg-surface/70 p-2 text-center">
                <div className="text-xs font-bold text-foreground">👤 Analyst Review</div>
                <div className="text-[0.6875rem] text-muted-foreground">Final human validation</div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Functional Sidebar Section Guides (Grid) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* SECTION 2 — Analyze Alert */}
        <SectionCard
          title="2. Analyze Alert"
          subtitle="Primary ingestion and automated triage workspace"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Radar className="size-4 text-primary" />
              <span>How it works:</span>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs text-foreground/85">
              <li>
                Analysts paste <strong>one complete security alert</strong> (JSON, Syslog, or raw
                SIEM export).
              </li>
              <li>
                The backend parser extracts alert metadata, network context, behavioral evidence, and
                observable IOCs.
              </li>
              <li>
                The RAG pipeline queries vector indices to retrieve relevant MITRE ATT&CK techniques,
                response playbooks, and CISA guidance.
              </li>
              <li>
                Extracted IOCs can be optionally enriched via local caches or live threat feeds.
              </li>
              <li>
                An immutable Evidence Package is constructed and submitted to Google Gemini for
                advisory triage synthesis.
              </li>
              <li>
                <strong>Analyst review remains required</strong> before any containment or
                remediation action.
              </li>
            </ul>
          </div>
        </SectionCard>

        {/* SECTION 3 — Incident History */}
        <SectionCard
          title="3. Incident History"
          subtitle="Session incident tracking and comparison"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <History className="size-4 text-primary" />
              <span>Current Session Behavior:</span>
            </div>
            <p className="text-xs text-foreground/85">
              Incident history is currently maintained for the active application session.
            </p>
            <p className="text-xs text-muted-foreground">
              Analyses completed during your active browser session are held in memory, enabling SOC
              analysts to switch between active investigations, compare assessed severities, review
              triage reports, and inspect historical evidence packages without re-running triage.
              No permanent database storage is used or implied.
            </p>
          </div>
        </SectionCard>

        {/* SECTION 4 — Threat Intelligence */}
        <SectionCard
          title="4. Threat Intelligence"
          subtitle="Local reputation datasets & live feed enrichment"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Crosshair className="size-4 text-primary" />
              <span>IOC Investigation & Feed Sources:</span>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs text-foreground/85">
              <li>
                Investigates observable indicators: <strong>IP addresses</strong>,{" "}
                <strong>domains</strong>, <strong>URLs</strong>, and{" "}
                <strong>file hashes</strong> (MD5, SHA-1, SHA-256).
              </li>
              <li>
                Queries high-performance local threat-intelligence caches for instant offline
                lookups.
              </li>
              <li>
                Supports optional live enrichment against open-source abuse feeds:{" "}
                <strong>ThreatFox</strong> (IP/domain malware associations),{" "}
                <strong>URLhaus</strong> (malicious URLs), and <strong>MalwareBazaar</strong> (hash
                payloads).
              </li>
            </ul>
            <div className="rounded border border-primary/30 bg-panel/70 p-2 text-xs text-primary/95 font-medium">
              Important: No threat-intelligence match does not mean the IOC is benign. Private,
              internal, or novel indicators often exhibit zero prior hits.
            </div>
          </div>
        </SectionCard>

        {/* SECTION 5 — MITRE ATT&CK */}
        <SectionCard
          title="5. MITRE ATT&CK"
          subtitle="Semantic mapping to adversary tactics & techniques"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <ListChecks className="size-4 text-primary" />
              <span>Technique Candidate Evaluation:</span>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs text-foreground/85">
              <li>
                Dense vector similarity retrieves candidate MITRE ATT&CK Enterprise techniques based
                on behavioral evidence.
              </li>
              <li>
                Presents technique IDs (e.g., T1059.001), formal names, descriptions, and supporting
                observables.
              </li>
              <li>
                The AI engine validates each candidate against alert facts and assigns a clear
                assessment status: <strong>Supported</strong>, <strong>Plausible</strong>, or{" "}
                <strong>Not Supported</strong>.
              </li>
            </ul>
            <div className="rounded border border-border bg-surface/50 p-2 text-xs text-muted-foreground">
              Retrieval similarity is used to identify candidate evidence. It is not itself a
              confidence score or final classification.
            </div>
          </div>
        </SectionCard>

        {/* SECTION 6 — Response Playbooks */}
        <SectionCard
          title="6. Response Playbooks"
          subtitle="Standardized procedural guidance for containment"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <BookOpenCheck className="size-4 text-primary" />
              <span>Lifecycle Guidance Stages:</span>
            </div>
            <p className="text-xs text-foreground/85">
              Playbooks retrieved by the RAG orchestrator provide structured incident-response
              procedures aligned with industry IR lifecycles:
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-foreground/80">
              <div className="rounded bg-panel px-2 py-1 border border-border/60">
                • Initial Triage
              </div>
              <div className="rounded bg-panel px-2 py-1 border border-border/60">
                • Investigation
              </div>
              <div className="rounded bg-panel px-2 py-1 border border-border/60">
                • Containment
              </div>
              <div className="rounded bg-panel px-2 py-1 border border-border/60">
                • Eradication
              </div>
              <div className="rounded bg-panel px-2 py-1 border border-border/60">• Recovery</div>
              <div className="rounded bg-panel px-2 py-1 border border-border/60">
                • Evidence Collection
              </div>
              <div className="rounded bg-panel px-2 py-1 border border-border/60">
                • Escalation Criteria
              </div>
              <div className="rounded bg-panel px-2 py-1 border border-border/60">
                • Closure Criteria
              </div>
            </div>
          </div>
        </SectionCard>

        {/* SECTION 7 — CISA Guidance */}
        <SectionCard
          title="7. CISA Guidance"
          subtitle="Authoritative national cybersecurity advisories"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <ScrollText className="size-4 text-primary" />
              <span>Integrated Advisory Domains:</span>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs text-foreground/85">
              <li>
                <strong>Incident Response:</strong> Federal best practices for rapid response and
                threat mitigation.
              </li>
              <li>
                <strong>Ransomware:</strong> Actionable joint CISA/FBI guidance for extortion and
                malware attacks.
              </li>
              <li>
                <strong>Logging & Monitoring:</strong> Telemetry collection and audit log
                retention recommendations.
              </li>
              <li>
                <strong>Network Visibility & Hardening:</strong> Perimeter protection and lateral
                movement defense.
              </li>
              <li>
                <strong>CISA Security Advisories:</strong> Known exploited vulnerability (KEV)
                catalog links and cross-references.
              </li>
            </ul>
            <p className="text-[0.6875rem] italic text-muted-foreground">
              Note: This application references publicly published CISA security documentation.
              CISA does not endorse or certify this software.
            </p>
          </div>
        </SectionCard>

        {/* SECTION 8 — Reports */}
        <SectionCard
          title="8. Reports"
          subtitle="Comprehensive, reproducible triage documentation"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <FileText className="size-4 text-primary" />
              <span>Structured Report Schema:</span>
            </div>
            <p className="text-xs text-foreground/85">
              Every analyzed incident produces an audited, structured triage report containing:
            </p>
            <div className="flex flex-wrap gap-1 text-[0.6875rem]">
              {[
                "Incident Assessment",
                "Severity Assessment",
                "Behavioral Evidence",
                "IOC Findings",
                "Threat Intel Findings",
                "MITRE Analysis",
                "Playbook Steps",
                "CISA Guidance",
                "Recommended Actions",
                "Known Limitations",
                "Analyst Review Requirement",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-surface px-1.5 py-0.5 border border-border text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 pt-1 border-t border-border/60 text-xs">
              <span className="font-semibold text-foreground">Export Options:</span>
              <span className="rounded border border-border px-1.5 py-0.5 mono-xs bg-panel">
                Copy Report
              </span>
              <span className="rounded border border-border px-1.5 py-0.5 mono-xs bg-panel">
                Download JSON
              </span>
            </div>
          </div>
        </SectionCard>

        {/* SECTION 9 — Incident AI Assistant */}
        <SectionCard
          title="9. Incident AI Assistant"
          subtitle="Interactive evidence-grounded Q&A"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Bot className="size-4 text-primary" />
              <span>Scoped Assistant Inquiries:</span>
            </div>
            <p className="text-xs text-foreground/85">
              Analysts can ask targeted questions about the active incident (e.g., &ldquo;Why was
              this classified this way?&rdquo;, &ldquo;Which MITRE techniques are supported?&rdquo;).
            </p>
            <div className="rounded border border-border/80 bg-panel/60 p-2.5 text-xs text-foreground/90 space-y-1">
              <div className="font-semibold text-primary">Scoped Operational Boundary:</div>
              <p className="text-muted-foreground leading-normal">
                The assistant operates strictly within the application&apos;s evidence-grounded
                workflow. It is <strong>not an unrestricted, open-ended prompt interface</strong>.
                Answers are anchored to the specific alert text, retrieved knowledge bases, and
                observed telemetry to prevent speculative hallucinations.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* SECTION 10 — Settings */}
        <SectionCard
          title="10. Settings"
          subtitle="API connection parameters & system diagnostics"
        >
          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Settings2 className="size-4 text-primary" />
              <span>Console Configuration & Security:</span>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs text-foreground/85">
              <li>
                <strong>Backend API Connection:</strong> Configure and validate the FastAPI
                backend service URL reachable by the browser.
              </li>
              <li>
                <strong>Health & Latency Probes:</strong> Monitor live connectivity, response status,
                and round-trip diagnostics.
              </li>
              <li>
                <strong>Endpoint Resolution:</strong> Resolves in order: Local in-app setting →
                Build-time <code>VITE_API_BASE_URL</code> → Default <code>http://127.0.0.1:8000</code>.
              </li>
            </ul>
            <div className="rounded border border-ok/30 bg-ok/10 p-2 text-xs text-ok font-medium">
              Security Guarantee: Sensitive API keys (e.g., Google Gemini credentials) remain
              strictly isolated in the backend service environment and are never exposed or
              transmitted to the frontend.
            </div>
          </div>
        </SectionCard>
      </div>

      {/* SECTION 11 — Evidence-First Architecture */}
      <SectionCard
        title="11. Evidence-First Architecture"
        subtitle="Step-by-step pipeline execution model"
      >
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 rounded-md border border-border bg-panel p-3 mono-xs">
            <div className="text-center font-bold text-foreground">ALERT</div>
            <ArrowRight className="hidden md:block size-3.5 text-primary" />
            <ArrowDown className="md:hidden size-3 text-primary" />
            <div className="text-center font-bold text-foreground">PARSE</div>
            <ArrowRight className="hidden md:block size-3.5 text-primary" />
            <ArrowDown className="md:hidden size-3 text-primary" />
            <div className="text-center font-bold text-foreground">RETRIEVE EVIDENCE</div>
            <ArrowRight className="hidden md:block size-3.5 text-primary" />
            <ArrowDown className="md:hidden size-3 text-primary" />
            <div className="text-center font-bold text-foreground">THREAT INTEL</div>
            <ArrowRight className="hidden md:block size-3.5 text-primary" />
            <ArrowDown className="md:hidden size-3 text-primary" />
            <div className="text-center font-bold text-foreground">EVIDENCE PACKAGE</div>
            <ArrowRight className="hidden md:block size-3.5 text-primary" />
            <ArrowDown className="md:hidden size-3 text-primary" />
            <div className="text-center font-bold text-foreground">AI TRIAGE</div>
            <ArrowRight className="hidden md:block size-3.5 text-primary" />
            <ArrowDown className="md:hidden size-3 text-primary" />
            <div className="text-center font-bold text-foreground">ANALYST REVIEW</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="rounded border border-border bg-surface/40 p-3 space-y-1">
              <div className="font-semibold text-foreground">1. Alert Ingestion</div>
              <p className="text-muted-foreground leading-normal">
                Ingests single raw cybersecurity alerts containing process executions, network logs,
                or authentication events.
              </p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-3 space-y-1">
              <div className="font-semibold text-foreground">2. Deterministic Parsing</div>
              <p className="text-muted-foreground leading-normal">
                Extracts metadata, event categories, internal/external network endpoints, and IOCs
                without language model guessing.
              </p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-3 space-y-1">
              <div className="font-semibold text-foreground">3. Multi-Source Retrieval</div>
              <p className="text-muted-foreground leading-normal">
                Queries local FAISS vector stores containing MITRE ATT&CK techniques, playbook
                checklists, and CISA advisories.
              </p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-3 space-y-1">
              <div className="font-semibold text-foreground">4. Threat Intelligence</div>
              <p className="text-muted-foreground leading-normal">
                Matches observable network and file hashes against offline databases and live
                Abuse.ch feeds.
              </p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-3 space-y-1">
              <div className="font-semibold text-foreground">5. Evidence Package</div>
              <p className="text-muted-foreground leading-normal">
                Assembles all verified evidence into a consolidated, structured schema that bounds
                all subsequent processing.
              </p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-3 space-y-1">
              <div className="font-semibold text-foreground">6. Grounded AI Triage</div>
              <p className="text-muted-foreground leading-normal">
                Gemini evaluates the evidence package to assess severity, justify classifications,
                and recommend immediate actions.
              </p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-3 space-y-1 sm:col-span-2">
              <div className="font-semibold text-foreground">7. Human Analyst Review</div>
              <p className="text-muted-foreground leading-normal">
                Ensures accountability. The human SOC analyst reviews evidence, validates MITRE
                technique support, and authorizes final containment.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* SECTION 12 — Technology / Architecture */}
      <SectionCard
        title="12. Technology / Architecture"
        subtitle="Verified project technology stack and implementation layers"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface/40 p-3">
            <Server className="mt-0.5 size-4 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">FastAPI Backend Service</div>
              <p className="mt-1 text-muted-foreground leading-normal">
                Python 3.13 asynchronous REST API providing validation, deterministic alert parsing,
                and singleton RAG orchestrator lifecycle management.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface/40 p-3">
            <Layers className="mt-0.5 size-4 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">React / TanStack Frontend</div>
              <p className="mt-1 text-muted-foreground leading-normal">
                TanStack Start, TanStack Router, TanStack Query, Tailwind CSS v4, and Lucide icons
                delivering a real-time dark SOC console interface.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface/40 p-3">
            <Database className="mt-0.5 size-4 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">MITRE ATT&CK RAG</div>
              <p className="mt-1 text-muted-foreground leading-normal">
                FAISS vector index (1,488 indexed vectors) paired with SentenceTransformers
                (all-MiniLM-L6-v2) for semantic technique retrieval.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface/40 p-3">
            <BookOpenCheck className="mt-0.5 size-4 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">Incident Playbook RAG</div>
              <p className="mt-1 text-muted-foreground leading-normal">
                Specialized FAISS vector index of standardized incident-response playbooks for
                containment, investigation, and recovery procedures.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface/40 p-3">
            <ScrollText className="mt-0.5 size-4 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">CISA Guidance RAG</div>
              <p className="mt-1 text-muted-foreground leading-normal">
                Dedicated FAISS vector store indexing federal security advisories, ransomware
                guidance, and network hardening benchmarks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface/40 p-3">
            <Crosshair className="mt-0.5 size-4 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">Threat Intelligence Services</div>
              <p className="mt-1 text-muted-foreground leading-normal">
                Local indicator datasets paired with live integrations to Abuse.ch feeds (ThreatFox,
                URLhaus, and MalwareBazaar).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface/40 p-3 sm:col-span-2 lg:col-span-3">
            <Cpu className="mt-0.5 size-4 text-primary shrink-0" />
            <div>
              <div className="font-semibold text-foreground">Google Gemini AI Reasoning</div>
              <p className="mt-1 text-muted-foreground leading-normal">
                Server-side evidence synthesis using Google Gemini API. Analyzes only the bounded
                evidence package to produce severity assessments, MITRE validation, and recommended
                actions, with fallback reports when API keys or network are unavailable.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
