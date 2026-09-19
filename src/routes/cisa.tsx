import { createFileRoute } from "@tanstack/react-router";
import { ActiveIncidentSection } from "@/components/soc/IncidentContext";
import { CisaPanel } from "@/components/soc/panels";
import { SectionCard } from "@/components/soc/primitives";

export const Route = createFileRoute("/cisa")({
  head: () => ({
    meta: [
      { title: "CISA Guidance — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "CISA guidance retrieved by the triage backend for the analyzed incident. No recommendations are added by the interface.",
      },
      { property: "og:title", content: "CISA Guidance — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "CISA guidance retrieved for the analyzed security incident.",
      },
    ],
  }),
  component: CisaPage,
});

function CisaPage() {
  return (
    <ActiveIncidentSection
      title="CISA Guidance"
      description="Guidance the backend retrieved for the analyzed incident."
      emptyMessage="No CISA guidance available."
    >
      {(incident) => (
        <div className="space-y-4">
          <CisaPanel incident={incident} />
          <SectionCard title="Document details">
            <p className="text-sm text-foreground/85">
              Document titles, categories and source references are part of the backend evidence
              package, which is not exposed by an endpoint. Only the guidance text returned in the
              triage report can be displayed here.
            </p>
          </SectionCard>
        </div>
      )}
    </ActiveIncidentSection>
  );
}
