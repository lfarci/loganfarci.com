import type { Transition, Variants } from "framer-motion";

export type RouteMotionDirection = -1 | 0 | 1;

export const motionDurations = {
    fast: 0.18,
    normal: 0.28,
    page: 0.34,
} as const;

export const naturalEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeInTransition: Transition = {
    duration: motionDurations.normal,
    ease: naturalEase,
};

export const slideUpTransition: Transition = {
    duration: motionDurations.normal,
    ease: naturalEase,
};

export const pageTransition: Transition = {
    duration: motionDurations.page,
    ease: naturalEase,
};

export const reducedMotionTransition: Transition = {
    duration: 0,
};

export const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
};

export const staggerChildrenVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.03,
        },
    },
};

export const pageTransitionVariants: Variants = {
    enter: (direction: RouteMotionDirection = 0) => ({
        opacity: 0,
        x: direction * 16,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (direction: RouteMotionDirection = 0) => ({
        opacity: 0,
        x: direction * -12,
    }),
};

export const reducedPageTransitionVariants: Variants = {
    enter: {
        opacity: 1,
        x: 0,
    },
    center: {
        opacity: 1,
        x: 0,
    },
    exit: {
        opacity: 1,
        x: 0,
    },
};

export const getRouteMotionIndex = (pathname: string): number | null => {
    const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

    if (normalizedPathname === "/") {
        return 0;
    }

    if (normalizedPathname === "/about") {
        return 1;
    }

    if (normalizedPathname === "/articles" || normalizedPathname.startsWith("/articles/")) {
        return 2;
    }

    return null;
};

export const getRouteMotionDirection = (fromPathname: string, toPathname: string): RouteMotionDirection => {
    if (fromPathname === toPathname) {
        return 0;
    }

    const fromIndex = getRouteMotionIndex(fromPathname);
    const toIndex = getRouteMotionIndex(toPathname);

    if (fromIndex === null || toIndex === null || fromIndex === toIndex) {
        return 0;
    }

    return toIndex > fromIndex ? 1 : -1;
};
