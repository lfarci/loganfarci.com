import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

class IntersectionObserverMock {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];

    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });

    Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: ResizeObserverMock,
    });

    Object.defineProperty(window, "IntersectionObserver", {
        configurable: true,
        writable: true,
        value: IntersectionObserverMock,
    });
});

afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.className = "";
    vi.clearAllMocks();
});
