import { lazy, Suspense, useState, type ReactNode } from "react";

import { Button } from "@/components/shared/primitives/Button";

const MermaidDiagram = lazy(() => import("./MermaidDiagram"));

export interface CodeSnippetProps {
    children: ReactNode;
    className?: string;
    forceBlock?: boolean;
}

type CopyState = "idle" | "success" | "error";

const codeBlockContainerClassName =
    "mb-6 min-w-0 overflow-hidden rounded-card border border-border-light bg-surface-elevated";

function getTextContent(value: ReactNode): string {
    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map(getTextContent).join("");
    }

    return "";
}

function getLanguage(className?: string): string | null {
    return className?.match(/(?:^|\s)language-([^\s]+)/)?.[1] ?? null;
}

function CopyIcon() {
    return (
        <svg
            aria-hidden="true"
            className="size-4 fill-none stroke-current stroke-2"
            focusable="false"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
        >
            <rect height="13" rx="2" width="13" x="8" y="8" />
            <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </svg>
    );
}

function CodeBlock({ children, className, code }: { children: ReactNode; className?: string; code: string }) {
    const [copyState, setCopyState] = useState<CopyState>("idle");
    const language = getLanguage(className);
    const languageLabel = language ?? "Code";
    const copyButtonLabel = language ? `Copy ${language} code` : "Copy code";
    const copyStatus =
        copyState === "success"
            ? "Code copied to clipboard."
            : copyState === "error"
              ? "Could not copy code to the clipboard."
              : "";

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(code.replace(/\n$/, ""));
            setCopyState("success");
        } catch {
            setCopyState("error");
        }
    }

    return (
        <div className={codeBlockContainerClassName}>
            <div className="flex min-w-0 items-center gap-2 border-b border-border-light px-3 py-2 sm:px-4">
                <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium text-text-secondary">
                    {languageLabel}
                </span>
                <Button
                    aria-label={copyButtonLabel}
                    className="min-h-11 shrink-0 px-3"
                    onClick={() => void copyCode()}
                    size="sm"
                    type="button"
                    variant="ghost"
                >
                    <CopyIcon />
                    {copyState === "success" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy"}
                </Button>
                <span aria-live="polite" className="sr-only" role="status">
                    {copyStatus}
                </span>
            </div>
            <pre
                aria-label={`${languageLabel} code`}
                className="m-0 w-full min-w-0 overflow-x-auto bg-transparent p-4 text-sm leading-relaxed text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring sm:p-5"
                tabIndex={0}
            >
                <code className={className}>{children}</code>
            </pre>
        </div>
    );
}

export default function CodeSnippet({ children, className, forceBlock = false }: CodeSnippetProps) {
    const code = getTextContent(children);
    const isInline = !forceBlock && !className && !code.includes("\n");
    const isMermaid = getLanguage(className) === "mermaid";

    if (isMermaid) {
        return (
            <div className="mb-6 min-w-0">
                <div
                    aria-label="Mermaid diagram viewport"
                    className="flex min-h-48 w-full items-center justify-center overflow-x-auto p-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring sm:p-5"
                    role="region"
                    tabIndex={0}
                >
                    <Suspense
                        fallback={
                            <p
                                aria-label="Loading Mermaid diagram"
                                aria-live="polite"
                                className="text-sm text-text-secondary"
                                role="status"
                            >
                                Loading diagram…
                            </p>
                        }
                    >
                        <MermaidDiagram>{children}</MermaidDiagram>
                    </Suspense>
                </div>
            </div>
        );
    }

    return isInline ? (
        <code className="rounded-sm bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.9em] text-text-primary">
            {children}
        </code>
    ) : (
        <CodeBlock className={className} code={code}>
            {children}
        </CodeBlock>
    );
}
