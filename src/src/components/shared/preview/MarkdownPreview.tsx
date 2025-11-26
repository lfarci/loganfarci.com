import React from "react";
import Preview from "./Preview";
import FadeoutText from "../FadeoutText";
import MarkdownContent from "@/components/shared/MarkdownContent";

interface MarkdownPreviewProps {
    content?: string;
}

function MarkdownPreview({ content = "" }: MarkdownPreviewProps) {
    const expandedContent = <MarkdownContent content={content} />;
    const collapsedContent = <FadeoutText>{expandedContent}</FadeoutText>;

    return <Preview collapsedContent={collapsedContent} expandedContent={expandedContent} />;
}

export default MarkdownPreview;
