import { createFileRoute } from "@tanstack/react-router";
import { AnalyzeWorkspace } from "@/components/soc/AnalyzeWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Analyze Alert — Cybersecurity Incident Triage AI" },
      {
        name: "description",
        content:
          "Submit a complete security alert for evidence-grounded SOC triage: parsing, MITRE ATT&CK and playbook retrieval, threat intelligence and AI assessment.",
      },
      { property: "og:title", content: "Analyze Alert — Cybersecurity Incident Triage AI" },
      {
        property: "og:description",
        content: "Evidence-grounded SOC incident analysis workspace for security analysts.",
      },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  return <AnalyzeWorkspace />;
}
