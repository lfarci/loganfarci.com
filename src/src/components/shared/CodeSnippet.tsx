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
            // Workaround: HeroUI Snippet doesn't provide props to position the copy button.
            // Using Tailwind arbitrary selectors to target the button element and position it properly.
            className="w-full my-4 relative [&>*]:whitespace-pre-wrap [&>button]:absolute [&>button]:top-2 [&>button]:right-2 [&>button]:z-10"
        >
            {children}
        </Snippet>
    );
}
