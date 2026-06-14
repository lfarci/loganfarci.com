import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";
import { contentWidthStyles } from "@/components/layout/contentWidthStyles";
import { mergeClassNames } from "@/core/mergeClassNames";

interface LayoutWrapperProps {
    readonly children: React.ReactNode;
    readonly githubRepositoryUrl?: string;
    readonly commitHash?: string;
}

const LayoutWrapper: React.FC<Readonly<LayoutWrapperProps>> = ({ children, githubRepositoryUrl, commitHash }) => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-gradient-to-br from-gradient-start/25 via-gradient-mid/20 to-transparent blur-3xl" />
                <div className="absolute -right-24 top-44 h-80 w-80 rounded-full bg-gradient-to-br from-accent-warm/20 via-gradient-end/15 to-transparent blur-3xl" />
                <div className="absolute inset-0 bg-page-grid bg-[length:56px_56px] opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
            </div>
            <div className="relative z-10">
                <NavigationBar title="Logan Farci" />
                <main className={contentWidthStyles.pageContainer}>{children}</main>
                <hr className={mergeClassNames(contentWidthStyles.pageContainer, "border-t border-border/80 my-8")} />
                <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash} />
            </div>
        </div>
    );
};

export default LayoutWrapper;
