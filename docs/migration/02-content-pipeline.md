# 02 — Content Pipeline

This is the **highest-risk** part of the migration. The current site loads all content (markdown articles and JSON data) via Node.js `fs` APIs in Next.js server components at build time. In Vite, browser code cannot use `fs`. The solution is to use Vite's build-time module resolution: a custom plugin for markdown and native JSON imports for data.

## Current Implementation

### Articles (`src/core/articles.ts`)

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Reads from filesystem at build time (server component)
export const getArticleBySlug = (slug: string): Article | null => {
    const articlePath = path.join(getArticlesDirectoryPath(), `${slug}.md`);
    if (!fs.existsSync(articlePath)) return null;
    const article = fs.readFileSync(articlePath, "utf8");
    const parsed = matter(article);
    // ...
};
```

**Problem**: `fs`, `path`, and `process.cwd()` are Node.js-only APIs. They work in Next.js server components (which run in Node.js at build time) but are unavailable in browser JavaScript.

### Data (`src/core/data.ts`)

```typescript
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const getObjectFromJsonFile = <T>(fileName: string): T => {
    const filePath = join(getDataDirectoryPath(), fileName);
    const fileData = readFileSync(filePath, "utf8");
    return JSON.parse(fileData) as T;
};

export const getCertifications = () => getObjectFromJsonFile<Certification[]>("certifications.json");
```

**Problem**: Same Node.js dependency. Additionally, the directory path is resolved via `ARTICLES_DIRECTORY` / `DATA_DIRECTORY` environment variables at runtime.

### Helper modules to delete

- **`src/core/environment.ts`**: Uses `path.resolve`, `process.cwd()`, `process.env` — entirely Node.js-specific. No longer needed when content is resolved via Vite's module graph.
- **`src/core/files.ts`**: Uses `fs.readdirSync`, `fs.existsSync` — utility for recursive file listing. Replaced by `import.meta.glob`.

## New Implementation

### Strategy

1. **Markdown articles** → Custom Vite plugin processes `.md` files at build time, exporting `{ frontmatter, content }`. Pages use `import.meta.glob` to import all articles.
2. **JSON data** → Direct `import` statements. Vite resolves JSON imports natively at build time — the data is inlined into the JS bundle.
3. **Directory resolution** → Not needed. Vite's `resolve.alias` maps `@content/` to `../content/`, and the module bundler resolves paths at compile time.

### Step 1: Custom Vite Markdown Plugin

Create `src/plugins/vite-plugin-markdown.ts`:

```typescript
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
```

**How it works**:
- Vite calls `transform()` for every imported module
- When a `.md` file is imported, the plugin parses it with `gray-matter` (Node.js, build-time)
- It transforms the markdown file into a JS module exporting the front matter and raw content
- The browser never sees the raw markdown file or `gray-matter` — only the transformed JS

Add to `vite.config.ts`:

```typescript
import markdownPlugin from "./plugins/vite-plugin-markdown";

export default defineConfig({
    plugins: [react(), markdownPlugin()],
});
```

Add the module type declaration for TypeScript (`src/src/types/markdown.d.ts`):

```typescript
declare module "*.md" {
    export const frontmatter: Record<string, unknown>;
    export const content: string;
}
```

### Step 2: Rewrite `articles.ts`

```typescript
import { Article } from "@/types";

// Vite resolves this glob at build time — no fs needed
const articleModules = import.meta.glob<{
    frontmatter: Record<string, unknown>;
    content: string;
}>("@content/articles/*.md", { eager: true });

const parseArticle = (path: string, mod: { frontmatter: Record<string, unknown>; content: string }): Article => {
    const slug = path.split("/").pop()!.replace(".md", "");
    const fm = mod.frontmatter;
    return {
        slug,
        title: (fm.title as string) ?? "",
        description: (fm.description as string) ?? "",
        publishedAt: (fm.publishedAt as string) ?? "",
        featured: (fm.featured as boolean) ?? false,
        tags: (fm.tags as string[]) ?? [],
        author: (fm.author as string) ?? "",
        coauthoredWithAgent: (fm.coauthoredWithAgent as boolean) ?? false,
        content: mod.content,
    };
};

const allArticles: Article[] = Object.entries(articleModules)
    .map(([path, mod]) => parseArticle(path, mod))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const getArticleSlugs = (): string[] => allArticles.map((a) => a.slug);

export const getArticleBySlug = (slug: string): Article | null =>
    allArticles.find((a) => a.slug === slug) ?? null;

