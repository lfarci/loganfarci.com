import React from "react";
import Preview from "./Preview";
import FadeoutText from "../FadeoutText";
import Markdown from "../Markdown";

function MarkdownPreview({ children }: { children: React.ReactNode }) {
    const markdownContent = String(children);

    const collapsedContent = (
        <FadeoutText>
            <Markdown className="max-w-none">
                {markdownContent}
            </Markdown>
        </FadeoutText>
    );

    const expandedContent = (
        <Markdown className="max-w-none text-base leading-7 text-gray-500 break-words">
            {markdownContent}
        </Markdown>
    );

    return (
        <Preview
            collapsedContent={collapsedContent}
            expandedContent={expandedContent}
        />
    );
}

export default MarkdownPreview;
