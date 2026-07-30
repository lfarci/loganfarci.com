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
            className="heading-permalink absolute top-1/2 right-full mr-1 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-control align-middle text-text-muted transition-[background-color,color,opacity] duration-150 hover:bg-surface-hover hover:text-primary focus-visible:bg-surface-hover focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <LinkIcon size={17} />
        </a>
    );
}