export const getAllArticles = (): Article[] => allArticles;

export const getFeaturedArticles = (): Article[] => allArticles.filter((a) => a.featured);
```

**Key differences from the original**:
- No `fs`, `path`, or `process` imports
- `import.meta.glob` is resolved at **compile time** by Vite — the glob pattern is expanded into static imports during the build
- In dev mode, Vite handles HMR for markdown files — editing an article updates the page instantly
- The function signatures (`getArticleSlugs`, `getArticleBySlug`, etc.) remain identical — no changes needed in page components

### Step 3: Rewrite `data.ts`

```typescript
import { Certification, Experience, SkillCategory, Interest, Contact, Profile, Diploma, Icon, Skill } from "@/types";

// Vite resolves JSON imports at build time — inlined into the bundle
import certifications from "@content/data/certifications.json";
import experiences from "@content/data/experiences.json";
import skills from "@content/data/skills.json";
import icons from "@content/data/icons.json";
import interests from "@content/data/interests.json";
import contacts from "@content/data/contacts.json";
import profile from "@content/data/profile.json";
import education from "@content/data/education.json";

export const getCertifications = (): Certification[] => certifications as Certification[];
export const getExperiences = (): Experience[] => experiences as Experience[];
export const getSkillCategories = (): SkillCategory[] => skills as SkillCategory[];
export const getIcons = (): Icon[] => icons as Icon[];
export const getInterests = (): Interest[] => interests as Interest[];
export const getContacts = (): Contact[] => contacts as Contact[];
export const getProfile = (): Profile => profile as Profile;
export const getDiploma = (): Diploma => education as Diploma;

export function attemptToLoadIcons(skills: Skill[]): Array<{ skill: Skill; icon: Icon | null }> {
    const iconList = getIcons();
    const iconMap = new Map(iconList.map((i) => [i.id, i]));
    return skills.map((skill) => ({
        skill,
        icon: skill.iconId ? iconMap.get(skill.iconId) || null : null,
    }));
}
```

**Key differences**:
- Static `import` replaces `fs.readFileSync` + `JSON.parse`
- Vite inlines JSON into the JS bundle (tree-shaken if only partial data is used)
- Function signatures remain identical — page components don't need changes
- `resolveDirectoryFromEnvironment` is gone — Vite's `@content/` alias handles path resolution

### Step 4: Vite Config — Content Alias

In `vite.config.ts`, add the alias so `@content/` resolves to the content directory:

```typescript
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@/": path.resolve(__dirname, "src") + "/",
            "@content/": path.resolve(__dirname, "../content") + "/",
        },
    },
    server: {
        fs: {
            // Allow dev server to read files outside project root
            allow: [".."],
        },
    },
});
```

### Step 5: Delete Removed Files

- `src/src/core/environment.ts` — replaced by Vite aliases
- `src/src/core/files.ts` — replaced by `import.meta.glob`

### Step 6: Verify `tsconfig.json` Paths

Ensure TypeScript understands the new alias:

```json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"],
            "@content/*": ["../content/*"]
        }
    }
}
```

## Migration Checklist

- [ ] Create `src/plugins/vite-plugin-markdown.ts`
- [ ] Create `src/src/types/markdown.d.ts` (module declaration for `*.md`)
- [ ] Rewrite `src/src/core/articles.ts` using `import.meta.glob`
- [ ] Rewrite `src/src/core/data.ts` using static JSON imports
- [ ] Add `@content/` alias to `vite.config.ts`
- [ ] Add `@content/*` path to `tsconfig.json`
- [ ] Add `fs.allow: [".."]` to Vite dev server config
- [ ] Delete `src/src/core/environment.ts`
- [ ] Delete `src/src/core/files.ts`
- [ ] Verify all 4 pages render article/data content correctly in dev
- [ ] Verify data loads correctly in production build
- [ ] Verify HMR works when editing a markdown file in dev

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `gray-matter` imported in browser bundle | Build error or large bundle | Plugin runs in Node.js only (Vite `transform` hook); `gray-matter` stays in `devDependencies` |
| `import.meta.glob` pattern doesn't match | Empty article list | Test glob pattern in Vite dev server; verify with `console.log(Object.keys(articleModules))` |
| JSON import types don't match TypeScript types | Type errors | Cast imported JSON to expected types; add assertions in dev |
| Content directory outside project root blocked | Vite dev server 403 | `server.fs.allow: [".."]` explicitly allows parent directory access |
