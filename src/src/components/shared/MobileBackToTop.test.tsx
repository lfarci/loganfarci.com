import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import MobileBackToTop from "./MobileBackToTop";

const visibilityAnchorId = "article-table-of-contents";
const targetId = "main-content";
const observerInstances: IntersectionObserverMock[] = [];

class IntersectionObserverMock implements IntersectionObserver {
    private readonly callback: IntersectionObserverCallback;

    readonly root = null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[];
    readonly disconnect = vi.fn();
    readonly observe = vi.fn();
    readonly takeRecords = vi.fn(() => []);
    readonly unobserve = vi.fn();

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        observerInstances.push(this);
        this.rootMargin = options?.rootMargin ?? "0px";
        this.thresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold ?? 0];
    }

    trigger(entries: IntersectionObserverEntry[]) {
        this.callback(entries, this);
    }
}

function createObserverEntry(target: Element, isIntersecting: boolean, bottom: number): IntersectionObserverEntry {
    return {
        boundingClientRect: { bottom } as DOMRectReadOnly,
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: {} as DOMRectReadOnly,
        isIntersecting,
        rootBounds: null,
        target,
        time: 0,
    };
}

function renderControl() {
    return render(
        <>
            <main id={targetId} tabIndex={-1} />
            <nav id={visibilityAnchorId} aria-label="In this article" />
            <MobileBackToTop visibilityAnchorId={visibilityAnchorId} />
        </>,
    );
}

function getObserver(): IntersectionObserverMock {
    const observer = observerInstances[0];

    if (!observer) {
        throw new Error("Expected an IntersectionObserver instance");
    }

    return observer;
}

function getHiddenLink(): HTMLAnchorElement {
    const link = document.querySelector<HTMLAnchorElement>(`a[href="#${targetId}"]`);

    if (!link) {
        throw new Error("Expected the back-to-top link");
    }

    return link;
}

function revealControl() {
    const visibilityAnchor = screen.getByRole("navigation", { name: "In this article" });

    act(() => {
        getObserver().trigger([createObserverEntry(visibilityAnchor, false, -1)]);
    });
}

describe("MobileBackToTop", () => {
    beforeEach(() => {
        observerInstances.length = 0;
        vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
        window.history.replaceState({}, "", "/articles/example");
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("renders hidden and inert before the observer reports the article navigation has passed", () => {
        renderControl();

        const link = getHiddenLink();

        expect({
            ariaHidden: link.getAttribute("aria-hidden"),
            inert: link.hasAttribute("inert"),
            tabIndex: link.getAttribute("tabindex"),
            hiddenOpacity: link.classList.contains("opacity-0"),
        }).toEqual({ ariaHidden: "true", inert: true, tabIndex: "-1", hiddenOpacity: true });
    });

    it("renders the same hidden state in prerendered HTML", () => {
        const html = renderToStaticMarkup(<MobileBackToTop visibilityAnchorId={visibilityAnchorId} />);

        expect({
            hasAccessibleName: html.includes('aria-label="Back to top"'),
            hasHiddenState: html.includes('aria-hidden="true"') && html.includes("opacity-0"),
            isInert: html.includes('inert=""'),
        }).toEqual({ hasAccessibleName: true, hasHiddenState: true, isInert: true });
    });

    it("observes the article navigation as its visibility anchor", () => {
        renderControl();

        expect(getObserver().observe).toHaveBeenCalledWith(screen.getByRole("navigation", { name: "In this article" }));
    });

    it("reveals the link after the article navigation scrolls above the viewport", () => {
        renderControl();

        revealControl();

        expect(screen.getByRole("link", { name: "Back to top" }).classList.contains("opacity-100")).toBe(true);
    });

    it("keeps the link hidden when the article navigation is below the viewport", () => {
        renderControl();
        const visibilityAnchor = screen.getByRole("navigation", { name: "In this article" });

        act(() => {
            getObserver().trigger([createObserverEntry(visibilityAnchor, false, 400)]);
        });

        expect(getHiddenLink().getAttribute("aria-hidden")).toBe("true");
    });

    it("hides the link when the article navigation re-enters the viewport", () => {
        renderControl();
        revealControl();
        const visibilityAnchor = screen.getByRole("navigation", { name: "In this article" });

        act(() => {
            getObserver().trigger([createObserverEntry(visibilityAnchor, true, 240)]);
        });

        expect(getHiddenLink().getAttribute("aria-hidden")).toBe("true");
    });

    it("targets and focuses the top of the article without replacing native link behavior", () => {
        renderControl();
        revealControl();
        const target = screen.getByRole("main");
        const link = screen.getByRole("link", { name: "Back to top" });

        fireEvent.click(link);

        expect({ activeElement: document.activeElement, href: link.getAttribute("href") }).toEqual({
            activeElement: target,
            href: `#${targetId}`,
        });
    });

    it("keeps the visual treatment to a single decorative icon", () => {
        renderControl();
        revealControl();
        const link = screen.getByRole("link", { name: "Back to top" });

        expect({
            visibleText: link.textContent,
            decorativeIcon: link.querySelector("svg")?.getAttribute("aria-hidden"),
        }).toEqual({ visibleText: "", decorativeIcon: "true" });
    });

    it("uses mobile-only, safe-area, touch-target, motion, and semantic surface classes", () => {
        renderControl();
        const link = getHiddenLink();

        expect({
            mobileOnly: link.classList.contains("lg:hidden"),
            safeAreaBottom: link.classList.contains("bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]"),
            safeAreaRight: link.classList.contains("right-[calc(1rem+env(safe-area-inset-right,0px))]"),
            touchTarget: link.classList.contains("size-11"),
            simpleShape: link.classList.contains("rounded-full"),
            reducedMotion: link.classList.contains("motion-reduce:transition-none"),
            semanticSurface: link.classList.contains("bg-surface") && link.classList.contains("text-text-primary"),
            visibleFocus: link.classList.contains("focus-visible:ring-2"),
        }).toEqual({
            mobileOnly: true,
            safeAreaBottom: true,
            safeAreaRight: true,
            touchTarget: true,
            simpleShape: true,
            reducedMotion: true,
            semanticSurface: true,
            visibleFocus: true,
        });
    });

    it("stays hidden when IntersectionObserver is unavailable", () => {
        vi.stubGlobal("IntersectionObserver", undefined);

        renderControl();

        expect(getHiddenLink().getAttribute("aria-hidden")).toBe("true");
    });

    it("disconnects the observer when unmounted", () => {
        const { unmount } = renderControl();

        unmount();

        expect(getObserver().disconnect).toHaveBeenCalledOnce();
    });
});
