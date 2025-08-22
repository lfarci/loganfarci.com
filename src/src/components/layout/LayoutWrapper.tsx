"use client";

import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";

interface LayoutWrapperProps {
    children: React.ReactNode;
    githubRepositoryUrl?: string;
    commitHash?: string;
}

export function LayoutWrapper({ children, githubRepositoryUrl, commitHash }: LayoutWrapperProps) {
    return (
        <>
            <NavigationBar title="Logan Farci" />
            <main className="max-w-(--breakpoint-lg) mx-auto px-6">{children}</main>
            <hr className="border-t border-border my-8" />
            <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash} />
        </>
    );
}
