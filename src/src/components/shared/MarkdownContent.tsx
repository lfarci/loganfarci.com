import React from "react";
import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Text,
    Heading2,
    Heading3,
    Heading4,
    UnorderedList,
    OrderedList,
    ListItem,
    Strong,
    Emphasis,
} from "@/components/shared/typography";
import { mergeClassNames } from "@/core/mergeClassNames";
import NewTabLink from "./NewTabLink";
import CodeSnippet, { CodeSnippetProps } from "./CodeSnippet";
import { contentWidthStyles } from "@/components/layout/contentWidthStyles";
import HeadingPermalink from "@/components/shared/HeadingPermalink";
import ArticleTableOfContents, {
    ArticleMarkdownBody,
    ArticleMarkdownLayout,
} from "@/components/shared/ArticleTableOfContents";
import { remarkArticleHeadings } from "@/components/shared/articleHeadings";
import type { Element } from "hast";
import type { PluggableList } from "unified";

interface MarkdownContentProps {
    content: string;
    measure?: boolean;
    className?: string;
    articleNavigation?: boolean;
}

function MarkdownCodeBlock({ children }: { children: React.ReactNode }) {
    const codeSnippet = React.Children.toArray(children).find(
        (child): child is React.ReactElement<CodeSnippetProps> =>
            React.isValidElement<CodeSnippetProps>(child) && child.type === CodeSnippet,
    );

    if (codeSnippet) {
        return (
            <CodeSnippet className={codeSnippet.props.className} forceBlock>
                {codeSnippet.props.children}
            </CodeSnippet>
        );
    }

    return <>{children}</>;
}

function getHeadingLabel(node?: Element): string {
    const label = node?.properties["data-heading-label"];
    return typeof label === "string" ? label : "";
}

function MarkdownHeadingContent({ children, id, node }: { children: React.ReactNode; id?: string; node?: Element }) {
    if (!id) {
        return <>{children}</>;
    }

    return (
        <>
            <span id={`${id}-label`}>{children}</span>
            <HeadingPermalink headingId={id} headingText={getHeadingLabel(node)} />
        </>
    );
}

function createMarkdownComponents(measure: boolean): Components {
    const measureClassName = measure ? contentWidthStyles.readable : undefined;

    return {
        h1: ({ children, id, node }) => (
            <Heading2
                id={id}
                aria-labelledby={id ? `${id}-label` : undefined}
                className="mb-4 mt-10 scroll-mt-24 first:mt-0"
            >
                <MarkdownHeadingContent id={id} node={node}>
                    {children}
                </MarkdownHeadingContent>
            </Heading2>
        ),
        h2: ({ children, id, node }) => (
            <Heading2
                id={id}
                aria-labelledby={id ? `${id}-label` : undefined}
                className="mb-4 mt-10 scroll-mt-24 first:mt-0"
            >
                <MarkdownHeadingContent id={id} node={node}>
                    {children}
                </MarkdownHeadingContent>
            </Heading2>
        ),
        h3: ({ children, id, node }) => (
            <Heading3
                id={id}
                aria-labelledby={id ? `${id}-label` : undefined}
                className="mb-3 mt-8 scroll-mt-24 first:mt-0"
            >
                <MarkdownHeadingContent id={id} node={node}>
                    {children}
                </MarkdownHeadingContent>
            </Heading3>
        ),
        h4: ({ children, id, node }) => (
            <Heading4
                id={id}
                aria-labelledby={id ? `${id}-label` : undefined}
                className="mb-3 mt-6 scroll-mt-24 first:mt-0"
            >
                <MarkdownHeadingContent id={id} node={node}>
                    {children}
                </MarkdownHeadingContent>
            </Heading4>
        ),
        p: ({ children }) => <Text className={mergeClassNames("mb-5", measureClassName)}>{children}</Text>,
        ul: ({ children }) => <UnorderedList className={measureClassName}>{children}</UnorderedList>,
        ol: ({ children }) => <OrderedList className={measureClassName}>{children}</OrderedList>,
        li: ({ children }) => <ListItem>{children}</ListItem>,
        blockquote: ({ children }) => (
            <blockquote
                className={mergeClassNames(
                    "mb-6 border-l-4 border-primary bg-primary-light py-3 pl-5 italic text-text-secondary",
                    measureClassName,
                )}
            >
                {children}
            </blockquote>
        ),
        code: ({ children, className }) => <CodeSnippet className={className}>{children}</CodeSnippet>,
        pre: ({ children }) => <MarkdownCodeBlock>{children}</MarkdownCodeBlock>,
        a: ({ href, children }) => <NewTabLink url={href ?? ""}>{children}</NewTabLink>,
        strong: ({ children }) => <Strong>{children}</Strong>,
        em: ({ children }) => <Emphasis>{children}</Emphasis>,
        hr: () => <hr className={mergeClassNames("my-10 border-t border-border", measureClassName)} />,
        table: ({ children }) => (
            <table className="my-8 w-full overflow-hidden rounded-lg border border-border bg-surface text-sm">
                {children}
            </table>
        ),
        thead: ({ children }) => <thead className="bg-surface-elevated">{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-b border-border-light last:border-b-0">{children}</tr>,
        th: ({ children }) => (
            <th className="border-b border-border bg-surface-elevated px-4 py-3 text-left font-semibold text-text-primary">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="border-b border-border-light bg-surface px-4 py-3 text-text-secondary">{children}</td>
        ),
        ...({
            "article-markdown-layout": ArticleMarkdownLayout,
            "article-markdown-body": ArticleMarkdownBody,
            "article-table-of-contents": ArticleTableOfContents,
        } as unknown as Components),
    };
}

export default function MarkdownContent({
    content,
    measure = false,
    className,
    articleNavigation = false,
}: MarkdownContentProps) {
    const remarkPlugins: PluggableList = articleNavigation
        ? [remarkGfm, [remarkArticleHeadings, { tableOfContents: true }]]
        : [remarkGfm];

    return (
        <div className={mergeClassNames("w-full", className)}>
            <ReactMarkdown components={createMarkdownComponents(measure)} remarkPlugins={remarkPlugins}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
