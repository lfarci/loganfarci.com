import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";
import "./globals.css";
import { extractHeadTags } from "@/core/headTags";

export function render(url: string) {
    const html = ReactDOMServer.renderToString(
        <StaticRouter location={url}>
            <App />
        </StaticRouter>
    );

    const extracted = extractHeadTags(html);

    return { html: extracted.html, headTags: extracted.headTags };
}

export { getStaticRoutes } from "./routes";
export { getAllArticles } from "@/core/articles";
