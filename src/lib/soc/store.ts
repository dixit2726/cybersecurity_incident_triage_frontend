import { useCallback, useSyncExternalStore } from "react";
import type { StoredIncident, TriageResponse } from "./types";

/**
 * Session-scoped incident store.
 * Holds ONLY analyses actually returned by the backend during this session.
 * Nothing is seeded, generated, or simulated.
 */

const STORAGE_KEY = "soc.user_incident_history";
const MAX_ITEMS = 50;

interface State {
  incidents: StoredIncident[];
  activeKey: string | null;
}

let state: State = { incidents: [], activeKey: null };
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: keep in-memory state only */
    }
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    let raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = window.sessionStorage.getItem("soc.session_incidents");
    }
    if (!raw) return;
    const parsed = JSON.parse(raw) as State;
    if (parsed && Array.isArray(parsed.incidents)) {
      state = { incidents: parsed.incidents, activeKey: parsed.activeKey ?? null };
      emit();
    }
  } catch {
    /* ignore unreadable session data */
  }
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverSnapshot: State = { incidents: [], activeKey: null };

export function useIncidentState(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverSnapshot,
  );
}

export function useIncidents() {
  const { incidents, activeKey } = useIncidentState();
  const active = incidents.find((i) => i.key === activeKey) ?? null;

  const select = useCallback((key: string) => {
    state = { ...state, activeKey: key };
    persist();
    emit();
  }, []);

  const remove = useCallback((key: string) => {
    const incidents = state.incidents.filter((i) => i.key !== key);
    state = {
      incidents,
      activeKey: state.activeKey === key ? (incidents[0]?.key ?? null) : state.activeKey,
    };
    persist();
    emit();
  }, []);

  const clearAll = useCallback(() => {
    state = { incidents: [], activeKey: null };
    persist();
    emit();
  }, []);

  return { incidents, active, activeKey, select, remove, clearAll };
}

export function addIncidentFromResponse(input: {
  response: TriageResponse;
  alertText: string;
  enableLive: boolean;
}): StoredIncident {
  const key =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${state.incidents.length}`;

  const incident: StoredIncident = {
    key,
    analyzed_at: new Date().toISOString(),
    alert_text: input.alertText,
    enable_live: input.enableLive,
    alert_id: input.response.alert_id ?? null,
    triage_report: input.response.triage_report,
    processing_metadata: input.response.processing_metadata ?? null,
  };

  state = {
    incidents: [incident, ...state.incidents].slice(0, MAX_ITEMS),
    activeKey: key,
  };
  persist();
  emit();
  return incident;
}
