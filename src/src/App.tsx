import { useEffect, useState } from "react";
import { useRoutes } from "react-router";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import Analytics from "@/components/Analytics";
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
        <HeroUIProvider>
            <ThemeProvider>
                <Analytics />
                <title>Logan Farci - Software Engineer</title>
                <meta name="description" content="Logan Farci, Software Engineer" />
                <meta name="keywords" content="Software Engineer, Logan Farci, Developer, Brussels, Belgium" />
                <LayoutWrapper
                    githubRepositoryUrl={githubRepositoryUrl}
                    commitHash={isPreviewEnvironment ? latestCommitHash : undefined}
                >
                    {element}
                </LayoutWrapper>
            </ThemeProvider>
        </HeroUIProvider>
    );
}
