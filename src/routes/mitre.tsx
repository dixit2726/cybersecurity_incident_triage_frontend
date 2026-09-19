import { createFileRoute } from "@tanstack/react-router";
import { ActiveIncidentSection } from "@/components/soc/IncidentContext";
import { MitrePanel } from "@/components/soc/panels";
import { SectionCard } from "@/components/soc/primitives";

export const Route = createFileRoute("/mitre")({
  head: () => ({
    meta: [
      { title: "MITRE ATT&CK — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "MITRE ATT&CK techniques returned by the triage backend for the analyzed incident, with SUPPORTED, PLAUSIBLE and NOT_SUPPORTED assessments.",
      },
      { property: "og:title", content: "MITRE ATT&CK — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "Technique assessments produced by the incident triage backend.",
      },
    ],
  }),
  component: MitrePage,
});

function MitrePage() {
  return (
    <ActiveIncidentSection
      title="MITRE ATT&CK"
      description="Techniques retrieved and assessed by the backend for the analyzed incident."
      emptyMessage="No MITRE ATT&CK analysis available."
    >
      {(incident) => (
        <div className="space-y-4">
          <MitrePanel incident={incident} />
          <SectionCard title="Assessment values">
            <ul className="space-y-2 text-sm text-foreground/85">
              <li>
                <span className="font-medium">SUPPORTED</span> — the backend judged the incident
                evidence to support the technique.
              </li>
              <li>
                <span className="font-medium">PLAUSIBLE</span> — candidate technique pending analyst
                confirmation. Not a confirmed technique.
              </li>
              <li>
                <span className="font-medium">NOT_SUPPORTED</span> — the evidence does not support
                the technique.
              </li>
              <li>
                Retrieval similarity is a ranking signal, not a probability or confidence
                percentage, and is only shown when the backend returns it.
              </li>
            </ul>
          </SectionCard>
        </div>
      )}
    </ActiveIncidentSection>
  );
}
