import React from "react";

interface GridContainerProps {
    children: React.ReactNode;
    columns?: number;
    className?: string;
}

// Responsive grid with sensible defaults for common column counts.
const gridColumns: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

const GridContainer: React.FC<GridContainerProps> = ({ children, columns = 3, className = "" }) => {
    const baseClassName = "grid gap-4";
    const columnClass = gridColumns[columns] ?? gridColumns[3];
    const mergedClassName = className ? `${baseClassName} ${columnClass} ${className}` : `${baseClassName} ${columnClass}`;

    return <div className={mergedClassName}>{children}</div>;
};

export default GridContainer;
