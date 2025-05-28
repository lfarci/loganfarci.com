import React from "react";
import ReactMarkdown from "react-markdown";
import Preview from "./Preview";
import FadeoutText from "../FadeoutText";

function MarkdownPreview({ children }: { children: React.ReactNode }) {
    const markdownContent = String(children);

    const collapsedContent = (
        <FadeoutText>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </FadeoutText>
    );

    const expandedContent = (
        <div className="text-base/7 text-gray-500 break-words">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
    );

    return (
        <Preview
            collapsedContent={collapsedContent}
            expandedContent={expandedContent}
        >
            {children}
        </Preview>
    );
}

export default MarkdownPreview;
