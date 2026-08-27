import { useRef, useState } from "react";

import MarkdownContent from "@/components/shared/MarkdownContent";
import ChevronToggleButton from "../ChevronToggleButton";

interface MarkdownPreviewProps {
    children?: string;
}

function MarkdownPreview({ children = "" }: MarkdownPreviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const expandedContentRef = useRef<HTMLDivElement>(null);
    const expandedContent = <MarkdownContent content={children} />;

    return (
        <div className="w-full">
            <div
                className="relative overflow-hidden transition-[height] duration-300 ease-in-out motion-reduce:transition-none"
                style={{ height: isExpanded ? `${expandedContentRef.current?.scrollHeight || 0}px` : "2em" }}
            >
                <div
                    aria-hidden={isExpanded}
                    className={`w-full overflow-hidden transition-opacity duration-300 motion-reduce:transition-none ${
                        !isExpanded ? "opacity-100" : "opacity-0 pointer-events-none absolute top-0"
                    }`}
                    style={{ maxHeight: "2em" }}
                >
                    <div className="relative overflow-hidden">
                        <span className="truncate text-base/7 text-text-tertiary">{expandedContent}</span>
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-96 bg-gradient-to-r from-transparent to-surface-elevated" />
                    </div>
                </div>

                <div
                    aria-hidden={!isExpanded}
                    ref={expandedContentRef}
                    className={`w-full transition-opacity duration-300 motion-reduce:transition-none ${
                        isExpanded ? "opacity-100" : "opacity-0 pointer-events-none absolute top-0"
                    }`}
                >
                    {expandedContent}
                </div>
            </div>

            <ChevronToggleButton isExpanded={isExpanded} onToggle={() => setIsExpanded((previous) => !previous)} />
        </div>
    );
}

export default MarkdownPreview;
