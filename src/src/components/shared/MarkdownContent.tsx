import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import { Text, Heading2, Heading3, Heading4, Heading1, UnorderedList, OrderedList, ListItem } from '@/components/shared/typography';
import NewTabLink from './NewTabLink';

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
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  a: ({ href, children }) => <NewTabLink url={href ?? ""}>{children}</NewTabLink>,
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-700">
      {children}
    </em>
  ),
  hr: () => (
    <hr className="border-t border-gray-300 my-8" />
  ),
};

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="max-w-none">
      <ReactMarkdown components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
