import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";
import { contentWidthStyles } from "@/components/layout/contentWidthStyles";
import { Separator } from "@/components/shared/primitives/Separator";

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
            <Separator className="my-8" />
            <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={commitHash} />
        </>
    );
};

export default LayoutWrapper;
