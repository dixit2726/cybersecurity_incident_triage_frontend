/**
 * Types mirroring the FastAPI backend contract
 * (src/api/schemas.py in the Python project).
 * Every field is optional/defensive: the UI must render only what the
 * backend actually returned and never substitute invented values.
 */

export interface SeverityAssessment {
  alert_severity?: string;
  assessed_severity?: string;
  justification?: string;
}

export interface IocFinding {
  ioc?: string;
  type?: string;
  context?: string;
}

export interface ThreatIntelFinding {
  ioc?: string;
  queried_ioc?: string;
  source?: string;
  match_found?: boolean;
  ioc_type?: string;
  threat_type?: string;
  interpretation?: string;
}

export interface MitreFinding {
  technique_id?: string;
  technique_name?: string;
  assessment?: string;
  reason?: string;
  evidence?: string[];
}

export interface TriageReport {
  alert_id?: string;
  timestamp?: string;
  event_type?: string;
  alert_summary?: string;
  incident_assessment?: string;
  severity_assessment?: SeverityAssessment;
  behavioral_evidence?: string[];
  ioc_findings?: IocFinding[];
  threat_intelligence_findings?: ThreatIntelFinding[];
  mitre_analysis?: MitreFinding[];
  playbook_recommendations?: string[];
  cisa_guidance?: string[];
  recommended_actions?: string[];
  analyst_review_required?: boolean;
  limitations?: string[];
  [key: string]: unknown;
}

export interface ProcessingMetadata {
  processing_time_ms?: number;
}

export interface TriageResponse {
  success?: boolean;
  alert_id?: string | null;
  triage_report: TriageReport;
  processing_metadata?: ProcessingMetadata | null;
}

export interface IncidentAskResponse {
  success?: boolean;
  question: string;
  answer: string;
  grounding?: Record<string, unknown>;
}

export interface HealthResponse {
  status?: string;
}

export interface RootResponse {
  service?: string;
  version?: string;
  status?: string;
}

export interface DbIncidentSummary {
  id: string;
  incident_id?: string | null;
  created_at?: string | null;
  severity?: string | null;
  event_type?: string | null;
  source_ip?: string | null;
  destination_ip?: string | null;
  protocol?: string | null;
  destination_port?: string | null;
  analyst_review_required?: boolean;
}

export interface IncidentListResponse {
  success?: boolean;
  total?: number;
  limit?: number;
  offset?: number;
  incidents: DbIncidentSummary[];
}

export interface IncidentDetailRecord {
  id: string;
  incident_id?: string | null;
  created_at?: string | null;
  alert_text: string;
  severity?: string | null;
  event_type?: string | null;
  source_ip?: string | null;
  destination_ip?: string | null;
  protocol?: string | null;
  destination_port?: string | null;
  iocs?: unknown[];
  threat_intelligence?: unknown[];
  mitre_results?: unknown[];
  playbooks?: unknown[];
  cisa_guidance?: unknown[];
  triage_report: TriageReport;
  analyst_review_required?: boolean;
}

export interface IncidentDetailResponse {
  success?: boolean;
  incident: IncidentDetailRecord;
}

/** A single analysis performed in this browser session. */
export interface StoredIncident {
  /** Local session key; not a backend identifier. */
  key: string;
  /** When the analysis was requested, from the analyst's own clock. */
  analyzed_at: string;
  alert_text: string;
  enable_live: boolean;
  alert_id: string | null;
  triage_report: TriageReport;
  processing_metadata: ProcessingMetadata | null;
}

export type ApiErrorKind =
  | "unreachable"
  | "timeout"
  | "validation"
  | "server"
  | "invalid_response";

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  details?: string[];

  constructor(
    kind: ApiErrorKind,
    message: string,
    options?: { status?: number; details?: string[] },
  ) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    if (options?.status !== undefined) this.status = options.status;
    if (options?.details !== undefined) this.details = options.details;
  }
}
