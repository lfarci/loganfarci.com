import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function injectHelmet(page, helmet) {
    if (!helmet) return page;
    return page.replace(
        "</head>",
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}</head>`
    );
}

async function prerender() {
    const distDir = path.resolve(__dirname, "../dist");
    const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

    // Import the SSR bundle
    const { render, getStaticRoutes } = await import(
        path.join(distDir, "server/entry-server.js")
    );

    const routes = getStaticRoutes();

    for (const route of routes) {
        const { html, helmet } = render(route);

        // Inject rendered HTML and helmet metadata into the template
        let page = template.replace(
            '<div id="root"></div>',
            `<div id="root">${html}</div>`
        );
        page = injectHelmet(page, helmet);

        // Write to dist/{route}/index.html
        const routePath = route === "/" ? "" : route;
        const dir = path.join(distDir, routePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), page);

        console.log(`  Prerendered: ${route}`);
    }

    // Generate 404.html from the /404 route (for Azure SWA fallback)
    const { html: notFoundHtml, helmet: notFoundHelmet } = render("/404");
    let notFoundPage = template.replace(
        '<div id="root"></div>',
        `<div id="root">${notFoundHtml}</div>`
    );
    notFoundPage = injectHelmet(notFoundPage, notFoundHelmet);
    fs.writeFileSync(path.join(distDir, "404.html"), notFoundPage);
    console.log("  Prerendered: /404 → 404.html");
}

try {
    await prerender();
} catch (err) {
    console.error("Prerender failed:", err);
    process.exit(1);
}
