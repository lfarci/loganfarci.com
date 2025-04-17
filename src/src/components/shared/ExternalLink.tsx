export interface ExternalLinkProps {
    name: string;
    url: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ name, url }) => <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{ name }</a>;

export default ExternalLink;