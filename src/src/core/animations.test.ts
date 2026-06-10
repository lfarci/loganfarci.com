import { describe, expect, it } from "vitest";
import {
    getRouteMotionDirection,
    getRouteMotionIndex,
    motionDurations,
    naturalEase,
    pageTransitionVariants,
    slideUpVariants,
} from "./animations";

describe("motion primitives", () => {
    it("keeps shared durations within the expected UI motion range", () => {
        expect(motionDurations.fast).toBeGreaterThanOrEqual(0.15);
        expect(motionDurations.normal).toBeLessThanOrEqual(0.3);
        expect(motionDurations.page).toBeLessThanOrEqual(0.4);
        expect(naturalEase).not.toEqual([0, 0, 1, 1]);
    });

    it("uses transform and opacity for slide-up reveals", () => {
        expect(slideUpVariants.hidden).toEqual({ opacity: 0, y: 28 });
        expect(slideUpVariants.visible).toEqual({ opacity: 1, y: 0 });
    });

    it("groups article detail pages with the article list for route orientation", () => {
        expect(getRouteMotionIndex("/")).toBe(0);
        expect(getRouteMotionIndex("/about")).toBe(1);
        expect(getRouteMotionIndex("/articles")).toBe(2);
        expect(getRouteMotionIndex("/articles/example")).toBe(2);
        expect(getRouteMotionIndex("/missing")).toBeNull();
    });

    it("derives route transition direction from ordered route groups", () => {
        expect(getRouteMotionDirection("/", "/about")).toBe(1);
        expect(getRouteMotionDirection("/about", "/")).toBe(-1);
        expect(getRouteMotionDirection("/articles", "/articles/example")).toBe(0);
        expect(getRouteMotionDirection("/missing", "/about")).toBe(0);
    });

    it("keeps page transitions subtle and directional", () => {
        const enter = pageTransitionVariants.enter;
        const exit = pageTransitionVariants.exit;

        expect(typeof enter).toBe("function");
        expect(typeof exit).toBe("function");

        if (typeof enter === "function" && typeof exit === "function") {
            expect(enter(1, 0, 0)).toEqual({ opacity: 0, x: 16 });
            expect(exit(1, 0, 0)).toEqual({ opacity: 0, x: -12 });
        }
    });
});
