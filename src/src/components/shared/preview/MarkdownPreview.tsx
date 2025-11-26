import React from "react";
import Preview from "./Preview";
import FadeoutText from "../FadeoutText";
import MarkdownContent from "@/components/shared/MarkdownContent";

interface MarkdownPreviewProps {
    children?: string;
}

function MarkdownPreview({ children = "" }: MarkdownPreviewProps) {
    const expandedContent = <MarkdownContent content={children} />;
    const collapsedContent = <FadeoutText>{expandedContent}</FadeoutText>;

    return <Preview collapsedContent={collapsedContent} expandedContent={expandedContent} />;
}

export default MarkdownPreview;
