"use client";

import React from "react";
import { Code, Snippet } from "@heroui/react";

interface CodeSnippetProps {
    children: React.ReactNode;
    className?: string;
}

function extractCodeString(children: React.ReactNode): string {
    if (typeof children === "string") return children.trim();
    if (typeof children === "number") return String(children);
    if (Array.isArray(children)) {
        return children.map(extractCodeString).join("").trim();
    }
    if (React.isValidElement(children)) {
        const element = children as React.ReactElement<any>;
        return extractCodeString(element.props.children);
    }
    return "";
}

export default function CodeSnippet({ children, className }: CodeSnippetProps) {
    // react-markdown passes className for code blocks (e.g. "language-js")
    const isInline = !className;
    const codeString = extractCodeString(children);

    return isInline ? (
        <Code size="sm" color="default" radius="sm">
            {codeString}
        </Code>
    ) : (
        <Snippet
            codeString={codeString}
            size="md"
            radius="md"
            hideCopyButton={false}
            classNames={{ pre: "font-mono text-sm" }}
        />
    );
}
