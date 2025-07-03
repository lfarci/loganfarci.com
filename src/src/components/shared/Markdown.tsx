import React from "react";
import ReactMarkdown from "react-markdown";
import { typographyStyles } from './typography/core/styles';

interface MarkdownProps {
    children: string;
    className?: string;
}

function Markdown({ children, className = "" }: MarkdownProps) {
    const markdownStyles = `
        [&_h1]:${typographyStyles.heading1}
        [&_h2]:${typographyStyles.heading2} 
        [&_h3]:${typographyStyles.heading3}
        [&_h4]:${typographyStyles.heading4}
        [&_p]:${typographyStyles.text}
        [&_strong]:${typographyStyles.strong}
        [&_em]:${typographyStyles.emphasis}
        [&_ul]:${typographyStyles.unorderedList}
        [&_ol]:${typographyStyles.orderedList}
        [&_li]:${typographyStyles.listItem}
    `.replace(/\s+/g, ' ').trim();
    
    return (
        <div className={`${markdownStyles} ${className}`}>
            <ReactMarkdown>{children}</ReactMarkdown>
        </div>
    );
}

export default Markdown;
