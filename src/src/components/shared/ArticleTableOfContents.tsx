import { useId, type ReactNode } from "react";
import type { Element } from "hast";
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
        <ol className={nested ? "ml-3 border-l border-border-light pl-3" : "space-y-0.5"}>
            {items.map((item) => (
                <li key={item.id}>
                    <a
                        href={`#${item.id}`}
                        className="flex min-h-11 items-center rounded-control px-2 py-2 text-sm leading-5 text-text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        <div className="grid w-full min-w-0 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start lg:gap-10 xl:gap-12">
            {children}
        </div>
    );
}

export function ArticleMarkdownBody({ children }: Readonly<MarkdownElementProps>) {
    return <div className="min-w-0 lg:col-start-1 lg:row-start-1">{children}</div>;
}

export default function ArticleTableOfContents({ node }: Readonly<MarkdownElementProps>) {
    const items = createTableOfContentsTree(parseHeadings(node));
    const titleId = useId();

    return (
        <nav
            aria-labelledby={titleId}
            className="mb-8 border-b border-border pb-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-5"
        >
            <Label as="h2" id={titleId} className="mb-1 px-2 text-text-primary">
                In this article
            </Label>
            <TableOfContentsList items={items} />
        </nav>
    );
}
