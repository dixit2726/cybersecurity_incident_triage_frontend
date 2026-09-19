import { createFileRoute } from "@tanstack/react-router";
import { ActiveIncidentSection } from "@/components/soc/IncidentContext";
import { ThreatIntelPanel } from "@/components/soc/panels";
import { SectionCard } from "@/components/soc/primitives";

export const Route = createFileRoute("/threat-intelligence")({
  head: () => ({
    meta: [
      { title: "Threat Intelligence — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "Threat-intelligence lookup outcomes returned by the triage backend for the analyzed incident, preserving match and no-match distinctions.",
      },
      { property: "og:title", content: "Threat Intelligence — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "Indicator lookup results as reported by the incident triage backend.",
      },
    ],
  }),
  component: ThreatIntelligencePage,
});

function ThreatIntelligencePage() {
  return (
    <ActiveIncidentSection
      title="Threat Intelligence"
      description="Lookup outcomes for the analyzed incident, exactly as reported by the backend."
      emptyMessage="No threat-intelligence matches found."
    >
      {(incident) => (
        <div className="space-y-4">
          <ThreatIntelPanel incident={incident} />
          <SectionCard title="How to read these results">
            <ul className="space-y-2 text-sm text-foreground/85">
              <li>
                <span className="font-medium">Match found</span> — the indicator was present in the
                dataset queried by the backend.
              </li>
              <li>
                <span className="font-medium">No match</span> — the indicator was not found in the
                queried dataset. This does not mean the indicator is benign or safe.
              </li>
              <li>
                <span className="font-medium">Source</span> — shown only when the backend reports
                which dataset or service answered the lookup.
              </li>
              <li>
                Private, internal, invalid or skipped indicators appear with the backend's own
                interpretation text; the interface never rewrites it.
              </li>
            </ul>
          </SectionCard>
        </div>
      )}
    </ActiveIncidentSection>
  );
}
