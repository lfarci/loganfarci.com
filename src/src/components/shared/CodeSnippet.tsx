"use client";

import React, { useRef, useEffect, useState } from "react";
import MermaidDiagram from "./MermaidDiagram";
import { Code, Snippet } from "@heroui/react";

interface CodeSnippetProps {
    children: React.ReactNode;
    className?: string;
}

export default function CodeSnippet({ children, className }: CodeSnippetProps) {
    const isInline = !className;
    const isMermaid = className?.includes("language-mermaid");
    const contentRef = useRef<HTMLDivElement>(null);
    const [isSmallSnippet, setIsSmallSnippet] = useState(false);

    useEffect(() => {
        if (contentRef.current && !isInline && !isMermaid) {
            // Measure content height to determine button positioning
            // For snippets with height <= 60px (roughly 2-3 lines), use center positioning
            // For larger snippets, use top-right positioning
            const height = contentRef.current.scrollHeight;
            setIsSmallSnippet(height <= 60);
        }
    }, [children, isInline, isMermaid]);

    if (isMermaid) {
        return <MermaidDiagram>{children}</MermaidDiagram>;
    }

    // Determine copy button positioning based on content height
    const copyButtonClasses = isSmallSnippet 
        ? "absolute top-1/2 right-2 -translate-y-1/2 z-10"  // Centered for small snippets
        : "absolute top-2 right-2 z-10";  // Top-right for larger snippets

    return isInline ? (
        <Code size="sm" color="default" radius="sm">
            {children}
        </Code>
    ) : (
        <Snippet
            ref={contentRef}
            size="md"
            radius="md"
            hideSymbol={true}
            hideCopyButton={false}
            className="w-full my-4 relative [&>*]:whitespace-pre-wrap"
            classNames={{
                copyButton: copyButtonClasses
            }}
        >
            {children}
        </Snippet>
    );
}
