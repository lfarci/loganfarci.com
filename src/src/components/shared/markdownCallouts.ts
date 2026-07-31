import type { Blockquote, Paragraph, Root, Text } from "mdast";

export const markdownCalloutVariants = ["note", "tip", "important", "warning", "caution"] as const;

export type MarkdownCalloutVariant = (typeof markdownCalloutVariants)[number];

const calloutMarkerPattern = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\n|$)/;

function getCalloutMarker(
    blockquote: Blockquote,
): { paragraph: Paragraph; text: Text; variant: MarkdownCalloutVariant; remainingText: string } | null {
    const firstChild = blockquote.children[0];
    const firstContent = firstChild?.type === "paragraph" ? firstChild.children[0] : undefined;

    if (firstContent?.type !== "text") {
        return null;
    }

    const marker = calloutMarkerPattern.exec(firstContent.value);

    if (!marker) {
        return null;
    }

    return {
        paragraph: firstChild,
        text: firstContent,
        variant: marker[1].toLowerCase() as MarkdownCalloutVariant,
        remainingText: firstContent.value.slice(marker[0].length),
    };
}

function removeMarker(blockquote: Blockquote, paragraph: Paragraph, text: Text, remainingText: string): void {
    if (remainingText) {
        text.value = remainingText;
        return;
    }

    paragraph.children = paragraph.children.filter((child) => child !== text);

    if (paragraph.children.length === 0) {
        blockquote.children = blockquote.children.filter((child) => child !== paragraph);
    }
}

export function remarkMarkdownCallouts() {
    return (tree: Root): void => {
        tree.children.forEach((node) => {
            if (node.type !== "blockquote") {
                return;
            }

            const callout = getCalloutMarker(node);

            if (!callout) {
                return;
            }

            removeMarker(node, callout.paragraph, callout.text, callout.remainingText);

            node.data = {
                ...node.data,
                hName: "markdown-callout",
                hProperties: { ...node.data?.hProperties, "data-callout-variant": callout.variant },
            };
        });
    };
}
