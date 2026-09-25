import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Download, Eraser, FileText, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { describeError, postTriage } from "@/lib/soc/api";
import { addIncidentFromResponse, useIncidents } from "@/lib/soc/store";
import { copyIncidentJson, downloadIncidentJson } from "@/lib/soc/export";
import {
  AlertSourcePanel,
  DetectionPanel,
  EvidencePanel,
  OverviewPanel,
  ResponsePanel,
} from "./panels";
import {
  EmptyState,
  ErrorPanel,
  ReviewBanner,
  SectionCard,
  SeverityBadge,
  StatusDot,
} from "./primitives";
import { IncidentAssistant } from "./IncidentAssistant";

const SAMPLE_ALERT = `ALERT ID: SEC-2026-0925-001
Timestamp: 2026-09-25 10:30:00 UTC
Alert Type: Malicious URL Detection
Event Type: Malware Download Activity
Severity: HIGH
Source IP: 10.10.25.14
Destination IP: 219.155.83.56
Protocol: HTTP
Destination Port: 57148
URL: http://219.155.83.56:57148/i
IOC Type: URL
IOC: http://219.155.83.56:57148/i
Description: Endpoint communication detected with a suspicious external URL associated with potential malware download activity.`;

export function AnalyzeWorkspace() {
  const queryClient = useQueryClient();
  const { active } = useIncidents();
  const [alertText, setAlertText] = useState("");
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
      // The triage request succeeded, mark API healthy
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
    triage.mutate({ alert_text: alertText, enable_live: false });
  }

  const error = triage.isError ? describeError(triage.error) : null;

  return (
    <div className="space-y-6">
      {/* 4. Alert Analysis Area */}
      <SectionCard
        title="Analyze Security Alert"
        subtitle="Paste one complete security alert. The AI will automatically extract indicators, enrich with threat intelligence, map to MITRE ATT&CK, and provide response guidance."
        actions={
          <div
            className="flex items-center gap-2 rounded-md border border-border bg-surface/80 px-2.5 py-1 select-none"
            title="Threat intelligence enrichment is enabled and part of the incident triage workflow."
          >
            <StatusDot tone="ok" />
            <span className="mono-xs text-foreground/85">
              Threat Intelligence:{" "}
              <span className="font-medium text-ok">Active</span>
            </span>
          </div>
        }
      >
        <Textarea
          value={alertText}
          onChange={(e) => setAlertText(e.target.value)}
          rows={11}
          spellCheck={false}
          disabled={triage.isPending}
          placeholder="Paste the complete security alert here..."
          className="resize-y bg-panel font-mono text-[0.8125rem] leading-relaxed border-border/80"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={analyze}
              disabled={triage.isPending}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              {triage.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Play className="size-4" aria-hidden />
              )}
              {triage.isPending ? "Analyzing..." : "Analyze Alert"}
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
            <Button
              variant="outline"
              onClick={() => {
                setAlertText(SAMPLE_ALERT);
                setValidation(null);
              }}
              disabled={triage.isPending}
              className="gap-1.5"
            >
              <FileText className="size-4" aria-hidden />
              Sample Alert
            </Button>
          </div>
          <span className="mono-xs text-muted-foreground">
            {alertText.length.toLocaleString()} characters
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Load a sample security alert to test the triage workflow.
        </p>

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

      {/* Incident Result Workspace */}
      {!active ? (
        <EmptyState
          message="Run an alert analysis to view results."
          hint="Results appear here only after the backend returns a triage report."
        />
      ) : (
        <div className="space-y-4">
          {/* 5. Incident Result Header */}
          <SectionCard
            title="Incident Triage Result"
            subtitle="AI-powered analysis with threat intelligence, MITRE ATT&CK mapping, and response guidance."
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

          {/* 6 & 12. Main Navigation + Persistent AI Assistant Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
            {/* Center / Left: 5 Main Incident Tabs */}
            <div className="lg:col-span-8 space-y-4 min-w-0">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-surface border border-border p-1">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-panel data-[state=active]:text-primary font-medium text-xs">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="evidence" className="data-[state=active]:bg-panel data-[state=active]:text-primary font-medium text-xs">
                    Evidence
                  </TabsTrigger>
                  <TabsTrigger value="detection" className="data-[state=active]:bg-panel data-[state=active]:text-primary font-medium text-xs">
                    Detection
                  </TabsTrigger>
                  <TabsTrigger value="response" className="data-[state=active]:bg-panel data-[state=active]:text-primary font-medium text-xs">
                    Response
                  </TabsTrigger>
                  <TabsTrigger value="alert" className="data-[state=active]:bg-panel data-[state=active]:text-primary font-medium text-xs">
                    Alert
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="mt-4 focus-visible:outline-none">
                  <OverviewPanel incident={active} />
                </TabsContent>

                {/* Tab 2: Evidence */}
                <TabsContent value="evidence" className="mt-4 focus-visible:outline-none">
                  <EvidencePanel incident={active} />
                </TabsContent>

                {/* Tab 3: Detection */}
                <TabsContent value="detection" className="mt-4 focus-visible:outline-none">
                  <DetectionPanel incident={active} />
                </TabsContent>

                {/* Tab 4: Response */}
                <TabsContent value="response" className="mt-4 focus-visible:outline-none">
                  <ResponsePanel incident={active} />
                </TabsContent>

                {/* Tab 5: Alert */}
                <TabsContent value="alert" className="mt-4 focus-visible:outline-none">
                  <AlertSourcePanel incident={active} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: Persistent AI Assistant Panel */}
            <div className="lg:col-span-4 lg:sticky lg:top-16">
              <IncidentAssistant incident={active} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
