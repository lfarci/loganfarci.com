import type { Heading, Nodes, Parent, Root, RootContent } from "mdast";

export interface ArticleHeading {
    id: string;
    level: 2 | 3 | 4;
    text: string;
}

interface ArticleHeadingsOptions {
    tableOfContents?: boolean;
}

export const minimumTableOfContentsHeadings = 3;

function hasChildren(node: Nodes): node is Nodes & Parent {
    return "children" in node && Array.isArray(node.children);
}

function getNodeText(node: Nodes): string {
    if ("value" in node && typeof node.value === "string") {
        return node.value;
    }

    if ("alt" in node && typeof node.alt === "string") {
        return node.alt;
    }

    if (node.type === "break") {
        return " ";
    }

    if (hasChildren(node)) {
        return node.children.map((child) => getNodeText(child as Nodes)).join("");
    }

    return "";
}

function createHeadingSlug(text: string): string {
    const slug = text
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug || "section";
}

function createUniqueHeadingId(text: string, usedIds: Set<string>): string {
    const baseId = createHeadingSlug(text);
    let id = baseId;
    let suffix = 2;

    while (usedIds.has(id)) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
    }

    usedIds.add(id);
    return id;
}

function getRenderedHeadingLevel(depth: Heading["depth"]): ArticleHeading["level"] | null {
    if (depth <= 2) {
        return 2;
    }

    if (depth === 3 || depth === 4) {
        return depth;
    }

    return null;
}

function collectArticleHeadings(tree: Root): ArticleHeading[] {
    const headings: ArticleHeading[] = [];
    const usedIds = new Set<string>();

    function visit(node: Nodes): void {
        if (node.type === "heading") {
            const level = getRenderedHeadingLevel(node.depth);

            if (level) {
                const text = getNodeText(node).replace(/\s+/g, " ").trim();
                const id = createUniqueHeadingId(text, usedIds);
                const existingProperties =
                    node.data && typeof node.data.hProperties === "object" ? node.data.hProperties : {};

                node.data = { ...node.data, hProperties: { ...existingProperties, id, "data-heading-label": text } };
                headings.push({ id, level, text });
            }
        }

        if (hasChildren(node)) {
            node.children.forEach((child) => visit(child as Nodes));
        }
    }

    tree.children.forEach((child) => visit(child));
    return headings;
}

function createArticleLayout(children: RootContent[], headings: ArticleHeading[]): RootContent {
    const tableOfContents = {
        type: "articleTableOfContents",
        children: [],
        data: { hName: "article-table-of-contents", hProperties: { "data-headings": JSON.stringify(headings) } },
    };
    const articleBody = { type: "articleMarkdownBody", children, data: { hName: "article-markdown-body" } };

    return {
        type: "articleMarkdownLayout",
        children: [tableOfContents, articleBody],
        data: { hName: "article-markdown-layout" },
    } as unknown as RootContent;
}

export function remarkArticleHeadings(options: ArticleHeadingsOptions = {}) {
    return (tree: Root): void => {
        const headings = collectArticleHeadings(tree);

        if (options.tableOfContents && headings.length >= minimumTableOfContentsHeadings) {
            tree.children = [createArticleLayout(tree.children, headings)];
        }
    };
}
