import React from "react";
import Preview from "./Preview";
import FadeoutText from "../FadeoutText";

function TextPreview({ children }: { children: React.ReactNode }) {
    const collapsedContent = (
        <FadeoutText>{children}</FadeoutText>
    );

    const expandedContent = (
        <div className="text-base/7 text-gray-500 break-words">
            {children}
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

export default TextPreview;