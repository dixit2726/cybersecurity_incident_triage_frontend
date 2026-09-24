import {
  ApiError,
  type HealthResponse,
  type IncidentAskResponse,
  type IncidentDetailResponse,
  type IncidentListResponse,
  type TriageReport,
  type TriageResponse,
} from "./types";

/**
 * Client for the existing FastAPI triage backend.
 * All AI / RAG / threat-intelligence logic stays in the Python service:
 * this module only performs HTTP calls and surfaces safe error messages.
 */

const BASE_URL_KEY = "soc.api_base_url";
const DEFAULT_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined)?.trim() ||
  (import.meta.env.PROD
    ? "https://cybersecurity-incident-triage-backend-2.onrender.com"
    : "http://127.0.0.1:8000");

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BASE_URL;
  const stored = window.localStorage.getItem(BASE_URL_KEY)?.trim();
  if (stored) {
    try {
      const storedUrl = new URL(stored);
      if (
        storedUrl.port === "8080" ||
        storedUrl.port === window.location.port ||
        storedUrl.host === window.location.host ||
        stored.includes(":8080")
      ) {
        window.localStorage.removeItem(BASE_URL_KEY);
      } else {
        return stored;
      }
    } catch {
      window.localStorage.removeItem(BASE_URL_KEY);
    }
  }

  // If accessing via local network IP (e.g. 192.168.x.x), route default backend to same host on port 8000
  if (
    DEFAULT_BASE_URL.includes("127.0.0.1:8000") ||
    DEFAULT_BASE_URL.includes("localhost:8000")
  ) {
    if (
      window.location.hostname &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return `http://${window.location.hostname}:8000`;
    }
  }

  return DEFAULT_BASE_URL;
}



export function setApiBaseUrl(url: string): void {
  if (typeof window === "undefined") return;
  const clean = url.trim().replace(/\/+$/, "");
  if (clean) window.localStorage.setItem(BASE_URL_KEY, clean);
  else window.localStorage.removeItem(BASE_URL_KEY);
}

export function getDefaultApiBaseUrl(): string {
  return DEFAULT_BASE_URL;
}

/** True when the configured URL points at the machine running the browser. */
export function isLoopbackUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  } catch {
    return false;
  }
}

/** True when the console itself is served over HTTPS (hosted preview or published site). */
export function isSecureContextPage(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
}

/**
 * Explains why a configured address cannot work from the current page.
 * Returns null when the combination is valid.
 */
export function diagnoseApiBaseUrl(url = getApiBaseUrl()): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "The API address is not a valid URL. Use the full form, for example https://triage.example.com.";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "The API address must start with http:// or https://.";
  }
  if (!isSecureContextPage()) return null;

  if (isLoopbackUrl(url)) {
    return "This page is served over HTTPS, so a localhost address cannot be reached: it points at whichever machine makes the request, not your development machine. Run the console locally, or expose the FastAPI service on a public HTTPS address and enter it here.";
  }
  if (parsed.protocol === "http:") {
    return "This page is served over HTTPS, so the browser blocks plain http:// backend requests. Serve the FastAPI service over HTTPS.";
  }
  return null;
}

function messageForKind(kind: ApiError["kind"], base: string): string {
  switch (kind) {
    case "unreachable": {
      const diagnosis = diagnoseApiBaseUrl(base);
      if (diagnosis) return diagnosis;
      return `The triage backend at ${base} could not be reached. Start the FastAPI service, confirm the address in Settings, and allow this site's address in the service's ALLOWED_ORIGINS setting.`;
    }
    case "timeout":
      return "The triage backend did not respond in time. The request may still be processing on the server.";
    case "invalid_response":
      return "The triage backend returned a response the interface could not read.";
    default:
      return "The triage backend reported an error.";
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<T> {
  const base = getApiBaseUrl();
  const { timeoutMs = 180_000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(rest.headers ?? {}) },
    });
  } catch (error) {
    clearTimeout(timer);
    const aborted = error instanceof DOMException && error.name === "AbortError";
    const kind = aborted ? "timeout" : "unreachable";
    throw new ApiError(kind, messageForKind(kind, base));
  }
  clearTimeout(timer);

  let payload: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      if (response.ok) {
        throw new ApiError("invalid_response", messageForKind("invalid_response", base));
      }
    }
  }

  if (!response.ok) {
    const body = (payload ?? {}) as {
      detail?: unknown;
      errors?: { field?: string; message?: string }[];
    };
    const detail = typeof body.detail === "string" ? body.detail : undefined;
    const details = Array.isArray(body.errors)
      ? body.errors.map((e) =>
          [e.field, e.message].filter(Boolean).join(": ") || "Invalid input.",
        )
      : undefined;

    if (response.status === 422) {
      throw new ApiError("validation", detail ?? "The backend rejected the request payload.", {
        status: response.status,
        ...(details ? { details } : {}),
      });
    }
    throw new ApiError("server", detail ?? messageForKind("server", base), {
      status: response.status,
    });
  }

  return payload as T;
}

export async function fetchHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health", { method: "GET", timeoutMs: 8_000 });
}

export async function postTriage(input: {
  alert_text: string;
  enable_live: boolean;
}): Promise<TriageResponse> {
  const result = await request<TriageResponse>("/api/v1/triage", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!result || typeof result !== "object" || typeof result.triage_report !== "object") {
    throw new ApiError("invalid_response", messageForKind("invalid_response", getApiBaseUrl()));
  }
  return result;
}

export async function postIncidentQuestion(input: {
  triage_report: TriageReport;
  question: string;
  alert_text?: string;
}): Promise<IncidentAskResponse> {
  return request<IncidentAskResponse>("/api/v1/incident/ask", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchIncidents(limit = 20, offset = 0): Promise<IncidentListResponse> {
  const query = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  return request<IncidentListResponse>(`/api/v1/incidents?${query.toString()}`, {
    method: "GET",
  });
}

export async function fetchIncident(incidentId: string): Promise<IncidentDetailResponse> {
  return request<IncidentDetailResponse>(`/api/v1/incidents/${encodeURIComponent(incidentId)}`, {
    method: "GET",
  });
}

export function describeError(error: unknown): { title: string; body: string; details?: string[] } {
  if (error instanceof ApiError) {
    const titles: Record<ApiError["kind"], string> = {
      unreachable: "Backend unavailable",
      timeout: "Request timed out",
      validation: "Request rejected",
      server: "Backend error",
      invalid_response: "Unreadable response",
    };
    return {
      title: titles[error.kind],
      body: error.message,
      ...(error.details ? { details: error.details } : {}),
    };
  }
  return {
    title: "Unexpected error",
    body: "The interface could not complete the request. Check the backend service and try again.",
  };
}
