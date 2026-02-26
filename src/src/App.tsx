import { useRoutes } from "react-router";
import { Helmet } from "react-helmet-async";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { routes } from "./routes";

const githubRepositoryUrl = import.meta.env.VITE_GITHUB_REPOSITORY_URL;
const latestCommitHash = import.meta.env.VITE_COMMIT_HASH;

export default function App() {
    const element = useRoutes(routes);

    return (
        <HeroUIProvider>
            <ThemeProvider>
                <Helmet>
                    <title>Logan Farci - Software Engineer</title>
                    <meta name="description" content="Logan Farci, Software Engineer" />
                    <meta name="keywords" content="Software Engineer, Logan Farci, Developer, Brussels, Belgium" />
                </Helmet>
                <LayoutWrapper
                    githubRepositoryUrl={githubRepositoryUrl}
                    commitHash={latestCommitHash}
                >
                    {element}
                </LayoutWrapper>
            </ThemeProvider>
        </HeroUIProvider>
    );
}
