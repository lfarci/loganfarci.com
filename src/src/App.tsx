import { useEffect, useState } from "react";
import { useRoutes } from "react-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import Analytics from "@/components/Analytics";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteOgImage } from "@/core/site";
import { routes } from "./routes";

const githubRepositoryUrl = import.meta.env.VITE_GITHUB_REPOSITORY_URL;
const latestCommitHash = import.meta.env.VITE_COMMIT_HASH;
const deploymentEnvironment = import.meta.env.VITE_DEPLOYMENT_ENVIRONMENT;
const isConfiguredPreviewEnvironment = deploymentEnvironment?.toLowerCase() === "preview";
const previewHostnamePattern = /(^|-)pr-\d+([.-]|$)/i;

export default function App() {
    const element = useRoutes(routes);
    const [isPreviewEnvironment, setIsPreviewEnvironment] = useState(isConfiguredPreviewEnvironment);

    useEffect(() => {
        if (!isConfiguredPreviewEnvironment) {
            setIsPreviewEnvironment(previewHostnamePattern.test(window.location.hostname));
        }
    }, []);

    return (
        <ThemeProvider>
            <TooltipProvider delayDuration={150}>
                <Analytics />
                {/* Site-wide OG/Twitter defaults — overridden per page */}
                <meta property="og:site_name" content="Logan Farci" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:image" content={siteOgImage} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:image" content={siteOgImage} />
                <LayoutWrapper
                    githubRepositoryUrl={githubRepositoryUrl}
                    commitHash={isPreviewEnvironment ? latestCommitHash : undefined}
                >
                    {element}
                </LayoutWrapper>
            </TooltipProvider>
        </ThemeProvider>
    );
}
