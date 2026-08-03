import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import MobileBackToContents from "./MobileBackToContents";

const targetId = "article-table-of-contents";
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
            <nav id={targetId} aria-label="In this article" tabIndex={-1} />
            <MobileBackToContents targetId={targetId} />
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
        throw new Error("Expected the back-to-contents link");
    }

    return link;
}

function revealControl() {
    const target = screen.getByRole("navigation", { name: "In this article" });

    act(() => {
        getObserver().trigger([createObserverEntry(target, false, -1)]);
    });
}

describe("MobileBackToContents", () => {
    beforeEach(() => {
        observerInstances.length = 0;
        vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
        window.history.replaceState({}, "", "/articles/example");
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("renders hidden and inert before the observer reports the table of contents has passed", () => {
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
        const html = renderToStaticMarkup(<MobileBackToContents targetId={targetId} />);

        expect({
            hasAccessibleLabel: html.includes("Contents"),
            hasHiddenState: html.includes('aria-hidden="true"') && html.includes("opacity-0"),
            isInert: html.includes('inert=""'),
        }).toEqual({ hasAccessibleLabel: true, hasHiddenState: true, isInert: true });
    });

    it("observes the table-of-contents fragment target", () => {
        renderControl();

        expect(getObserver().observe).toHaveBeenCalledWith(screen.getByRole("navigation", { name: "In this article" }));
    });

    it("reveals the link after the table of contents scrolls above the viewport", () => {
        renderControl();

        revealControl();

        expect(screen.getByRole("link", { name: "Contents" }).classList.contains("opacity-100")).toBe(true);
    });

    it("keeps the link hidden when the table of contents is below the viewport", () => {
        renderControl();
        const target = screen.getByRole("navigation", { name: "In this article" });

        act(() => {
            getObserver().trigger([createObserverEntry(target, false, 400)]);
        });

        expect(getHiddenLink().getAttribute("aria-hidden")).toBe("true");
    });

    it("hides the link when the table of contents re-enters the viewport", () => {
        renderControl();
        revealControl();
        const target = screen.getByRole("navigation", { name: "In this article" });

        act(() => {
            getObserver().trigger([createObserverEntry(target, true, 240)]);
        });

        expect(getHiddenLink().getAttribute("aria-hidden")).toBe("true");
    });

    it("targets and focuses the table-of-contents navigation without replacing native link behavior", () => {
        renderControl();
        revealControl();
        const target = screen.getByRole("navigation", { name: "In this article" });
        const link = screen.getByRole("link", { name: "Contents" });

        fireEvent.click(link);

        expect({ activeElement: document.activeElement, href: link.getAttribute("href") }).toEqual({
            activeElement: target,
            href: `#${targetId}`,
        });
    });

    it("uses mobile-only, safe-area, touch-target, motion, and semantic surface classes", () => {
        renderControl();
        const link = getHiddenLink();

        expect({
            mobileOnly: link.classList.contains("lg:hidden"),
            safeAreaBottom: link.classList.contains("bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]"),
            safeAreaRight: link.classList.contains("right-[calc(1rem+env(safe-area-inset-right,0px))]"),
            touchTarget: link.classList.contains("h-11") && link.classList.contains("min-w-11"),
            reducedMotion: link.classList.contains("motion-reduce:transition-none"),
            semanticColors: link.classList.contains("bg-brand") && link.classList.contains("text-brand-foreground"),
            visibleFocus: link.classList.contains("focus-visible:ring-2"),
        }).toEqual({
            mobileOnly: true,
            safeAreaBottom: true,
            safeAreaRight: true,
            touchTarget: true,
            reducedMotion: true,
            semanticColors: true,
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
