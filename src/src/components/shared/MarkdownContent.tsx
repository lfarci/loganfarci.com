import React from "react";
import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Text,
    Heading2,
    Heading3,
    Heading4,
    Heading1,
    UnorderedList,
    OrderedList,
    ListItem,
    Strong,
    Emphasis,
} from "@/components/shared/typography";
import NewTabLink from "./NewTabLink";
import CodeSnippet from "./CodeSnippet";

interface MarkdownContentProps {
    content: string;
}

const markdownComponents: Components = {
    h1: ({ children }) => <Heading1 className="mb-6 mt-8">{children}</Heading1>,
    h2: ({ children }) => <Heading2 className="mb-4 mt-6">{children}</Heading2>,
    h3: ({ children }) => <Heading3 className="mb-3 mt-5">{children}</Heading3>,
    h4: ({ children }) => <Heading4 className="mb-2 mt-4">{children}</Heading4>,
    p: ({ children }) => <Text className="mb-4">{children}</Text>,
    ul: ({ children }) => <UnorderedList>{children}</UnorderedList>,
    ol: ({ children }) => <OrderedList>{children}</OrderedList>,
    li: ({ children }) => <ListItem>{children}</ListItem>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 italic text-gray-700">
            {children}
        </blockquote>
    ),
    code: ({ children, className }) => <CodeSnippet className={className}>{children}</CodeSnippet>,
    a: ({ href, children }) => <NewTabLink url={href ?? ""}>{children}</NewTabLink>,
    strong: ({ children }) => <Strong>{children}</Strong>,
    em: ({ children }) => <Emphasis>{children}</Emphasis>,
    hr: () => <hr className="border-t border-gray-300 my-8" />,
    table: ({ children }) => (
        <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden my-6 text-sm bg-white dark:bg-gray-900">
            {children}
        </table>
    ),
    thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">{children}</tr>,
    th: ({ children }) => (
        <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="px-4 py-2 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            {children}
        </td>
    ),
};

export default function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <div className="max-w-none">
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
