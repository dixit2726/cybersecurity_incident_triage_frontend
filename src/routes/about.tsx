import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Cpu,
  Crosshair,
  Database,
  FileCode2,
  FileSearch,
  FileText,
  Fingerprint,
  Flame,
  FolderGit2,
  Globe,
  HardDrive,
  History,
  Layers,
  ListChecks,
  Lock,
  Network,
  Radar,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { SectionCard } from "@/components/soc/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "AI-powered security alert analysis, threat intelligence correlation, and evidence-based incident triage for SOC analysts.",
      },
      { property: "og:title", content: "About — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content:
          "Operational overview of the Cybersecurity Incident Triage AI architecture, RAG knowledge retrieval, threat intelligence lookups, and SOC analyst workflow.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="size-6 text-primary" aria-hidden />
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            About Cybersecurity Incident Triage AI
          </h1>
        </div>
        <p className="mt-1.5 text-sm font-medium text-primary">
          AI-powered security alert analysis, threat intelligence correlation, and evidence-based incident triage for SOC analysts.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-[0.8125rem]">
          Cybersecurity Incident Triage AI is an analyst-focused security operations platform designed to transform raw security alerts into structured, contextualized, and actionable incident assessments. The system combines alert parsing, threat intelligence, Retrieval-Augmented Generation (RAG), AI-assisted analysis, and persistent incident records to support faster and more consistent security investigations.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="flex items-start gap-3 rounded-md border border-warn/40 bg-warn/10 p-3.5 text-warn">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p className="text-xs leading-relaxed text-foreground/90">
          <span className="font-semibold text-warn">Core Operating Principle:</span> AI-generated triage is advisory. Security analysts remain responsible for validating underlying evidence before authorizing containment or remediation actions.
        </p>
      </div>

      {/* =========================================================================
          SECTION 1 — What is Incident Triage AI?
          ========================================================================= */}
      <SectionCard
        title="What is Cybersecurity Incident Triage AI?"
        subtitle="End-to-end processing pipeline transforming unorganized alert telemetry into structured incident assessments"
      >
        <p className="text-xs leading-relaxed text-foreground/85 sm:text-[0.8125rem]">
          The platform accepts a complete security alert payload and executes a systematic, multi-stage investigation workflow. Each stage extracts facts, enriches context through external feeds and indexed databases, retrieves domain-specific defensive guidance, and produces an evidence-grounded assessment.
        </p>

        {/* Visual Workflow Diagram */}
        <div className="mt-5 rounded-md border border-border bg-panel/70 p-4">
          <p className="label-caps mb-3 text-muted-foreground">Platform Investigation Pipeline</p>

          {/* Desktop / Tablet Flow */}
          <div className="hidden lg:grid grid-cols-5 gap-2.5">
            {[
              { step: "Security Alert", sub: "Raw incoming telemetry", icon: Radar },
              { step: "Alert Parsing", sub: "Extract fields & headers", icon: FileCode2 },
              { step: "IOC Extraction", sub: "Identify IPs, URLs, hashes", icon: Fingerprint },
              { step: "Threat Intel", sub: "Indexed MISP lookups", icon: Crosshair },
              { step: "RAG Retrieval", sub: "MITRE, CISA, Playbooks", icon: Layers },
              { step: "Evidence Package", sub: "Consolidated facts", icon: Database },
              { step: "AI Triage", sub: "Grounded LLM synthesis", icon: Bot },
              { step: "Reconciliation", sub: "Deterministic validation", icon: ShieldCheck },
              { step: "Incident Report", sub: "5-tab SOC view", icon: FileText },
              { step: "Supabase Store", sub: "Persistent audit history", icon: HardDrive },
            ].map((node, i) => {
              const Icon = node.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded-md border border-border bg-surface/50 p-2.5 text-center relative"
                >
                  <div className="flex items-center justify-center mb-1 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <p className="mono-xs font-semibold text-foreground">{node.step}</p>
                  <p className="text-[0.6875rem] text-muted-foreground truncate">{node.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile / Vertical Fallback Flow */}
          <div className="flex flex-col gap-1.5 lg:hidden">
            {[
              "Security Alert",
              "Alert Parsing",
              "IOC Extraction",
              "Threat Intelligence Lookup",
              "RAG Evidence Retrieval",
              "Evidence Package",
              "AI Triage",
              "Deterministic Reconciliation",
              "Incident Report",
              "Supabase Persistence",
            ].map((step, idx, arr) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full rounded border border-border bg-surface/60 px-3 py-1.5 text-center mono-xs font-semibold text-foreground/90">
                  {step}
                </div>
                {idx < arr.length - 1 && <ArrowDown className="my-1 size-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 2 — Why Was It Developed?
          ========================================================================= */}
      <SectionCard
        title="Why This Platform Was Developed"
        subtitle="Addressing alert fatigue, unstructured logs, and fragmented SOC investigation data"
      >
        <blockquote className="rounded-md border-l-2 border-primary bg-surface/40 p-3 text-xs leading-relaxed text-foreground/90 italic">
          “Security Operations Centers generate a large volume of alerts from endpoints, networks, applications, and security tools. Analysts need to quickly determine what happened, whether an indicator is known, what techniques may be involved, and what response actions should be considered.”
        </blockquote>

        <p className="mt-4 text-xs leading-relaxed text-foreground/85">
          The platform was designed to streamline this critical early-triage window:
        </p>

        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {[
            { title: "Reduce Repetitive Manual Investigation", desc: "Automate indicator extraction and multi-source feed lookups so analysts avoid context-switching across external browsers." },
            { title: "Structure Unorganized Security Alerts", desc: "Normalize heterogeneous alert schemas, syslog lines, and raw JSON into consistent investigation records." },
            { title: "Extract Important Indicators Automatically", desc: "Identify IPv4 addresses, domains, ports, URLs, and file hashes directly from free-form alert text." },
            { title: "Correlate with Threat-Intelligence Data", desc: "Instantly cross-reference parsed indicators against authoritative local threat intelligence." },
            { title: "Retrieve Relevant Cybersecurity Knowledge", desc: "Ground the investigation with authoritative MITRE ATT&CK techniques, response playbooks, and CISA advisories." },
            { title: "Provide AI-Assisted Incident Analysis", desc: "Generate structured technical assessments, severity justifications, and containment priorities without hallucinations." },
            { title: "Present Evidence in One Interface", desc: "Consolidate telemetry, detection context, playbook steps, and raw alerts into a unified 5-tab console." },
            { title: "Maintain Historical Incident Records", desc: "Keep persistent audit trails of analyzed alerts for trend identification and compliance review." },
          ].map((item, idx) => (
            <div key={idx} className="rounded-md border border-border bg-surface/40 p-3">
              <p className="text-xs font-semibold text-primary">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[0.6875rem] text-muted-foreground italic">
          * Note: This platform is designed to assist and accelerate security analysts, not replace human judgment, contextual familiarity, or organizational decision-making.
        </p>
      </SectionCard>

      {/* =========================================================================
          SECTION 3 — End-to-End Investigation Workflow
          ========================================================================= */}
      <SectionCard
        title="How It Works"
        subtitle="Seven discrete operational stages executed during automated alert triage"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* 01 */}
          <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
            <div>
              <span className="mono-xs font-bold text-primary">01 — Alert Parsing</span>
              <p className="mt-1.5 text-xs text-foreground/85 leading-relaxed">
                The system receives a complete security alert and parses out structured metadata: Alert ID, Timestamp, Alert Type, Event Type, Severity, Source IP, Destination IP, Protocol, Port, URL, File Hash, and behavioral cue sentences.
              </p>
            </div>
          </div>

          {/* 02 */}
          <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
            <div>
              <span className="mono-xs font-bold text-primary">02 — IOC Extraction</span>
              <p className="mt-1.5 text-xs text-foreground/85 leading-relaxed">
                Indicators of compromise—including IP addresses, external URLs, host domains, and file hashes—are automatically identified, normalized, and categorized for threat evaluation.
              </p>
            </div>
          </div>

          {/* 03 */}
          <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
            <div>
              <span className="mono-xs font-bold text-primary">03 — Threat Intelligence</span>
              <p className="mt-1.5 text-xs text-foreground/85 leading-relaxed">
                Extracted indicators are evaluated against a locally indexed SQLite threat-intelligence database imported from URLhaus, ThreatFox, and MalwareBazaar datasets for rapid, air-gapped lookups.
              </p>
            </div>
          </div>

          {/* 04 */}
          <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
            <div>
              <span className="mono-xs font-bold text-primary">04 — RAG Evidence Retrieval</span>
              <p className="mt-1.5 text-xs text-foreground/85 leading-relaxed">
                The RAG pipeline retrieves relevant cybersecurity knowledge from MITRE ATT&CK matrices, official response playbooks, and CISA cybersecurity advisories to provide grounded context.
              </p>
            </div>
          </div>

          {/* 05 */}
          <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
            <div>
              <span className="mono-xs font-bold text-primary">05 — AI Triage</span>
              <p className="mt-1.5 text-xs text-foreground/85 leading-relaxed">
                The AI engine synthesizes the parsed alert with retrieved evidence packages to produce a structured triage assessment: incident summary, assessed severity, MITRE tactics, and recommended response steps.
              </p>
            </div>
          </div>

          {/* 06 */}
          <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between">
            <div>
              <span className="mono-xs font-bold text-primary">06 — Evidence Reconciliation</span>
              <p className="mt-1.5 text-xs text-foreground/85 leading-relaxed">
                Deterministic threat-intelligence results (queried IOC, match status, source, threat type) are enforced as authoritative, preventing generative language models from hallucinating or overwriting verified facts.
              </p>
            </div>
          </div>

          {/* 07 */}
          <div className="rounded-md border border-border bg-panel p-3.5 flex flex-col justify-between sm:col-span-2 lg:col-span-3">
            <div>
              <span className="mono-xs font-bold text-primary">07 — Incident Persistence</span>
              <p className="mt-1.5 text-xs text-foreground/85 leading-relaxed">
                Every triaged incident is persisted into Supabase PostgreSQL backend records for auditability, while your individual analyst investigations are tracked directly in the User Incident History view.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 4 — Threat Intelligence Integration
          ========================================================================= */}
      <SectionCard
        title="Threat Intelligence Integration"
        subtitle="Optimized indexing architecture separating raw source feeds from application-ready lookups"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">1. Source Data</span>
            <h4 className="mt-1 text-xs font-bold text-foreground">CSV Datasets</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Curated OSINT feeds from URLhaus, ThreatFox, and MalwareBazaar serving as the authoritative threat repository.
            </p>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">2. Local Storage</span>
            <h4 className="mt-1 text-xs font-bold text-foreground">SQLite Index</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Indexed, indexed-searchable local database enabling microsecond queries without latency or rate limits.
            </p>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">3. Real-time Triage</span>
            <h4 className="mt-1 text-xs font-bold text-foreground">Triage Engine</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Queries SQLite for extracted alert indicators during triage, validating against verified match criteria.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-border/80 bg-panel/60 p-3 text-xs leading-relaxed text-foreground/85">
          “The CSV files act as the source datasets. The indexing process imports their records into SQLite, where indicators can be queried efficiently during incident analysis. When the source datasets are updated, the SQLite index can be rebuilt to incorporate the updated records.”
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 5 — RAG Knowledge Sources
          ========================================================================= */}
      <SectionCard
        title="Security Knowledge Retrieval"
        subtitle="Multi-domain semantic search over standardized cybersecurity frameworks and playbooks"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              <h4 className="text-xs font-bold text-foreground">MITRE ATT&CK</h4>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Maps alert behavior to standardized tactics, techniques, and procedures (TTPs), enabling consistent classification of adversary behavior across enterprise environments.
            </p>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="size-4 text-ok" />
              <h4 className="text-xs font-bold text-foreground">Response Playbooks</h4>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Retrieves standard operating procedures and tactical checklists specifically matched to detected incident categories (e.g., malware downloads, brute-force attacks).
            </p>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-blue-400" />
              <h4 className="text-xs font-bold text-foreground">CISA Guidance</h4>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Injects official defensive and detection advisories from the Cybersecurity & Infrastructure Security Agency to strengthen mitigation measures.
            </p>
          </div>
        </div>

        <p className="mt-3.5 text-xs text-foreground/85 leading-relaxed">
          “The RAG layer retrieves relevant evidence based on the security alert rather than relying only on the language model’s general knowledge.”
        </p>
      </SectionCard>

      {/* =========================================================================
          SECTION 6 — AI-Assisted Triage
          ========================================================================= */}
      <SectionCard
        title="AI-Assisted Incident Analysis"
        subtitle="Evidence-grounded synthesis of parsed telemetry, threat feeds, and retrieved frameworks"
      >
        <p className="text-xs leading-relaxed text-foreground/85 sm:text-[0.8125rem]">
          The AI reasoning layer operates strictly over the assembled Evidence Package. Instead of open-ended conversational generation, it synthesizes structured information into consistent output categories:
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            "Incident Summary",
            "Severity Assessment",
            "Incident Type",
            "Threat Intelligence Context",
            "MITRE ATT&CK Context",
            "Detection Evidence",
            "Recommended Actions",
            "Response Guidance",
          ].map((cat, i) => (
            <div key={i} className="rounded border border-border bg-surface/60 px-3 py-2 text-center">
              <span className="mono-xs font-semibold text-foreground/90">{cat}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-border/80 bg-surface/40 p-3">
          <p className="text-xs leading-relaxed text-foreground/85">
            “AI-generated analysis is intended to support analyst investigation and decision-making. Security teams should validate findings against the underlying alert and available evidence.”
          </p>
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 7 — Analyst Dashboard
          ========================================================================= */}
      <SectionCard
        title="Designed for SOC Analysts"
        subtitle="Five primary investigation views organized to eliminate cognitive fragmentation"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-md border border-border bg-panel p-3">
            <span className="mono-xs font-bold text-primary block">Overview</span>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Provides the high-level incident assessment, severity, incident type, source/destination information, threat-intelligence status, and AI assessment.
            </p>
          </div>

          <div className="rounded-md border border-border bg-panel p-3">
            <span className="mono-xs font-bold text-primary block">Evidence</span>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Displays parsed alert information, extracted indicators, network evidence, and threat-intelligence evidence.
            </p>
          </div>

          <div className="rounded-md border border-border bg-panel p-3">
            <span className="mono-xs font-bold text-primary block">Detection</span>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Displays MITRE ATT&CK context, threat-intelligence context, detection evidence, and CISA detection guidance.
            </p>
          </div>

          <div className="rounded-md border border-border bg-panel p-3">
            <span className="mono-xs font-bold text-primary block">Response</span>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Displays recommended actions, response playbooks, and relevant defensive guidance.
            </p>
          </div>

          <div className="rounded-md border border-border bg-panel p-3">
            <span className="mono-xs font-bold text-primary block">Alert</span>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Displays the original complete security alert received by the system in a readable monospace format.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 8 — Technology Stack
          ========================================================================= */}
      <SectionCard
        title="Technology Stack"
        subtitle="Technologies actively powering the production console, backend services, and AI pipelines"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">Frontend</span>
            <ul className="mt-2 space-y-1 mono-xs text-foreground/85">
              <li>• React 19</li>
              <li>• TypeScript</li>
              <li>• TanStack (Router, Query, Start)</li>
              <li>• Vite</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">Backend</span>
            <ul className="mt-2 space-y-1 mono-xs text-foreground/85">
              <li>• Python 3.11+</li>
              <li>• FastAPI & Uvicorn</li>
              <li>• Pydantic v2 schemas</li>
              <li>• Regex alert parsing engine</li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">AI / RAG</span>
            <ul className="mt-2 space-y-1 mono-xs text-foreground/85">
              <li>• xKiro — OpenAI-compatible LLM endpoint</li>
              <li>• Google Gemini Embeddings</li>
              <li>• FAISS — Vector similarity search</li>
              <li>• Retrieval-Augmented Generation (RAG)</li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">Knowledge Stores</span>
            <ul className="mt-2 space-y-1 mono-xs text-foreground/85">
              <li>• MITRE ATT&CK knowledge base</li>
              <li>• CISA guidance documents</li>
              <li>• Security response playbooks</li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">Threat Intelligence</span>
            <ul className="mt-2 space-y-1 mono-xs text-foreground/85">
              <li>• SQLite local database</li>
              <li>• URLhaus indicators</li>
              <li>• ThreatFox indicators</li>
              <li>• MalwareBazaar malware hashes</li>
              <li>• CSV source datasets</li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface/50 p-3.5">
            <span className="label-caps text-primary">Database & Infrastructure</span>
            <ul className="mt-2 space-y-1 mono-xs text-foreground/85">
              <li>• Supabase PostgreSQL</li>
              <li>• Render deployment hosting</li>
              <li>• GitHub version control</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 9 — Security & Reliability
          ========================================================================= */}
      <SectionCard
        title="Security and Reliability"
        subtitle="Defensive engineering principles safeguarding investigation integrity"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "Deterministic Threat Intelligence",
              desc: "Verified threat-intelligence lookup results are preserved rather than allowing AI-generated text to overwrite them.",
            },
            {
              title: "Evidence-Based Analysis",
              desc: "AI triage uses retrieved evidence from security knowledge sources rather than ungrounded parametric memory.",
            },
            {
              title: "Structured Processing",
              desc: "Raw alerts are converted into structured information before analysis to ensure uniform evaluation.",
            },
            {
              title: "Persistent Incident Records",
              desc: "Completed incidents can be stored for historical investigation and regulatory compliance.",
            },
            {
              title: "Backend API Separation",
              desc: "The frontend communicates with the backend API instead of directly accessing protected database credentials.",
            },
            {
              title: "Secure Credentials",
              desc: "Sensitive credentials and service keys remain server-side and outside the client-facing frontend bundle.",
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-md border border-border bg-surface/40 p-3">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-primary" />
                {item.title}
              </span>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 10 — Example Investigation
          ========================================================================= */}
      <SectionCard
        title="Example Investigation"
        subtitle="Illustration of the end-to-end evidence gathering and triage correlation"
      >
        <div className="rounded-md border border-border bg-panel p-4 space-y-3">
          <div>
            <span className="label-caps text-muted-foreground">Sample Alert Telemetry</span>
            <p className="mt-1 font-mono text-xs text-foreground/90 bg-surface/70 p-2.5 rounded border border-border">
              “Endpoint communication detected with a suspicious external URL associated with potential malware download activity.”
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 pt-1">
            <div className="rounded border border-border bg-surface/40 p-2.5">
              <span className="mono-xs font-semibold text-primary block">Alert Parsing</span>
              <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Extract URL and network flow</p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-2.5">
              <span className="mono-xs font-semibold text-primary block">IOC Extraction</span>
              <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Identify suspicious destination URL</p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-2.5">
              <span className="mono-xs font-semibold text-primary block">Threat Intelligence</span>
              <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Search local indexed database</p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-2.5">
              <span className="mono-xs font-semibold text-primary block">Threat Context</span>
              <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Correlate matching source feeds</p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-2.5">
              <span className="mono-xs font-semibold text-primary block">RAG Retrieval</span>
              <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Retrieve MITRE, playbook, CISA</p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-2.5">
              <span className="mono-xs font-semibold text-primary block">AI Triage</span>
              <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Generate structured assessment</p>
            </div>
            <div className="rounded border border-border bg-surface/40 p-2.5 sm:col-span-2">
              <span className="mono-xs font-semibold text-primary block">Response Guidance</span>
              <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Present actionable containment steps</p>
            </div>
          </div>

          <p className="text-[0.6875rem] text-muted-foreground italic pt-1">
            * Note: This example demonstrates the investigation flow and is not a claim about a specific real-world incident.
          </p>
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 11 — Key Capabilities
          ========================================================================= */}
      <SectionCard
        title="Key Capabilities"
        subtitle="Core operational features empowering tier-1 and tier-2 incident triage"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Complete Alert Analysis",
              desc: "Analyze a complete security alert in one workflow without manual field decomposition.",
            },
            {
              title: "IOC Investigation",
              desc: "Extract and investigate observable indicators such as IPs, URLs, and file hashes automatically.",
            },
            {
              title: "Threat Intelligence Correlation",
              desc: "Correlate indicators with indexed threat-intelligence sources like URLhaus, ThreatFox, and MalwareBazaar.",
            },
            {
              title: "Multi-Source RAG",
              desc: "Retrieve cybersecurity context from MITRE ATT&CK, response playbooks, and CISA advisories.",
            },
            {
              title: "AI-Assisted Triage",
              desc: "Generate structured investigation context and prioritized response recommendations.",
            },
            {
              title: "Incident History",
              desc: "Store and review completed investigations through the client-side incident history system.",
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-md border border-border bg-surface/50 p-3.5">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="size-3.5 text-primary" />
                {item.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* =========================================================================
          SECTION 12 — Analyst-First Design
          ========================================================================= */}
      <SectionCard
        title="Built for Analyst Workflows"
        subtitle="Human-in-the-loop architecture designed around operational SOC realities"
      >
        <div className="space-y-3 text-xs leading-relaxed text-foreground/85">
          <p>
            “The platform is designed around the investigation workflow of a security analyst. Instead of presenting isolated AI-generated text, it organizes alert details, indicators, threat-intelligence results, retrieved security knowledge, detection context, and response guidance into a structured incident view.”
          </p>
          <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-primary font-medium">
            “AI assists the investigation; the analyst remains responsible for validating evidence and making the final security decision.”
          </div>
        </div>
      </SectionCard>

      {/* =========================================================================
          FINAL SECTION — From Alert to Investigation
          ========================================================================= */}
      <div className="rounded-lg border border-border bg-panel p-6 text-center space-y-4 shadow-sm">
        <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
          From Alert to Investigation
        </h3>

        {/* Large Visual Statement */}
        <div className="mx-auto flex max-w-sm flex-col items-center gap-1 font-mono text-xs font-semibold text-primary">
          <span className="rounded bg-surface px-3 py-1 border border-border w-full">RAW SECURITY ALERT</span>
          <ArrowDown className="size-3 text-muted-foreground" />
          <span className="rounded bg-surface px-3 py-1 border border-border w-full">STRUCTURED EVIDENCE</span>
          <ArrowDown className="size-3 text-muted-foreground" />
          <span className="rounded bg-surface px-3 py-1 border border-border w-full">THREAT INTELLIGENCE</span>
          <ArrowDown className="size-3 text-muted-foreground" />
          <span className="rounded bg-surface px-3 py-1 border border-border w-full">SECURITY KNOWLEDGE</span>
          <ArrowDown className="size-3 text-muted-foreground" />
          <span className="rounded bg-surface px-3 py-1 border border-border w-full">AI TRIAGE</span>
          <ArrowDown className="size-3 text-muted-foreground" />
          <span className="rounded bg-primary/20 px-3 py-1 border border-primary text-foreground w-full">ACTIONABLE INVESTIGATION CONTEXT</span>
        </div>

        <p className="mx-auto max-w-2xl text-xs leading-relaxed text-muted-foreground">
          “Cybersecurity Incident Triage AI brings multiple investigation steps into a single SOC-oriented workflow, helping analysts move from an incoming security alert toward structured evidence, contextual analysis, and response guidance.”
        </p>

        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold text-foreground">Cybersecurity Incident Triage AI</p>
          <p className="text-[0.6875rem] text-muted-foreground">AI-assisted security alert investigation platform</p>
        </div>
      </div>
    </div>
  );
}
