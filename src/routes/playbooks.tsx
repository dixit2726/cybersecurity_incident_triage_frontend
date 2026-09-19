import { createFileRoute } from "@tanstack/react-router";
import { ActiveIncidentSection } from "@/components/soc/IncidentContext";
import { PlaybookPanel } from "@/components/soc/panels";
import { SectionCard } from "@/components/soc/primitives";

export const Route = createFileRoute("/playbooks")({
  head: () => ({
    meta: [
      { title: "Response Playbooks — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "Response playbook steps returned by the triage backend for the analyzed incident. Only retrieved playbooks are shown.",
      },
      { property: "og:title", content: "Response Playbooks — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "Playbook guidance retrieved by the incident triage backend.",
      },
    ],
  }),
  component: PlaybooksPage,
});

function PlaybooksPage() {
  return (
    <ActiveIncidentSection
      title="Response Playbooks"
      description="Playbook steps the backend retrieved for the analyzed incident."
      emptyMessage="No response playbook recommendations available."
    >
      {(incident) => (
        <div className="space-y-4">
          <PlaybookPanel incident={incident} />
          <SectionCard title="Playbook library">
            <p className="text-sm text-foreground/85">
              The backend retrieves playbook guidance per incident. Browsing the full playbook
              library is not available in the current backend, which exposes no playbook listing
              endpoint.
            </p>
          </SectionCard>
        </div>
      )}
    </ActiveIncidentSection>
  );
}
