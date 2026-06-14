import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { useRoutes } from "react-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import Analytics from "@/components/Analytics";
import PageTransition from "@/components/motion/PageTransition";
import JsonLd from "@/components/shared/JsonLd";
import { TooltipProvider } from "@/components/shared/primitives/TooltipPrimitives";
import { getContacts, getExperiences, getProfile } from "@/core/data";
import { createPersonJsonLd, createWebSiteJsonLd } from "@/core/seo";
import { siteOgImage } from "@/core/site";
import { routes } from "./routes";

const githubRepositoryUrl = import.meta.env.VITE_GITHUB_REPOSITORY_URL;
const latestCommitHash = import.meta.env.VITE_COMMIT_HASH;
const deploymentEnvironment = import.meta.env.VITE_DEPLOYMENT_ENVIRONMENT;
const isConfiguredPreviewEnvironment = deploymentEnvironment?.toLowerCase() === "preview";
const previewHostnamePattern = /(^|-)pr-\d+([.-]|$)/i;
const profile = getProfile();
const contacts = getContacts();
const currentExperience = getExperiences()[0];
const siteJsonLd = [
    createWebSiteJsonLd(),
    createPersonJsonLd(profile, contacts, currentExperience),
];

export default function App() {
    const element = useRoutes(routes);
    const [isPreviewEnvironment, setIsPreviewEnvironment] = useState(isConfiguredPreviewEnvironment);

    useEffect(() => {
        if (!isConfiguredPreviewEnvironment) {
            setIsPreviewEnvironment(previewHostnamePattern.test(window.location.hostname));
        }
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <ThemeProvider>
                <TooltipProvider delayDuration={150}>
                    <Analytics />
                    {/* Site-wide OG/Twitter defaults — overridden per page */}
                    <meta property="og:site_name" content="Logan Farci" />
                    <meta property="og:locale" content="en_US" />
                    <meta property="og:image" content={siteOgImage} />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:image" content={siteOgImage} />
                    <JsonLd data={siteJsonLd} />
                    <LayoutWrapper
                        githubRepositoryUrl={githubRepositoryUrl}
                        commitHash={isPreviewEnvironment ? latestCommitHash : undefined}
                    >
                        <PageTransition>{element}</PageTransition>
                    </LayoutWrapper>
                </TooltipProvider>
            </ThemeProvider>
        </MotionConfig>
    );
}
