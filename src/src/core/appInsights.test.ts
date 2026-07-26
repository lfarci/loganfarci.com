import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@microsoft/applicationinsights-web", () => ({
    ApplicationInsights: vi.fn(function (this: Record<string, unknown>) {
        this.loadAppInsights = vi.fn();
        this.trackPageView = vi.fn();
    }),
}));

describe("initAppInsights", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it("returns null when not in a production build", async () => {
        vi.stubEnv("PROD", false);
        const { initAppInsights } = await import("./appInsights");

        expect(initAppInsights()).toBeNull();
    });

    it("returns null in a server-side rendering context where window is not defined", async () => {
        vi.stubEnv("PROD", true);
        vi.stubEnv("VITE_APPINSIGHTS_CONNECTION_STRING", "InstrumentationKey=test");
        vi.stubGlobal("window", undefined);
        const { initAppInsights } = await import("./appInsights");

        expect(initAppInsights()).toBeNull();
    });

    it("returns null when the connection string is missing", async () => {
        vi.stubEnv("PROD", true);
        vi.stubEnv("VITE_APPINSIGHTS_CONNECTION_STRING", "");
        const { initAppInsights } = await import("./appInsights");

        expect(initAppInsights()).toBeNull();
    });

    it("returns an ApplicationInsights instance and initializes the SDK when all conditions are met", async () => {
        vi.stubEnv("PROD", true);
        vi.stubEnv("VITE_APPINSIGHTS_CONNECTION_STRING", "InstrumentationKey=test");
        const { initAppInsights } = await import("./appInsights");
        const { ApplicationInsights } = await import("@microsoft/applicationinsights-web");

        const result = initAppInsights();

        expect(result).not.toBeNull();
        expect(ApplicationInsights).toHaveBeenCalledOnce();
    });

    it("returns the same instance on repeated calls without reinitializing", async () => {
        vi.stubEnv("PROD", true);
        vi.stubEnv("VITE_APPINSIGHTS_CONNECTION_STRING", "InstrumentationKey=test");
        const { initAppInsights } = await import("./appInsights");
        const { ApplicationInsights } = await import("@microsoft/applicationinsights-web");

        const first = initAppInsights();
        const second = initAppInsights();

        expect(second).toBe(first);
        expect(ApplicationInsights).toHaveBeenCalledOnce();
    });
});
