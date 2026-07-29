import type { ReactNode } from "react";
import type { Element } from "hast";
import { ChevronDownIcon } from "@/components/shared/icons";
import { Label } from "@/components/shared/typography";
import type { ArticleHeading } from "@/components/shared/articleHeadings";

interface MarkdownElementProps {
    children?: ReactNode;
    node?: Element;
}

interface TableOfContentsItem extends ArticleHeading {
    children: TableOfContentsItem[];
}

function parseHeadings(node?: Element): ArticleHeading[] {
    const serializedHeadings = node?.properties["data-headings"];

    if (typeof serializedHeadings !== "string") {
        return [];
    }

    return JSON.parse(serializedHeadings) as ArticleHeading[];
}

function createTableOfContentsTree(headings: ArticleHeading[]): TableOfContentsItem[] {
    const roots: TableOfContentsItem[] = [];
    const ancestors: TableOfContentsItem[] = [];

    headings.forEach((heading) => {
        const item = { ...heading, children: [] };

        while (ancestors.length > 0 && ancestors[ancestors.length - 1].level >= item.level) {
            ancestors.pop();
        }

        const parent = ancestors[ancestors.length - 1];

        if (parent) {
            parent.children.push(item);
        } else {
            roots.push(item);
        }

        ancestors.push(item);
    });

    return roots;
}

function TableOfContentsList({ items, nested = false }: { items: TableOfContentsItem[]; nested?: boolean }) {
    return (
        <ol className={nested ? "mt-1 space-y-1 border-l border-border-light pl-3" : "space-y-1"}>
            {items.map((item) => (
                <li key={item.id}>
                    <a
                        href={`#${item.id}`}
                        className="flex min-h-11 items-center rounded-control px-2 py-2 text-sm leading-5 text-text-secondary transition-colors hover:bg-surface-hover hover:text-primary focus-visible:bg-surface-hover focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {item.text}
                    </a>
                    {item.children.length > 0 && <TableOfContentsList items={item.children} nested />}
                </li>
            ))}
        </ol>
    );
}

export function ArticleMarkdownLayout({ children }: Readonly<MarkdownElementProps>) {
    return (
        <div className="grid w-full min-w-0 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start lg:gap-12">
            {children}
        </div>
    );
}

export function ArticleMarkdownBody({ children }: Readonly<MarkdownElementProps>) {
    return <div className="min-w-0 lg:col-start-1 lg:row-start-1">{children}</div>;
}

export default function ArticleTableOfContents({ node }: Readonly<MarkdownElementProps>) {
    const items = createTableOfContentsTree(parseHeadings(node));

    return (
        <details
            open
            className="group mb-8 rounded-card border border-border bg-surface p-3 shadow-card lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:mb-0"
        >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-control px-2 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                <Label as="span">On this page</Label>
                <ChevronDownIcon
                    size={18}
                    className="shrink-0 text-text-muted transition-transform group-open:rotate-180"
                />
            </summary>
            <nav aria-label="Table of contents" className="mt-2 border-t border-border-light pt-2">
                <TableOfContentsList items={items} />
            </nav>
        </details>
    );
}
