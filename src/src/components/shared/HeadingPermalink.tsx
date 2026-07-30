import LinkIcon from "@/components/shared/icons/LinkIcon";

interface HeadingPermalinkProps {
    headingId: string;
    headingText: string;
}

export default function HeadingPermalink({ headingId, headingText }: Readonly<HeadingPermalinkProps>) {
    return (
        <a
            href={`#${headingId}`}
            aria-label={`Link to "${headingText}" section`}
            className="heading-permalink absolute top-1/2 right-full mr-1 hidden size-11 -translate-y-1/2 items-center justify-center align-middle text-text-muted transition-[color,opacity] duration-150 hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:[&>svg]:scale-110 xl:inline-flex [&>svg]:transition-transform [&>svg]:duration-150 motion-reduce:[&>svg]:transition-none"
        >
            <LinkIcon size={17} />
        </a>
    );
}
