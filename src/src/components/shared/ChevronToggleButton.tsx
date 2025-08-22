import React from "react";
import { ChevronDownIcon } from "./icons";
import { Tooltip } from "@heroui/react";

interface ChevronToggleButtonProps {
    isExpanded: boolean;
    onToggle: () => void;
}

function ChevronToggleButton({ isExpanded, onToggle }: ChevronToggleButtonProps) {
    const toggleText = isExpanded ? "Show less" : "Show more";

    return (
        <div className="flex justify-center mt-2">
            <Tooltip content={toggleText} placement="bottom">
                <button
                    onClick={onToggle}
                    type="button"
                    aria-label={toggleText}
                    className="focus:outline-hidden focus:ring-2 focus:ring-gray-300 rounded-sm"
                >
                    <ChevronDownIcon
                        strokeWidth={1}
                        className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </Tooltip>
        </div>
    );
}

export default ChevronToggleButton;
