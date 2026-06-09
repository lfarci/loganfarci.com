import { motion } from "framer-motion";
import { hoverLift, pressTap } from "@/core/animations";

export interface ExternalLinkProps {
    children: React.ReactNode;
    url: string;
    display?: "block" | "inline";
    size?: "base" | "footnote";
    "aria-label"?: string;
    className?: string;
}

const NewTabLink: React.FC<ExternalLinkProps> = ({
    children,
    url,
    display = "inline",
    size = "base",
    "aria-label": ariaLabel,
    className = "",
}) => {
    const displayClasses = display === "block" ? "block" : "inline-flex";
    const sizeClasses = size === "footnote" ? "text-sm md:text-base" : "text-base md:text-lg";

    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            whileHover={hoverLift}
            whileTap={pressTap}
            className={`${sizeClasses} ${displayClasses} font-medium text-font text-primary underline-offset-4 transition-colors duration-200 ease-brand hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${className}`.trim()}
        >
            {children}
        </motion.a>
    );
};

export default NewTabLink;
