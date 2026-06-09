import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import "./globals.css";

export function render(url: string) {
    const html = ReactDOMServer.renderToString(
        <StaticRouter location={url}>
            <App />
        </StaticRouter>
    );

    // Extract <title> and <meta> tags from the rendered component tree so the
    // prerender script can inject them into <head> of each static HTML file.
    // React 19 hoists these on the client, but SSR renderToString puts them
    // inline — crawlers need them in <head> to read metadata correctly.
    const headTagPattern = /<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>/g;
    const headTags = (html.match(headTagPattern) ?? []).join("\n");

    // Strip extracted tags from the root markup so the prerender script does
    // not insert them a second time inside #root (they are injected into <head>
    // via headTags instead).
    const cleanedHtml = html.replace(headTagPattern, "");

    return { html: cleanedHtml, headTags };
}

export { getStaticRoutes } from "./routes";
