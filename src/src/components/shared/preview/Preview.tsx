import React, { useState, useRef } from "react";
import ChevronToggleButton from "../ChevronToggleButton";

interface PreviewProps {
    collapsedContent: React.ReactNode;
    expandedContent: React.ReactNode;
}

function Preview({ collapsedContent, expandedContent }: PreviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const expandedContentRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsExpanded((prev) => !prev);

    return (
        <div className="w-full">
            <div
                className="relative transition-all duration-300 ease-in-out overflow-hidden"
                style={{ 
                    height: isExpanded 
                        ? `${expandedContentRef.current?.scrollHeight || 0}px` 
                        : '1.5em' 
                }}
            >
                <div className={`w-full transition-opacity duration-300 overflow-hidden ${
                    !isExpanded ? "opacity-100" : "opacity-0 pointer-events-none absolute top-0"
                }`} style={{ maxHeight: '1.5em' }}>
                    {collapsedContent}
                </div>

                <div
                    ref={expandedContentRef}
                    className={`w-full transition-opacity duration-300 ${
                        isExpanded ? "opacity-100" : "opacity-0 pointer-events-none absolute top-0"
                    }`}
                >
                    {expandedContent}
                </div>
            </div>

            <ChevronToggleButton isExpanded={isExpanded} onToggle={handleToggle} />
        </div>
    );
}

export default Preview;
