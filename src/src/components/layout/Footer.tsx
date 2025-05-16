import React from 'react';
import NewTabLink from '../shared/NewTabLink';

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
        <footer className="max-w-screen-lg mx-auto px-4 flex justify-between items-center pb-8">
            <div className="text-sm text-gray-400">
                <span>© Logan Farci. Powered by </span>
                <NewTabLink url="https://nextjs.org/">Next.js</NewTabLink>
                <span> and </span>
                <NewTabLink url="https://azure.microsoft.com/en-us/products/app-service/static">Azure Static Web App.</NewTabLink>
            </div>
            {showCommitHash && <div className="text-sm text-gray-400">
                Commit: <NewTabLink url={commitUrl}>{commitHashPortion ?? ""}</NewTabLink>
            </div>}
        </footer>
    );
};

export default Footer;