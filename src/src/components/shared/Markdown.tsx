import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
    children: string;
    className?: string;
}

function Markdown({ children, className = "" }: MarkdownProps) {
    const markdownStyles = "[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1";
    
    return (
        <div className={`${markdownStyles} ${className}`}>
            <ReactMarkdown>{children}</ReactMarkdown>
        </div>
    );
}

export default Markdown;
