import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useActiveArticleHeading } from "./useActiveArticleHeading";

let observerCallback: IntersectionObserverCallback;
let observerOptions: IntersectionObserverInit | undefined;
const observerInstances: IntersectionObserverMock[] = [];

class IntersectionObserverMock implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[];
    readonly disconnect = vi.fn();
    readonly observe = vi.fn();
    readonly takeRecords = vi.fn(() => []);
    readonly unobserve = vi.fn();

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerCallback = callback;
        observerOptions = options;
        observerInstances.push(this);
        this.rootMargin = options?.rootMargin ?? "0px";
        this.thresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold ?? 0];
    }
}

function addHeading(id: string): HTMLElement {
    const heading = document.createElement("h2");
    heading.id = id;
    document.body.append(heading);
    return heading;
}

function createObserverEntry(target: Element, top: number): IntersectionObserverEntry {
    return {
        boundingClientRect: { top } as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        isIntersecting: true,
        rootBounds: null,
        target,
        time: 0,
    };
}

function getObserver(): IntersectionObserverMock {
    const observer = observerInstances.at(-1);

    if (!observer) {
        throw new Error("Expected an IntersectionObserver instance");
    }

    return observer;
}

describe("useActiveArticleHeading", () => {
    beforeEach(() => {
        observerInstances.length = 0;
        vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
        window.history.replaceState({}, "", "/articles/example");
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        document.body.replaceChildren();
    });

    it("starts with the first eligible heading", () => {
        addHeading("first");
        addHeading("second");

        const { result } = renderHook(() => useActiveArticleHeading(["first", "second"]));

        expect(result.current).toBe("first");
    });

    it("observes eligible headings within the upper reading region", () => {
        const firstHeading = addHeading("first");
        const secondHeading = addHeading("second");

        renderHook(() => useActiveArticleHeading(["first", "second"]));

        expect({
            observedHeadings: getObserver().observe.mock.calls.map((call) => call[0] as Element),
            options: observerOptions,
        }).toEqual({
            observedHeadings: [firstHeading, secondHeading],
            options: { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
        });
    });

    it("selects the uppermost intersecting heading", () => {
        const firstHeading = addHeading("first");
        const secondHeading = addHeading("second");
        const { result } = renderHook(() => useActiveArticleHeading(["first", "second"]));

        act(() => {
            observerCallback(
                [createObserverEntry(secondHeading, 180), createObserverEntry(firstHeading, 120)],
                getObserver(),
            );
        });

        expect(result.current).toBe("first");
    });

    it("updates the active heading when a new heading intersects", () => {
        addHeading("first");
        const secondHeading = addHeading("second");
        const { result } = renderHook(() => useActiveArticleHeading(["first", "second"]));

        act(() => {
            observerCallback([createObserverEntry(secondHeading, 120)], getObserver());
        });

        expect(result.current).toBe("second");
    });

    it("uses matching hash changes and ignores unknown hashes", () => {
        addHeading("first");
        addHeading("second");
        const { result } = renderHook(() => useActiveArticleHeading(["first", "second"]));

        act(() => {
            window.history.replaceState({}, "", "#second");
            window.dispatchEvent(new HashChangeEvent("hashchange"));
        });
        expect(result.current).toBe("second");

        act(() => {
            window.history.replaceState({}, "", "#unknown");
            window.dispatchEvent(new HashChangeEvent("hashchange"));
        });
        expect(result.current).toBe("second");
    });

    it("uses a matching initial hash before observing intersections", () => {
        addHeading("first");
        addHeading("second");
        window.history.replaceState({}, "", "#second");

        const { result } = renderHook(() => useActiveArticleHeading(["first", "second"]));

        expect(result.current).toBe("second");
    });

    it("disconnects the observer when the component unmounts", () => {
        addHeading("first");
        const removeEventListener = vi.spyOn(window, "removeEventListener");
        const { unmount } = renderHook(() => useActiveArticleHeading(["first"]));

        unmount();

        expect({
            disconnected: getObserver().disconnect.mock.calls.length,
            removedHashListener: removeEventListener.mock.calls.some(([eventName]) => eventName === "hashchange"),
        }).toEqual({ disconnected: 1, removedHashListener: true });
    });

    it("retains hash navigation when IntersectionObserver is unavailable", () => {
        vi.stubGlobal("IntersectionObserver", undefined);
        addHeading("first");
        addHeading("second");
        window.history.replaceState({}, "", "#second");

        const { result } = renderHook(() => useActiveArticleHeading(["first", "second"]));

        expect(result.current).toBe("second");
    });
});
