import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";

interface LayoutWrapperProps {
    readonly children: React.ReactNode;
    readonly githubRepositoryUrl?: string;
    readonly commitHash?: string;
}

const LayoutWrapper: React.FC<Readonly<LayoutWrapperProps>> = ({ children, githubRepositoryUrl, commitHash }) => {
    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-background)_0%,var(--color-surface-elevated)_52%,var(--color-background)_100%)]">
            <NavigationBar title="Logan Farci" />
            <main className="max-w-(--breakpoint-lg) mx-auto px-5 pb-6 md:px-6">{children}</main>
            <hr className="mx-auto my-8 max-w-(--breakpoint-lg) border-t border-border" />
            <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash} />
        </div>
    );
};

export default LayoutWrapper;
