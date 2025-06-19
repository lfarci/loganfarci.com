import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="heading-font text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="heading-font text-3xl font-semibold text-gray-800 mb-4 mt-6">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="heading-font text-2xl font-semibold text-gray-800 mb-3 mt-5">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="heading-font text-xl font-semibold text-gray-700 mb-2 mt-4">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),
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
  a: ({ href, children }) => (
    <a 
      href={href} 
      className="text-blue-600 hover:text-blue-800 underline"
      target={href?.startsWith('http') ? '_blank' : '_self'}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
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
