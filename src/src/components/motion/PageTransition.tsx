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

    useEffect(() => {
        if (!location.hash) {
            return;
        }

        const headingId = decodeURIComponent(location.hash.slice(1));
        let frameRequest = 0;
        let remainingAttempts = 20;

        const scrollToAnchor = () => {
            const anchorElement = document.getElementById(headingId);
            if (anchorElement) {
                anchorElement.scrollIntoView();
                return;
            }

            if (remainingAttempts <= 0) {
                return;
            }

            remainingAttempts -= 1;
            frameRequest = window.requestAnimationFrame(scrollToAnchor);
        };

        scrollToAnchor();

        return () => {
            if (frameRequest) {
                window.cancelAnimationFrame(frameRequest);
            }
        };
    }, [location.hash, location.pathname]);

    return (
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
    );
}
