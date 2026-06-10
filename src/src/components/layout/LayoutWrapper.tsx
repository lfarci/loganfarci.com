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
            <main className="mx-auto w-full max-w-(--breakpoint-lg) px-5 sm:px-6 lg:px-8">{children}</main>
            <hr className="border-t border-border my-8" />
            <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash} />
        </>
    );
};

export default LayoutWrapper;
