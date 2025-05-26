import React, { useState } from "react";
import FadeoutText from "./FadeoutText";
import ChevronToggleButton from "./ChevronToggleButton";

function TextPreview({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => setIsExpanded((prev) => !prev);

    return (
        <div className="w-full">
            {isExpanded ? (
                <p className="text-base/7 text-gray-500 break-words">{children}</p>
            ) : (
                <FadeoutText>{children}</FadeoutText>
            )}

            <ChevronToggleButton isExpanded={isExpanded} onToggle={handleToggle} />
        </div>
    );
}

export default TextPreview;