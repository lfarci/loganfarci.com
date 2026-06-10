import React from "react";
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router";
import App from "./App";
import "./globals.css";

const prerenderRootMarker = '<template data-prerender-root=""></template>';

const streamToString = async (stream: ReadableStream<Uint8Array>): Promise<string> => {
    const chunks: string[] = [];
    const decoder = new TextDecoder();
    const reader = stream.getReader();

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        chunks.push(decoder.decode(value, { stream: true }));
    }

    chunks.push(decoder.decode());

    return chunks.join("");
};

export async function render(url: string) {
    const { prelude } = await prerender(
        <>
            <template data-prerender-root="" />
            <StaticRouter location={url}>
                <App />
            </StaticRouter>
        </>
    );

    const rendered = await streamToString(prelude);
    const markerIndex = rendered.indexOf(prerenderRootMarker);

    if (markerIndex === -1) {
        throw new Error("React prerender output did not include the root marker.");
    }

    return {
        headTags: rendered.slice(0, markerIndex),
        html: rendered.slice(markerIndex + prerenderRootMarker.length),
    };
}

export { getStaticRoutes } from "./routes";
export { getAllArticles } from "@/core/articles";
