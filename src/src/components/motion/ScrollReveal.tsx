import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { revealVariants } from "@/core/animations";

type RevealElement = "article" | "div" | "section";

interface ScrollRevealProps {
    as?: RevealElement;
    children: ReactNode;
    className?: string;
    id?: string;
}

export default function ScrollReveal({
    as = "div",
    children,
    className,
    id,
}: Readonly<ScrollRevealProps>) {
    const [hasHydrated, setHasHydrated] = useState(false);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    if (!hasHydrated || reducedMotion) {
        const Tag = as;
        return (
            <Tag id={id} className={className}>
                {children}
            </Tag>
        );
    }

    const motionProps = {
        id,
        className,
        variants: revealVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.18 },
    } as const;

    if (as === "section") {
        return <motion.section {...motionProps}>{children}</motion.section>;
    }

    if (as === "article") {
        return <motion.article {...motionProps}>{children}</motion.article>;
    }

    return <motion.div {...motionProps}>{children}</motion.div>;
}
