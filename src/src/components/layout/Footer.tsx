import React from "react";
import NewTabLink from "../shared/NewTabLink";
import { Footnote } from "../shared/typography";
import { contentWidthStyles } from "@/components/layout/contentWidthStyles";
import { mergeClassNames } from "@/core/mergeClassNames";

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
        <footer className={mergeClassNames(contentWidthStyles.pageContainer, "flex flex-wrap justify-between items-center pb-8 gap-y-2")}>
            <div className="flex flex-wrap items-center gap-1 min-w-0">
                <Footnote>© Logan Farci.</Footnote>
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
