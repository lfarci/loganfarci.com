import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slideUpTransition, slideUpVariants } from "@/core/animations";

interface ScrollRevealProps {
    readonly children: ReactNode;
    readonly className?: string;
    readonly amount?: number;
    readonly delay?: number;
}

export default function ScrollReveal({
    children,
    className,
    amount = 0.2,
    delay = 0,
}: ScrollRevealProps) {
    const [hasMounted, setHasMounted] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted || prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            variants={slideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            transition={{ ...slideUpTransition, delay }}
        >
            {children}
        </motion.div>
    );
}
