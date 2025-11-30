import React from "react";

interface ColumnContainerProps {
    children: React.ReactNode;
    className?: string;
}

// Simple vertical stack with default spacing, for consistent layouts.
const ColumnContainer: React.FC<ColumnContainerProps> = ({ children, className = "" }) => {
    const baseClassName = "flex flex-col gap-4";
    const mergedClassName = className ? `${baseClassName} ${className}` : baseClassName;

    return <div className={mergedClassName}>{children}</div>;
};

export default ColumnContainer;
