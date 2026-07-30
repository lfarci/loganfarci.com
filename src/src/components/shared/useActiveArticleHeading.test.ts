import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useActiveArticleHeading } from "./useActiveArticleHeading";

const observerInstances: IntersectionObserverMock[] = [];

class IntersectionObserverMock implements IntersectionObserver {
    private readonly callback: IntersectionObserverCallback;

    readonly root = null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[];
    readonly disconnect = vi.fn();
    readonly observe = vi.fn();
    readonly options: IntersectionObserverInit | undefined;
    readonly takeRecords = vi.fn(() => []);
    readonly unobserve = vi.fn();

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        this.options = options;
        observerInstances.push(this);
        this.rootMargin = options?.rootMargin ?? "0px";
        this.thresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold ?? 0];
    }

    trigger(entries: IntersectionObserverEntry[]) {
        this.callback(entries, this);
    }
}

function addHeading(id: string, parent: HTMLElement = document.body): HTMLElement {
    const heading = document.createElement("h2");
    heading.id = id;
    parent.append(heading);
    return heading;
}

function addArticle(...headingIds: string[]) {
    const body = document.createElement("div");
    body.dataset.articleMarkdownBody = "";
    headingIds.forEach((headingId) => addHeading(headingId, body));
    const endMarker = document.createElement("span");
    endMarker.dataset.articleEnd = "";
    body.append(endMarker);
    document.body.append(body);

    return { endMarker };
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

function getObserver(index = 0): IntersectionObserverMock {
    const observer = observerInstances[index];

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
            options: getObserver().options,
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
            getObserver().trigger([createObserverEntry(secondHeading, 180), createObserverEntry(firstHeading, 120)]);
        });

        expect(result.current).toBe("first");
    });

    it("updates the active heading when a new heading intersects", () => {
        addHeading("first");
        const secondHeading = addHeading("second");
        const { result } = renderHook(() => useActiveArticleHeading(["first", "second"]));

        act(() => {
            getObserver().trigger([createObserverEntry(secondHeading, 120)]);
        });

        expect(result.current).toBe("second");
    });

    it("activates the final heading when the article end enters the viewport", () => {
        const { endMarker } = addArticle("first", "last");
        const { result } = renderHook(() => useActiveArticleHeading(["first", "last"]));
        const articleEndObserver = getObserver(1);

        act(() => {
            articleEndObserver.trigger([createObserverEntry(endMarker, 700)]);
        });

        expect({
            activeHeading: result.current,
            observedMarker: articleEndObserver.observe.mock.calls[0]?.[0] as Element | undefined,
            options: articleEndObserver.options,
        }).toEqual({
            activeHeading: "last",
            observedMarker: endMarker,
            options: { rootMargin: "-96px 0px 0px 0px", threshold: 0 },
        });
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
        addArticle("first", "second");
        const removeEventListener = vi.spyOn(window, "removeEventListener");
        const { unmount } = renderHook(() => useActiveArticleHeading(["first", "second"]));

        unmount();

        expect({
            disconnected: observerInstances.map((observer) => observer.disconnect.mock.calls.length),
            removedHashListener: removeEventListener.mock.calls.some(([eventName]) => eventName === "hashchange"),
        }).toEqual({ disconnected: [1, 1], removedHashListener: true });
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
