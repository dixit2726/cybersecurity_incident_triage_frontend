import { createContext, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { cn } from "@/lib/utils";

const InPreContext = createContext(false);

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={cn("markdown-content text-sm leading-relaxed text-foreground/90", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ children, className: c, ...props }) => (
            <h1
              className={cn(
                "mt-4 mb-2 border-b border-border/60 pb-1 text-base font-semibold tracking-tight text-foreground first:mt-0",
                c
              )}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, className: c, ...props }) => (
            <h2
              className={cn(
                "mt-3 mb-1.5 text-sm font-semibold tracking-tight text-foreground first:mt-0",
                c
              )}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, className: c, ...props }) => (
            <h3
              className={cn(
                "mt-2.5 mb-1 text-xs font-semibold uppercase tracking-wider text-foreground/90 first:mt-0",
                c
              )}
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, className: c, ...props }) => (
            <h4
              className={cn("mt-2 mb-1 text-xs font-semibold text-foreground/80 first:mt-0", c)}
              {...props}
            >
              {children}
            </h4>
          ),
          p: ({ children, className: c, ...props }) => (
            <p
              className={cn("my-2 text-sm leading-relaxed text-foreground/90 first:mt-0 last:mb-0", c)}
              {...props}
            >
              {children}
            </p>
          ),
          strong: ({ children, className: c, ...props }) => (
            <strong className={cn("font-semibold text-foreground", c)} {...props}>
              {children}
            </strong>
          ),
          em: ({ children, className: c, ...props }) => (
            <em className={cn("italic text-foreground/90", c)} {...props}>
              {children}
            </em>
          ),
          ul: ({ children, className: c, ...props }) => (
            <ul
              className={cn(
                "my-2 list-disc space-y-1 pl-5 text-sm text-foreground/90 first:mt-0 last:mb-0",
                c
              )}
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, className: c, ...props }) => (
            <ol
              className={cn(
                "my-2 list-decimal space-y-1 pl-5 text-sm text-foreground/90 first:mt-0 last:mb-0",
                c
              )}
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, className: c, ...props }) => (
            <li className={cn("text-sm leading-relaxed marker:text-primary/70", c)} {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, className: c, ...props }) => (
            <blockquote
              className={cn(
                "my-2 border-l-2 border-primary/50 bg-panel/30 py-1 pl-3 italic text-foreground/80 first:mt-0 last:mb-0",
                c
              )}
              {...props}
            >
              {children}
            </blockquote>
          ),
          hr: ({ className: c, ...props }) => (
            <hr className={cn("my-3 border-border/70", c)} {...props} />
          ),
          pre: ({ children, className: c, ...props }) => (
            <InPreContext.Provider value={true}>
              <pre
                className={cn(
                  "my-2.5 overflow-x-auto rounded-md border border-border bg-panel p-3 font-mono text-xs leading-relaxed text-foreground/90 first:mt-0 last:mb-0",
                  c
                )}
                {...props}
              >
                {children}
              </pre>
            </InPreContext.Provider>
          ),
          code: ({ children, className: c, ...props }) => {
            const inPre = useContext(InPreContext);
            if (inPre) {
              return (
                <code className={cn("font-mono text-xs text-foreground/90", c)} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className={cn(
                  "rounded border border-border/70 bg-panel px-1.5 py-0.5 font-mono text-[0.8125rem] text-primary",
                  c
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ href, children, className: c, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-primary underline underline-offset-2 transition-colors hover:text-primary/80",
                c
              )}
              {...props}
            >
              {children}
            </a>
          ),
          table: ({ children, className: c, ...props }) => (
            <div className="my-3 overflow-x-auto rounded border border-border first:mt-0 last:mb-0">
              <table className={cn("w-full border-collapse text-left text-xs", c)} {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, className: c, ...props }) => (
            <thead
              className={cn("border-b border-border bg-surface text-foreground", c)}
              {...props}
            >
              {children}
            </thead>
          ),
          tbody: ({ children, className: c, ...props }) => (
            <tbody className={cn("divide-y divide-border/60 bg-surface/30", c)} {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, className: c, ...props }) => (
            <tr className={cn("transition-colors hover:bg-surface/50", c)} {...props}>
              {children}
            </tr>
          ),
          th: ({ children, className: c, ...props }) => (
            <th className={cn("px-3 py-2 font-semibold text-foreground", c)} {...props}>
              {children}
            </th>
          ),
          td: ({ children, className: c, ...props }) => (
            <td className={cn("px-3 py-2 text-foreground/85", c)} {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
