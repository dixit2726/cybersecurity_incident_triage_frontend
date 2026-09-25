import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, MessageSquare, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { describeError, postIncidentQuestion } from "@/lib/soc/api";
import type { IncidentAskResponse, StoredIncident } from "@/lib/soc/types";
import { EmptyState, ErrorPanel } from "./primitives";
import { MarkdownRenderer } from "./MarkdownRenderer";

const SUGGESTED_QUESTIONS = [
  "Explain this threat",
  "What are the recommended actions?",
  "Show related MITRE techniques",
  "Is this a known malware campaign?",
  "What should I investigate next?",
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
        {
          question: data.question || q,
          answer: data.answer,
          ...(data.grounding ? { grounding: data.grounding } : {}),
        },
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
    <div className="flex h-full min-h-[640px] flex-col rounded-lg border border-indigo-900/40 bg-panel/95 shadow-md shadow-indigo-950/20 backdrop-blur">
      {/* Panel Header */}
      <div className="border-b border-indigo-950/60 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
              <Bot className="size-4" aria-hidden />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                AI Assistant
              </h3>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 mono-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800/40">
            <Sparkles className="size-3" /> Grounded
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Ask questions about this incident, indicators, MITRE mapping, or response actions.
        </p>
      </div>

      {/* Suggested Questions */}
      <div className="border-b border-border/60 bg-surface/40 p-3">
        <p className="mb-2 label-caps text-indigo-300/80">Suggested questions</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuestion(s);
                submit(s);
              }}
              disabled={ask.isPending}
              className="rounded border border-indigo-800/40 bg-indigo-950/40 px-2 py-1 mono-xs text-indigo-200/90 transition-colors hover:border-indigo-600/70 hover:bg-indigo-900/50 hover:text-indigo-100 disabled:opacity-50 text-left"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="border-b border-border/60 p-3 bg-panel/80">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="Ask a question..."
          className="resize-none bg-surface/80 font-mono text-[0.8125rem] focus-visible:ring-indigo-500/50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(question);
          }}
        />

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <Button
            size="sm"
            onClick={() => submit(question)}
            disabled={ask.isPending}
            className="gap-1.5 bg-indigo-600 text-white hover:bg-indigo-500 font-medium shadow-sm transition-colors"
          >
            <Send className="size-3.5" aria-hidden />
            {ask.isPending ? "Analyzing..." : "Send"}
          </Button>
          <span className="mono-xs text-muted-foreground">Ctrl/Cmd + Enter</span>
        </div>

        {validation && <p className="mt-2 text-xs text-warn">{validation}</p>}
        {error && (
          <div className="mt-2">
            <ErrorPanel title={error.title} body={error.body} details={error.details} />
          </div>
        )}
      </div>

      {/* Q&A Exchange History (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[600px]">
        {exchanges.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-5 text-indigo-400" aria-hidden />}
            message="No questions asked for this incident yet."
            hint="Answers are strictly grounded in this incident's evidence and MITRE/CISA guidance."
          />
        ) : (
          exchanges.map((ex, i) => (
            <div
              key={i}
              className="rounded-md border border-indigo-950/80 bg-surface/70 shadow-sm"
            >
              <div className="border-b border-border/60 bg-surface px-3 py-2 text-xs font-semibold text-foreground flex items-center justify-between gap-2">
                <span className="truncate">{ex.question}</span>
                <span className="mono-xs text-muted-foreground shrink-0">Analyst</span>
              </div>
              <div className="p-3 text-xs">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
