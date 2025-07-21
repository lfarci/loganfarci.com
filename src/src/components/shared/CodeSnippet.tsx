"use client";

import React from "react";
import { Code, Snippet } from "@heroui/react";

interface CodeSnippetProps {
    children: React.ReactNode;
    className?: string;
}

export default function CodeSnippet({ children, className }: CodeSnippetProps) {
    const isInline = !className;

    return isInline ? (
        <Code size="sm" color="default" radius="sm">
            {children}
        </Code>
    ) : (
        <Snippet 
            size="md" 
            radius="md" 
            hideCopyButton={false} 
            className="w-full my-4 [&>*]:whitespace-pre-wrap"
        >
            {children}
        </Snippet>
    );
}
