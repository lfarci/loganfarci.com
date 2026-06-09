import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function injectHeadTags(page, headTags) {
    if (!headTags) return page;
    return page.replace("</head>", `${headTags}\n</head>`);
}

const siteUrl = process.env.VITE_SITE_URL ?? "https://loganfarci.com";

function createAbsoluteUrl(route) {
    return route === "/" ? siteUrl : `${siteUrl}${route}`;
}

function escapeXml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function normalizeDate(value, fallback) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toISOString().slice(0, 10);
}

function writeTextFile(distDir, fileName, content) {
    fs.writeFileSync(path.join(distDir, fileName), `${content.trimEnd()}\n`);
    console.log(`  Generated: /${fileName}`);
}

function generateSitemap(routes, articles) {
    const buildDate = new Date().toISOString().slice(0, 10);
    const articlesByRoute = new Map(
        articles.map((article) => [`/articles/${article.slug}`, article])
    );

    const urls = routes.map((route) => {
        const article = articlesByRoute.get(route);
        const lastmod = article ? normalizeDate(article.publishedAt, buildDate) : buildDate;

        return [
            "  <url>",
            `    <loc>${escapeXml(createAbsoluteUrl(route))}</loc>`,
            `    <lastmod>${lastmod}</lastmod>`,
            "  </url>",
        ].join("\n");
    });

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        "</urlset>",
    ].join("\n");
}

function generateRobotsTxt() {
    return [
        "User-agent: *",
        "Allow: /",
        "",
        "# The default allow rule includes LLM crawlers such as GPTBot, ClaudeBot, PerplexityBot, and Google-Extended.",
        "",
        `Sitemap: ${createAbsoluteUrl("/sitemap.xml")}`,
    ].join("\n");
}

function generateLlmsTxt(articles) {
    const articleLinks = articles.map(
        (article) => `- [${article.title}](${createAbsoluteUrl(`/articles/${article.slug}`)}): ${article.description}`
    );

    return [
        "# Logan Farci",
        "",
        "> Software Engineer specializing in Azure, C#, .NET, GitHub, DevOps, and cloud-native solutions.",
        "",
        "## Site",
        "",
        `- [Home](${createAbsoluteUrl("/")}): Portfolio overview, featured work, certifications, and contact links.`,
        `- [About](${createAbsoluteUrl("/about")}): Professional background, experience, education, certifications, and skills.`,
        `- [Articles](${createAbsoluteUrl("/articles")}): Technical writing on cloud engineering, developer tooling, AI workflows, and software development.`,
        "",
        "## Articles",
        "",
        ...articleLinks,
        "",
        "## Machine-readable resources",
        "",
        `- [Full LLM context](${createAbsoluteUrl("/llms-full.txt")}): Expanded article content and metadata.`,
        `- [Sitemap](${createAbsoluteUrl("/sitemap.xml")}): XML sitemap for all prerendered routes.`,
        `- [Robots policy](${createAbsoluteUrl("/robots.txt")}): Crawler access policy.`,
    ].join("\n");
}

function generateLlmsFullTxt(articles) {
    const articleSections = articles.map((article) => [
        `## ${article.title}`,
        "",
        `URL: ${createAbsoluteUrl(`/articles/${article.slug}`)}`,
        `Published: ${article.publishedAt}`,
        `Author: ${article.author}`,
        `Tags: ${article.tags.join(", ")}`,
        "",
        "Description:",
        article.description,
        "",
        "Content:",
        article.content.trim(),
    ].join("\n"));

    return [
        "# Logan Farci - Full LLM Context",
        "",
        "This file expands /llms.txt with full article content for AI assistants and search systems.",
        "",
        "## Profile Summary",
        "",
        "Logan Farci is a software engineer focused on Azure, C#, .NET, GitHub, DevOps, cloud-native architecture, and AI-assisted developer workflows.",
        "",
        "## Site Routes",
        "",
        `- ${createAbsoluteUrl("/")}`,
        `- ${createAbsoluteUrl("/about")}`,
        `- ${createAbsoluteUrl("/articles")}`,
        "",
        ...articleSections,
    ].join("\n\n");
}

async function prerender() {
    const distDir = path.resolve(__dirname, "../dist");
    const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

    // Import the SSR bundle
    const { render, getStaticRoutes, getAllArticles } = await import(
        path.join(distDir, "server/entry-server.js")
    );

    const routes = getStaticRoutes();
    const articles = getAllArticles();

    for (const route of routes) {
        const { html, headTags } = render(route);

        // Inject rendered HTML and head metadata into the template
        let page = template.replace(
            '<div id="root"></div>',
            `<div id="root">${html}</div>`
        );
        page = injectHeadTags(page, headTags);

        // Write to dist/{route}/index.html
        const routePath = route === "/" ? "" : route;
        const dir = path.join(distDir, routePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), page);

        console.log(`  Prerendered: ${route}`);
    }

    // Generate 404.html from the /404 route (for Azure SWA fallback)
    const { html: notFoundHtml, headTags: notFoundHeadTags } = render("/404");
    let notFoundPage = template.replace(
        '<div id="root"></div>',
        `<div id="root">${notFoundHtml}</div>`
    );
    notFoundPage = injectHeadTags(notFoundPage, notFoundHeadTags);
    fs.writeFileSync(path.join(distDir, "404.html"), notFoundPage);
    console.log("  Prerendered: /404 → 404.html");

    writeTextFile(distDir, "sitemap.xml", generateSitemap(routes, articles));
    writeTextFile(distDir, "robots.txt", generateRobotsTxt());
    writeTextFile(distDir, "llms.txt", generateLlmsTxt(articles));
    writeTextFile(distDir, "llms-full.txt", generateLlmsFullTxt(articles));
}

try {
    await prerender();
} catch (err) {
    console.error("Prerender failed:", err);
    process.exit(1);
}
