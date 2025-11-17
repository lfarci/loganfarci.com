import React from "react";
import NewTabLink from "../shared/NewTabLink";
import { Footnote } from "../shared/typography";

interface FooterProps {
    githubRepositoryUrl?: string;
    commitHash?: string;
    commitHashLength?: number;
}

const Footer: React.FC<FooterProps> = ({ githubRepositoryUrl, commitHash, commitHashLength = 7 }) => {
    const commitUrl = `${githubRepositoryUrl}/commit/${commitHash}`;
    const commitHashPortion = commitHash?.substring(0, commitHashLength);
    const showCommitHash = commitHash && commitHash.length > 0;
    return (
        <footer className="max-w-(--breakpoint-lg) mx-auto px-4 flex flex-wrap justify-between items-center pb-8 gap-y-2">
            <div className="flex flex-wrap items-center gap-1 min-w-0">
                <Footnote>© Logan Farci. Powered by </Footnote>
                <NewTabLink url="https://vitejs.dev/" size="footnote">
                    {" "}
                    Vite{" "}
                </NewTabLink>
                <Footnote> and </Footnote>
                <NewTabLink url="https://azure.microsoft.com/en-us/products/app-service/static" size="footnote">
                    {" "}
                    Azure Static Web App.{" "}
                </NewTabLink>
            </div>
            {showCommitHash && (
                <div className="flex flex-wrap items-center gap-1 min-w-0">
                    <Footnote>Commit:</Footnote>
                    <NewTabLink url={commitUrl} size="footnote">
                        {commitHashPortion ?? ""}
                    </NewTabLink>
                </div>
            )}
        </footer>
    );
};

export default Footer;
