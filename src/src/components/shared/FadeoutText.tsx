import React from "react";

interface FadeoutTextProps {
    children: React.ReactNode;
}

function FadeoutText({ children }: FadeoutTextProps) {
    return (
        <div className="relative overflow-hidden">
            <span className="truncate text-base/7 text-gray-500">
                {children}
            </span>
            <div className="pointer-events-none absolute right-0 top-0 h-full w-96 bg-gradient-to-r from-transparent to-white" />
        </div>
    );
}

export default FadeoutText;
