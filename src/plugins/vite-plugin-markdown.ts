import { Plugin } from "vite";
import matter from "gray-matter";

export default function markdownPlugin(): Plugin {
    return {
        name: "vite-plugin-markdown",
        transform(code, id) {
            if (!id.endsWith(".md")) return null;

            const { data: frontmatter, content } = matter(code);

            return {
                code: `
                    export const frontmatter = ${JSON.stringify(frontmatter)};
                    export const content = ${JSON.stringify(content)};
                `,
                map: null,
            };
        },
    };
}
