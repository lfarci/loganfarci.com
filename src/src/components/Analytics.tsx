import { useEffect } from "react";
import { initAppInsights } from "@/core/appInsights";

/**
 * Mounts Azure Application Insights on the client. Renders nothing.
 * The effect runs once on mount; init itself is idempotent and gated on
 * production builds and the presence of VITE_APPINSIGHTS_CONNECTION_STRING.
 */
export default function Analytics() {
    useEffect(() => {
        initAppInsights();
    }, []);

    return null;
}
