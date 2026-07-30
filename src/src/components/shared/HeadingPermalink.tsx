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
            className="heading-permalink group/permalink absolute top-1/2 right-full mr-1 hidden size-11 -translate-y-1/2 items-center justify-center align-middle text-text-muted transition-[color,opacity] duration-150 hover:text-primary focus-visible:text-primary focus-visible:outline-none xl:inline-flex"
        >
            <span className="flex size-6 items-center justify-center rounded-full transition-transform duration-150 group-focus-visible/permalink:scale-110 group-focus-visible/permalink:outline-2 group-focus-visible/permalink:outline-offset-2 group-focus-visible/permalink:outline-ring motion-reduce:transition-none">
                <LinkIcon size={17} />
            </span>
        </a>
    );
}
