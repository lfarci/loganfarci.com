import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import App from "./App";
import "./globals.css";

export function render(url: string) {
    const helmetContext: { helmet?: HelmetServerState } = {};

    const html = ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={url}>
                <App />
            </StaticRouter>
        </HelmetProvider>
    );

    return { html, helmet: helmetContext.helmet };
}

export { getStaticRoutes } from "./routes";
