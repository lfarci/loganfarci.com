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

    return { html };
}
