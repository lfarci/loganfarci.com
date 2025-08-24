import React from "react";
import Preview from "./Preview";
import FadeoutText from "../FadeoutText";

function TextPreview({ children }: { children: React.ReactNode }) {
    const collapsedContent = <FadeoutText>{children}</FadeoutText>;

    const expandedContent = <div className="text-base/7 text-text-tertiary break-words">{children}</div>;

    return <Preview collapsedContent={collapsedContent} expandedContent={expandedContent} />;
}

export default TextPreview;
