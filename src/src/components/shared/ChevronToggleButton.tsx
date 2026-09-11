import React from "react";
import Tooltip from "@/components/shared/Tooltip";
import { ChevronDownIcon } from "@/components/shared/icons";
import { Button } from "@/components/shared/primitives/Button";

interface ChevronToggleButtonProps {
    isExpanded: boolean;
    onToggle: () => void;
}

function ChevronToggleButton({ isExpanded, onToggle }: ChevronToggleButtonProps) {
    const toggleText = isExpanded ? "Show less" : "Show more";

    return (
        <div className="flex justify-center mt-2">
            <Tooltip content={toggleText} placement="bottom">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    type="button"
                    aria-label={toggleText}
                    className="cursor-pointer rounded-sm focus-visible:ring-border"
                >
                    <ChevronDownIcon
                        strokeWidth={1}
                        className={`h-5 w-5 text-text-tertiary transition-transform duration-300 motion-reduce:transition-none ${
                            isExpanded ? "rotate-180" : ""
                        }`}
                    />
                </Button>
            </Tooltip>
        </div>
    );
}

export default ChevronToggleButton;
