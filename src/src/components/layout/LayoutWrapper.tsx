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
        <>
            <NavigationBar title="Logan Farci" />
            <main className={contentWidthStyles.pageContainer}>{children}</main>
            <hr className={mergeClassNames(contentWidthStyles.pageContainer, "border-t border-border my-8")} />
            <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash} />
        </>
    );
};

export default LayoutWrapper;
