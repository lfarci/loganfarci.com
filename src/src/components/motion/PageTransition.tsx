import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router";
import {
    getRouteMotionDirection,
    pageTransition,
    pageTransitionVariants,
    reducedMotionTransition,
    reducedPageTransitionVariants,
} from "@/core/animations";

interface PageTransitionProps {
    readonly children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();
    const prefersReducedMotion = useReducedMotion();
    const previousPathnameRef = useRef(location.pathname);
    const direction = getRouteMotionDirection(previousPathnameRef.current, location.pathname);
    const locationKey = `${location.pathname}${location.search}`;

    useEffect(() => {
        previousPathnameRef.current = location.pathname;
    }, [location.pathname]);

    return (
        <div className="overflow-x-clip">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                    key={locationKey}
                    custom={direction}
                    variants={prefersReducedMotion ? reducedPageTransitionVariants : pageTransitionVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={prefersReducedMotion ? reducedMotionTransition : pageTransition}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
