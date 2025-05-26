import React, { useState } from "react";
import { ChevronDownIcon } from "./icons";
import { Tooltip } from "@heroui/react";

function TextPreview({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleText = isExpanded ? "Show less" : "Show more";

    const handleToggle = () => setIsExpanded((prev) => !prev);

    return (
        <div className="w-full">
            {isExpanded ? (
                <p className="text-base/7 text-gray-500 break-words">{children}</p>
            ) : (
                <div className="relative overflow-hidden">
                    <p className="truncate text-base md:text-sm text-gray-500">
                        {children}
                    </p>
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-96 bg-gradient-to-r from-transparent to-white" />
                </div>
            )}

            <div className="flex justify-center mt-2">
                <Tooltip content={toggleText} placement="bottom">
                    <button
                        onClick={handleToggle}
                        type="button"
                        aria-label={toggleText}
                        className="focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
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
        </div>
    );
}

export default TextPreview;