import type { StoredIncident } from "./types";

/** Exports the backend result verbatim. The report is never modified here. */
export function buildExportPayload(incident: StoredIncident) {
  return {
    exported_at: new Date().toISOString(),
    alert_id: incident.alert_id,
    analyzed_at: incident.analyzed_at,
    enable_live: incident.enable_live,
    alert_text: incident.alert_text,
    triage_report: incident.triage_report,
    processing_metadata: incident.processing_metadata,
  };
}

export function exportFileName(incident: StoredIncident) {
  const id = (incident.alert_id ?? "incident").replace(/[^A-Za-z0-9._-]/g, "_");
  return `triage_${id}_${incident.analyzed_at.replace(/[:.]/g, "-")}.json`;
}

export function downloadIncidentJson(incident: StoredIncident) {
  const blob = new Blob([JSON.stringify(buildExportPayload(incident), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = exportFileName(incident);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function copyIncidentJson(incident: StoredIncident) {
  const text = JSON.stringify(buildExportPayload(incident), null, 2);
  await navigator.clipboard.writeText(text);
}
