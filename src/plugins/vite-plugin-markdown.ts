import { Plugin, TransformResult } from "vite";
import matter from "gray-matter";

export function transformMarkdown(code: string, id: string): TransformResult {
    if (!id.endsWith(".md")) return null;

    const { data: frontmatter, content } = matter(code);

    return {
        code: [
            `export const frontmatter = ${JSON.stringify(frontmatter)};`,
            `export const content = ${JSON.stringify(content)};`,
        ].join("\n"),
        map: null,
    };
}

export default function markdownPlugin(): Plugin {
    return { name: "vite-plugin-markdown", transform: transformMarkdown };
}
