import React from "react";
import MermaidDiagram from "./MermaidDiagram";

export interface CodeSnippetProps {
    children: React.ReactNode;
    className?: string;
    forceBlock?: boolean;
}

function getTextContent(value: React.ReactNode): string {
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
        return <MermaidDiagram>{children}</MermaidDiagram>;
    }

    return isInline ? (
        <code className="rounded-sm bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.9em] text-text-primary">
            {children}
        </code>
    ) : (
        <pre
            className="my-4 w-full overflow-x-auto rounded-lg border border-border bg-surface-elevated p-4 text-sm leading-relaxed text-text-primary"
        >
            <code className={className}>{children}</code>
        </pre>
    );
}
