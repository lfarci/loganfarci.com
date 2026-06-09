import { ApplicationInsights } from "@microsoft/applicationinsights-web";

let initialized = false;
let appInsights: ApplicationInsights | null = null;

/**
 * Initialize the Azure Application Insights browser SDK in cookieless mode.
 *
 * No-ops on the server, in dev builds, when the connection string is missing,
 * or when called more than once. Safe to invoke from a React effect on every mount.
 */
export function initAppInsights(): ApplicationInsights | null {
    if (initialized) {
        return appInsights;
    }

    if (typeof window === "undefined") {
        return null;
    }

    if (!import.meta.env.PROD) {
        return null;
    }

    const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;
    if (!connectionString) {
        return null;
    }

    appInsights = new ApplicationInsights({
        config: {
            connectionString,
            disableCookiesUsage: true,
            enableAutoRouteTracking: true,
            disableExceptionTracking: false,
        },
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView();
    initialized = true;
    return appInsights;
}
