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

interface MarkdownContentProps {
    content: string;
    measure?: boolean;
    className?: string;
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

function createMarkdownComponents(measure: boolean): Components {
    const measureClassName = measure ? contentWidthStyles.readable : undefined;

    return {
        h1: ({ children }) => <Heading2 className="mb-4 mt-10 first:mt-0">{children}</Heading2>,
        h2: ({ children }) => <Heading2 className="mb-4 mt-10 first:mt-0">{children}</Heading2>,
        h3: ({ children }) => <Heading3 className="mb-3 mt-8 first:mt-0">{children}</Heading3>,
        h4: ({ children }) => <Heading4 className="mb-3 mt-6 first:mt-0">{children}</Heading4>,
        p: ({ children }) => <Text className={mergeClassNames("mb-5", measureClassName)}>{children}</Text>,
        ul: ({ children }) => <UnorderedList className={measureClassName}>{children}</UnorderedList>,
        ol: ({ children }) => <OrderedList className={measureClassName}>{children}</OrderedList>,
        li: ({ children }) => <ListItem>{children}</ListItem>,
        blockquote: ({ children }) => (
            <blockquote
                className={mergeClassNames(
                    "mb-6 rounded-r-xl border-l-4 border-accent bg-primary-light/80 py-3 pl-5 italic text-text-secondary shadow-soft",
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
            <table
                className={mergeClassNames(
                    "my-8 w-full overflow-hidden rounded-xl border border-border-light bg-surface/90 text-sm shadow-soft",
                    measureClassName,
                )}
            >
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
            <td className="border-b border-border-light bg-surface px-4 py-3 text-text-secondary">
                {children}
            </td>
        ),
    };
}

export default function MarkdownContent({ content, measure = false, className }: MarkdownContentProps) {
    return (
        <div className={mergeClassNames("w-full", className)}>
            <ReactMarkdown components={createMarkdownComponents(measure)} remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
