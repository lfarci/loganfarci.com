export type SvgIconProps = { className?: string; strokeWidth?: number; size?: number; children?: React.ReactNode };

const SvgIcon: React.FC<SvgIconProps> = ({ className, strokeWidth = 3, size = 24, children }) => (
    <span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${size} ${size}`}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={className}
            role="button"
        >
            {children}
        </svg>
    </span>
);

export default SvgIcon;
