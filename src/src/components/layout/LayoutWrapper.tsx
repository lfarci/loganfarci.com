import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";
import { contentWidthStyles } from "@/components/layout/contentWidthStyles";
import { Separator } from "@/components/shared/primitives/Separator";
import { mergeClassNames } from "@/core/mergeClassNames";

interface LayoutWrapperProps {
    readonly children: React.ReactNode;
    readonly githubRepositoryUrl?: string;
    readonly commitHash?: string;
}

const LayoutWrapper: React.FC<Readonly<LayoutWrapperProps>> = ({ children, githubRepositoryUrl, commitHash }) => {
    return (
        <>
            <a
                href="#main-content"
                className="fixed left-4 top-4 z-50 -translate-y-[calc(100%+2rem)] rounded-control bg-surface px-4 py-3 font-medium text-primary shadow-popover transition-transform focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            >
                Skip to content
            </a>
            <NavigationBar title="Logan Farci" />
            <main id="main-content" tabIndex={-1} className={contentWidthStyles.pageContainer}>
                {children}
            </main>
            <Separator className={mergeClassNames(contentWidthStyles.pageContainer, "my-8")} />
            <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash} />
        </>
    );
};

export default LayoutWrapper;
