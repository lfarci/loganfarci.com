import React, { useState } from "react";
import { ChevronDownIcon } from "./icons";
import { Tooltip } from "@heroui/react";

function TextPreview({ children }: { children: React.ReactNode }) {
  const [showFull, setShowFull] = useState(false);
  const text = typeof children === "string" ? children : "";
  const isTruncated = text.length > 0;

  return (
    <span className="w-full">
      {showFull || !isTruncated ? (
        <span className="text-base/7 text-gray-500 break-words w-full">{children}</span>
      ) : (
        <span className="relative block w-full overflow-hidden">
          <span className="block w-full truncate text-base text-gray-500">{children}</span>
          <span className="pointer-events-none absolute right-0 top-0 h-full w-96 bg-gradient-to-r from-transparent to-white" />
        </span>
      )}
      {isTruncated && (
        <div className="flex justify-center mt-2">
          <Tooltip content={showFull ? "Hide the details" : "Continue reading"} placement="bottom">
            <button
              className="focus:outline-none"
              onClick={() => setShowFull((v) => !v)}
              type="button"
              aria-label={showFull ? "Hide the details" : "Continue reading"}
            >
              <ChevronDownIcon
                strokeWidth={1}
                className={`h-5 w-5 text-gray-500 transition-transform duration-500 ${showFull ? "rotate-180" : ""}`}
              />
            </button>
          </Tooltip>
        </div>
      )}
    </span>
  );
}

export default TextPreview;