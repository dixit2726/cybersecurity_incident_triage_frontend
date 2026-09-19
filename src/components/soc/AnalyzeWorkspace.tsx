import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Download, Eraser, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { describeError, postTriage } from "@/lib/soc/api";
import { addIncidentFromResponse, useIncidents } from "@/lib/soc/store";
import { copyIncidentJson, downloadIncidentJson } from "@/lib/soc/export";
import {
  ActionsPanel,
  AlertSourcePanel,
  CisaPanel,
  EvidencePanel,
  IocPanel,
  MitrePanel,
  OverviewPanel,
  PlaybookPanel,
  ThreatIntelPanel,
} from "./panels";
import { EmptyState, ErrorPanel, ReviewBanner, SectionCard, SeverityBadge } from "./primitives";
import { IncidentAssistant } from "./IncidentAssistant";

const PIPELINE = [
  "Parse alert",
  "Retrieve MITRE / playbook / CISA evidence",
  "Check threat intelligence",
  "Build evidence package",
  "AI triage synthesis",
  "Analyst review",
];

export function AnalyzeWorkspace() {
  const queryClient = useQueryClient();
  const { active } = useIncidents();
  const [alertText, setAlertText] = useState("");
  const [enableLive, setEnableLive] = useState(false);
  const [validation, setValidation] = useState<string | null>(null);

  const triage = useMutation({
    mutationKey: ["soc", "triage"],
    mutationFn: (input: { alert_text: string; enable_live: boolean }) => postTriage(input),
    onSuccess: (response, variables) => {
      addIncidentFromResponse({
        response,
        alertText: variables.alert_text,
        enableLive: variables.enable_live,
      });
      // The triage request just succeeded, so the API is definitively healthy
      queryClient.setQueryData(["soc", "health"], { status: "healthy" });
      toast.success("Triage report received from the backend.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["soc", "health"] });
    },
  });

  function analyze() {
    if (!alertText.trim()) {
      setValidation("Please enter a security alert.");
      return;
    }
    setValidation(null);
    triage.mutate({ alert_text: alertText, enable_live: enableLive });
  }

  const error = triage.isError ? describeError(triage.error) : null;

  return (
    <div className="space-y-5">
      <SectionCard
        title="Complete Security Alert"
        subtitle="Paste one complete alert. The backend parser extracts indicators, behaviour and metadata — no separate fields are needed."
        actions={
          <div className="flex items-center gap-2">
            <Switch
              id="live-ti"
              checked={enableLive}
              onCheckedChange={setEnableLive}
              disabled={triage.isPending}
            />
            <Label htmlFor="live-ti" className="mono-xs text-muted-foreground">
              Live threat intel enrichment
            </Label>
          </div>
        }
      >
        <Textarea
          value={alertText}
          onChange={(e) => setAlertText(e.target.value)}
          rows={12}
          spellCheck={false}
          disabled={triage.isPending}
          placeholder="Paste the complete security alert here…"
          className="resize-y bg-panel font-mono text-[0.8125rem] leading-relaxed"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button onClick={analyze} disabled={triage.isPending} className="gap-1.5">
            {triage.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Play className="size-4" aria-hidden />
            )}
            {triage.isPending ? "Analyzing…" : "Analyze Alert"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAlertText("");
              setValidation(null);
              triage.reset();
            }}
            disabled={triage.isPending}
            className="gap-1.5"
          >
            <Eraser className="size-4" aria-hidden />
            Clear
          </Button>
          <span className="mono-xs text-muted-foreground">
            {alertText.length.toLocaleString()} characters
          </span>
        </div>

        {validation && (
          <p role="alert" className="mt-3 text-sm text-warn">
            {validation}
          </p>
        )}
        {error && (
          <div className="mt-3">
            <ErrorPanel title={error.title} body={error.body} details={error.details} />
          </div>
        )}
      </SectionCard>

      <SectionCard title="Triage pipeline" subtitle="Executed end to end by the backend service.">
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {PIPELINE.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-2 rounded-md border border-border bg-surface/50 px-3 py-2"
            >
              <span className="mono-xs w-4 text-muted-foreground">{i + 1}</span>
              <span className="text-sm text-foreground/85">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">
          {triage.isPending
            ? "Analysis in progress on the backend. Step completion is not reported by the API, so no step is marked complete until the full report returns."
            : "Stage-level progress is not reported by the API; the full report is returned on completion."}
        </p>
      </SectionCard>

      {!active ? (
        <EmptyState
          message="Run an alert analysis to view results."
          hint="Results appear here only after the backend returns a triage report."
        />
      ) : (
        <div className="space-y-4">
          <SectionCard
            title="Incident Triage Result"
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge
                  label="Assessed"
                  value={active.triage_report.severity_assessment?.assessed_severity}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    copyIncidentJson(active)
                      .then(() => toast.success("Report JSON copied."))
                      .catch(() => toast.error("Clipboard access was blocked by the browser."));
                  }}
                >
                  <Copy className="size-3.5" aria-hidden />
                  Copy Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => downloadIncidentJson(active)}
                >
                  <Download className="size-3.5" aria-hidden />
                  Download JSON
                </Button>
              </div>
            }
          >
            {active.triage_report.analyst_review_required ? (
              <ReviewBanner />
            ) : (
              <p className="text-xs text-muted-foreground">
                The backend did not flag an analyst review requirement for this incident.
              </p>
            )}
          </SectionCard>

          <Tabs defaultValue="overview">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-surface p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="iocs">IOCs</TabsTrigger>
              <TabsTrigger value="ti">Threat Intel</TabsTrigger>
              <TabsTrigger value="mitre">MITRE</TabsTrigger>
              <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
              <TabsTrigger value="cisa">CISA</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
              <TabsTrigger value="alert">Alert</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <OverviewPanel incident={active} />
            </TabsContent>
            <TabsContent value="evidence" className="mt-4">
              <EvidencePanel incident={active} />
            </TabsContent>
            <TabsContent value="iocs" className="mt-4">
              <IocPanel incident={active} />
            </TabsContent>
            <TabsContent value="ti" className="mt-4">
              <ThreatIntelPanel incident={active} />
            </TabsContent>
            <TabsContent value="mitre" className="mt-4">
              <MitrePanel incident={active} />
            </TabsContent>
            <TabsContent value="playbooks" className="mt-4">
              <PlaybookPanel incident={active} />
            </TabsContent>
            <TabsContent value="cisa" className="mt-4">
              <CisaPanel incident={active} />
            </TabsContent>
            <TabsContent value="actions" className="mt-4">
              <ActionsPanel incident={active} />
            </TabsContent>
            <TabsContent value="assistant" className="mt-4">
              <IncidentAssistant incident={active} />
            </TabsContent>
            <TabsContent value="alert" className="mt-4">
              <AlertSourcePanel incident={active} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
