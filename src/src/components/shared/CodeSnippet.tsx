"use client";

import React from "react";
import MermaidDiagram from "./MermaidDiagram";
import { Code, Snippet } from "@heroui/react";

interface CodeSnippetProps {
    children: React.ReactNode;
    className?: string;
}

export default function CodeSnippet({ children, className }: CodeSnippetProps) {
    const isInline = !className;
    const isMermaid = className?.includes("language-mermaid");

    if (isMermaid) {
        return <MermaidDiagram>{children}</MermaidDiagram>;
    }

    return isInline ? (
        <Code size="sm" color="default" radius="sm">
            {children}
        </Code>
    ) : (
        <Snippet
            size="md"
            radius="md"
            hideSymbol={true}
            hideCopyButton={false}
            // Position copy button vertically centered on the right using classNames.copyButton
            className="w-full my-4 relative [&>*]:whitespace-pre-wrap"
            classNames={{
                copyButton: "absolute top-1/2 right-2 -translate-y-1/2 z-10"
            }}
        >
            {children}
        </Snippet>
    );
}
