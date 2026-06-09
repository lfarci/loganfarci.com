import React from "react";
import { ChevronDownIcon } from "./icons";
import ClientTooltip from "./ClientTooltip";

interface ChevronToggleButtonProps {
    isExpanded: boolean;
    onToggle: () => void;
}

function ChevronToggleButton({ isExpanded, onToggle }: ChevronToggleButtonProps) {
    const toggleText = isExpanded ? "Show less" : "Show more";

    return (
        <div className="flex justify-center mt-2">
            <ClientTooltip content={toggleText} placement="bottom">
                <button
                    onClick={onToggle}
                    type="button"
                    aria-label={toggleText}
                    className="cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-border rounded-sm"
                >
                    <ChevronDownIcon
                        strokeWidth={1}
                        className={`h-5 w-5 text-text-tertiary transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </ClientTooltip>
        </div>
    );
}

export default ChevronToggleButton;
