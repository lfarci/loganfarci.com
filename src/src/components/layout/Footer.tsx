import React from 'react';
import ExternalLink from '../shared/ExternalLink';

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
                <ExternalLink url="https://nextjs.org/" name="Next.js" />
                <span> and </span>
                <ExternalLink url="https://azure.microsoft.com/en-us/products/app-service/static" name="Azure Static Web App." />
            </div>
            {showCommitHash && <div className="text-sm text-gray-400">
                Commit: <ExternalLink url={commitUrl} name={commitHashPortion ?? ""} />
            </div>}
        </footer>
    );
};

export default Footer;