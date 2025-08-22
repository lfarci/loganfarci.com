"use client";

import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";

interface LayoutWrapperProps {
    readonly children: React.ReactNode;
    readonly githubRepositoryUrl?: string;
    readonly commitHash?: string;
}

const LayoutWrapper: React.FC<Readonly<LayoutWrapperProps>> = ({ children, githubRepositoryUrl, commitHash }) => {
    return (
        <>
            <NavigationBar title="Logan Farci" />
            <main className="max-w-(--breakpoint-lg) mx-auto px-6">{children}</main>
            <hr className="border-t border-border my-8" />
            <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash} />
        </>
    );
};

export default LayoutWrapper;
