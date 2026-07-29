import { lazy, Suspense, type ReactNode } from "react";

const MermaidDiagram = lazy(() => import("./MermaidDiagram"));

export interface CodeSnippetProps {
    children: ReactNode;
    className?: string;
    forceBlock?: boolean;
}

function getTextContent(value: ReactNode): string {
    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map(getTextContent).join("");
    }

    return "";
}

export default function CodeSnippet({ children, className, forceBlock = false }: CodeSnippetProps) {
    const code = getTextContent(children);
    const isInline = !forceBlock && !className && !code.includes("\n");
    const isMermaid = className?.includes("language-mermaid");

    if (isMermaid) {
        return (
            <div className="my-4 flex min-h-48 w-full items-center justify-center overflow-x-auto rounded-lg border border-border bg-surface-elevated p-4">
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
        );
    }

    return isInline ? (
        <code className="rounded-sm bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.9em] text-text-primary">
            {children}
        </code>
    ) : (
        <pre className="my-4 w-full overflow-x-auto rounded-lg border border-border bg-surface-elevated p-4 text-sm leading-relaxed text-text-primary">
            <code className={className}>{children}</code>
        </pre>
    );
}
