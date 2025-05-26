import React, { useState, useRef, useEffect } from "react";
import FadeoutText from "./FadeoutText";
import ChevronToggleButton from "./ChevronToggleButton";

function TextPreview({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [heights, setHeights] = useState({ collapsed: 0, expanded: 0 });

    const collapsedContentRef = useRef<HTMLDivElement>(null);
    const expandedContentRef = useRef<HTMLParagraphElement>(null);

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
                    <FadeoutText>{children}</FadeoutText>
                </div>

                <p
                    ref={expandedContentRef}
                    className={`text-base/7 text-gray-500 break-words ${getContentClasses(isExpanded)}`}
                >
                    {children}
                </p>
            </div>

            <ChevronToggleButton isExpanded={isExpanded} onToggle={handleToggle} />
        </div>
    );
}

export default TextPreview;