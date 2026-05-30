import React from "react";

export type SvgIconProps = { 
    className?: string; 
    strokeWidth?: number; 
    size?: number; 
    viewBox?: string;
    children?: React.ReactNode 
};

const SvgIcon: React.FC<SvgIconProps> = ({
    className,
    strokeWidth = 3,
    size = 24,
    viewBox,
    children
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        viewBox={viewBox || `0 0 ${size} ${size}`}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className={className}
        style={{ aspectRatio: 'auto' }}
        aria-hidden="true"
        focusable="false"
    >
        {children}
    </svg>
);

export default SvgIcon;
