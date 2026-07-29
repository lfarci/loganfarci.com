import type { Plugin } from "vite";

import { themeInitializationScript } from "../src/core/themeInitialization";

export default function themeInitializationPlugin(): Plugin {
    return {
        name: "theme-initialization",
        transformIndexHtml: {
            order: "pre",
            handler: () => [{ tag: "script", children: themeInitializationScript, injectTo: "head-prepend" }],
        },
    };
}
