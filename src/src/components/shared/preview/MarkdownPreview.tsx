import React from "react";
import Preview from "./Preview";
import FadeoutText from "../FadeoutText";
import MarkdownContent from "@/components/shared/MarkdownContent";

function MarkdownPreview({ children }: { children: React.ReactNode }) {
    const markdownContent = String(children);
    const expandedContent = <MarkdownContent content={markdownContent} />;
    const collapsedContent = <FadeoutText>{expandedContent}</FadeoutText>;

    return <Preview collapsedContent={collapsedContent} expandedContent={expandedContent} />;
}

export default MarkdownPreview;
