export interface ExternalLinkProps {
    children: React.ReactNode;
    url: string;
}

const NewTabLink: React.FC<ExternalLinkProps> = ({ children, url }) => <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-500">{ children }</a>;

export default NewTabLink;