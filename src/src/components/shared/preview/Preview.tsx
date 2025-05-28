import React, { useState, useRef, useEffect } from "react";
import ChevronToggleButton from "../ChevronToggleButton";

interface PreviewProps {
    children: React.ReactNode;
    collapsedContent: React.ReactNode;
    expandedContent: React.ReactNode;
}

function Preview({ children, collapsedContent, expandedContent }: PreviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [heights, setHeights] = useState({ collapsed: 0, expanded: 0 });

    const collapsedContentRef = useRef<HTMLDivElement>(null);
    const expandedContentRef = useRef<HTMLDivElement>(null);

    // Measure content heights when children change
    useEffect(() => {
        const collapsedHeight = collapsedContentRef.current?.scrollHeight || 0;
        const expandedHeight = expandedContentRef.current?.scrollHeight || 0;

        setHeights({ collapsed: collapsedHeight, expanded: expandedHeight });
    }, [children]);

    const handleToggle = () => setIsExpanded((prev) => !prev);

    const containerHeight = isExpanded ? heights.expanded : heights.collapsed;
    const shouldUseFixedHeight = containerHeight > 0;

    const getContentClasses = (visible: boolean) =>
        `w-full transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0 pointer-events-none absolute top-0"
        }`;

    return (
        <div className="w-full">
            <div
                className="relative transition-all duration-300 ease-in-out overflow-hidden"
                style={{ height: shouldUseFixedHeight ? `${containerHeight}px` : "auto" }}
            >
                <div ref={collapsedContentRef} className={getContentClasses(!isExpanded)}>
                    {collapsedContent}
                </div>

                <div
                    ref={expandedContentRef}
                    className={getContentClasses(isExpanded)}
                >
                    {expandedContent}
                </div>
            </div>

            <ChevronToggleButton isExpanded={isExpanded} onToggle={handleToggle} />
        </div>
    );
}

export default Preview;
