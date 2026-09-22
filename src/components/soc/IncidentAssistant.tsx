import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { describeError, postIncidentQuestion } from "@/lib/soc/api";
import type { IncidentAskResponse, StoredIncident } from "@/lib/soc/types";
import { EmptyState, ErrorPanel, SectionCard } from "./primitives";
import { MarkdownRenderer } from "./MarkdownRenderer";

const SUGGESTIONS = [
  "Why was this classified this way?",
  "Which MITRE techniques are supported?",
  "What evidence supports this assessment?",
  "What should I investigate next?",
  "What threat intelligence was found?",
  "What response playbook is relevant?",
  "What evidence should I collect?",
];

interface Exchange {
  question: string;
  answer: string;
  grounding?: Record<string, unknown>;
}

export function IncidentAssistant({ incident }: { incident: StoredIncident }) {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [validation, setValidation] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const ask = useMutation({
    mutationKey: ["soc", "ask"],
    mutationFn: (q: string) =>
      postIncidentQuestion({
        triage_report: incident.triage_report,
        question: q,
        alert_text: incident.alert_text,
      }),
    onSuccess: (data: IncidentAskResponse, q) => {
      setExchanges((prev) => [
        { question: data.question || q, answer: data.answer, ...(data.grounding ? { grounding: data.grounding } : {}) },
        ...prev,
      ]);
      setQuestion("");
      queryClient.setQueryData(["soc", "health"], { status: "healthy" });
    },
  });


  function submit(value: string) {
    const clean = value.trim();
    if (!clean) {
      setValidation("Please enter a question about this incident.");
      return;
    }
    setValidation(null);
    ask.mutate(clean);
  }

  const error = ask.isError ? describeError(ask.error) : null;

  return (
    <SectionCard
      title="Incident AI Assistant"
      subtitle="Scoped to this analyzed incident only. Answers are grounded in the backend triage report and retrieved guidance."
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuestion(s)}
              className="rounded-sm border border-border bg-surface px-2 py-1 mono-xs text-foreground/75 transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="Ask a question about this incident…"
          className="resize-y bg-panel font-mono text-[0.8125rem]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(question);
          }}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => submit(question)}
            disabled={ask.isPending}
            className="gap-1.5"
          >
            <Send className="size-3.5" aria-hidden />
            {ask.isPending ? "Consulting incident evidence…" : "Ask"}
          </Button>
          <span className="mono-xs text-muted-foreground">Ctrl/Cmd + Enter to submit</span>
        </div>

        {validation && <p className="text-xs text-warn">{validation}</p>}
        {error && <ErrorPanel title={error.title} body={error.body} details={error.details} />}

        {exchanges.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-5" aria-hidden />}
            message="No questions asked for this incident yet."
            hint="Answers come from the backend assistant and stay limited to this incident's evidence."
          />
        ) : (
          <ul className="space-y-3">
            {exchanges.map((ex, i) => (
              <li key={i} className="rounded-md border border-border bg-surface/50">
                <div className="border-b border-border px-3 py-2 text-sm font-medium text-foreground">
                  {ex.question}
                </div>
                <div className="px-3 py-3">
                  <MarkdownRenderer content={ex.answer} />
                  {ex.grounding && Object.keys(ex.grounding).length > 0 && (
                    <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-2">
                      {Object.entries(ex.grounding).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-1.5">
                          <dt className="label-caps">{k.replace(/_/g, " ")}</dt>
                          <dd className="mono-xs text-foreground/80">{String(v)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionCard>
  );
}
