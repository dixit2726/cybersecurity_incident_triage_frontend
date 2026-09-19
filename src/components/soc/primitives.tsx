import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  subtitle,
  actions,
  count,
  children,
  className,
}: {
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode;
  count?: number | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section className={cn("panel", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
            {typeof count === "number" && (
              <span className="rounded-sm bg-muted px-1.5 py-0.5 mono-xs text-muted-foreground">
                {count}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {actions}
      </header>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

export function EmptyState({
  message,
  hint,
  icon,
}: {
  message: string;
  hint?: string | undefined;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface/40 px-6 py-10 text-center">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="text-sm text-foreground/80">{message}</p>
      {hint && <p className="max-w-md text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | number | null | undefined;
  mono?: boolean | undefined;
}) {
  const has = value !== undefined && value !== null && `${value}`.trim() !== "";
  return (
    <div className="min-w-0">
      <div className="label-caps">{label}</div>
      <div
        className={cn(
          "mt-0.5 break-words text-sm",
          mono && "font-mono text-[0.8125rem]",
          has ? "text-foreground" : "text-muted-foreground italic",
        )}
      >
        {has ? value : "Not available"}
      </div>
    </div>
  );
}

function severityTone(value?: string) {
  const v = (value ?? "").toUpperCase();
  if (v.includes("CRITICAL") || v.includes("HIGH"))
    return "border-danger/40 bg-danger/15 text-danger";
  if (v.includes("MEDIUM") || v.includes("MODERATE"))
    return "border-warn/40 bg-warn/15 text-warn";
  if (v.includes("LOW")) return "border-ok/40 bg-ok/15 text-ok";
  if (v.includes("INFO")) return "border-info/40 bg-info/15 text-info";
  return "border-border bg-muted text-muted-foreground";
}

export function SeverityBadge({
  value,
  label,
}: {
  value?: string | undefined;
  label?: string | undefined;
}) {
  const has = (value ?? "").trim() !== "";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-semibold uppercase tracking-wide",
        has ? severityTone(value) : "border-border bg-muted text-muted-foreground",
      )}
    >
      {label && <span className="font-medium normal-case tracking-normal opacity-70">{label}</span>}
      {has ? value : "Not available"}
    </span>
  );
}

export function AssessmentBadge({ value }: { value?: string | undefined }) {
  const v = (value ?? "").toUpperCase();
  const tone = v.startsWith("SUPPORTED")
    ? "border-ok/40 bg-ok/15 text-ok"
    : v.startsWith("NOT_SUPPORTED") || v.startsWith("NOT SUPPORTED")
      ? "border-border bg-muted text-muted-foreground"
      : v.startsWith("PLAUSIBLE")
        ? "border-warn/40 bg-warn/15 text-warn"
        : "border-border bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm border px-2 py-0.5 mono-xs font-semibold",
        tone,
      )}
    >
      {(value ?? "").trim() || "Not available"}
    </span>
  );
}

export function MatchBadge({ matched }: { matched?: boolean | undefined }) {
  if (matched === undefined) {
    return (
      <span className="inline-flex items-center rounded-sm border border-border bg-muted px-2 py-0.5 mono-xs text-muted-foreground">
        Not reported
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 mono-xs font-semibold",
        matched
          ? "border-danger/40 bg-danger/15 text-danger"
          : "border-border bg-surface-raised text-muted-foreground",
      )}
    >
      {matched ? "Match found" : "No match"}
    </span>
  );
}

export function StatusDot({ tone }: { tone: "ok" | "warn" | "danger" | "idle" | "busy" }) {
  const map = {
    ok: "bg-ok",
    warn: "bg-warn",
    danger: "bg-danger",
    idle: "bg-muted-foreground",
    busy: "bg-info animate-pulse",
  } as const;
  return <span className={cn("size-2 shrink-0 rounded-full", map[tone])} aria-hidden />;
}

export function BulletList({
  items,
  emptyMessage,
}: {
  items?: string[] | undefined;
  emptyMessage: string;
}) {
  const clean = (items ?? []).filter((i) => typeof i === "string" && i.trim() !== "");
  if (clean.length === 0) return <EmptyState message={emptyMessage} />;
  return (
    <ol className="space-y-2">
      {clean.map((item, index) => (
        <li key={`${index}-${item.slice(0, 24)}`} className="flex gap-3">
          <span className="mt-0.5 w-5 shrink-0 text-right mono-xs text-muted-foreground">
            {index + 1}
          </span>
          <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function ReviewBanner() {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-warn/40 bg-warn/10 px-4 py-3">
      <p className="text-sm font-semibold uppercase tracking-wide text-warn">
        Analyst review required
      </p>
      <p className="text-xs leading-relaxed text-foreground/80">
        AI-generated triage is advisory. Validate the underlying evidence before taking containment
        or remediation actions.
      </p>
    </div>
  );
}

export function ErrorPanel({
  title,
  body,
  details,
}: {
  title: string;
  body: string;
  details?: string[] | undefined;
}) {
  return (
    <div
      role="alert"
      className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm"
    >
      <p className="font-semibold text-danger">{title}</p>
      <p className="mt-1 text-foreground/85">{body}</p>
      {details && details.length > 0 && (
        <ul className="mt-2 space-y-1 mono-xs text-foreground/70">
          {details.map((d) => (
            <li key={d}>• {d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NotImplemented({ note }: { note: string }) {
  return (
    <EmptyState
      message="Not available in the current backend."
      hint={note}
    />
  );
}

export { MarkdownRenderer } from "./MarkdownRenderer";
