import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import markdownPlugin from "./plugins/vite-plugin-markdown";
import stableFontDisplayPlugin from "./plugins/vite-plugin-stable-font-display";
import themeInitializationPlugin from "./plugins/vite-plugin-theme-initialization";
import path from "node:path";

export default defineConfig({
    plugins: [themeInitializationPlugin(), stableFontDisplayPlugin(), tailwindcss(), react(), markdownPlugin()],
    resolve: {
        alias: { "@/": path.resolve(__dirname, "src") + "/", "@content/": path.resolve(__dirname, "../content") + "/" },
    },
    build: { outDir: "dist" },
    server: {
        fs: {
            allow: [".."], // Allow reading content/ outside project root
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        include: ["tests/unit/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}", "plugins/**/*.test.{ts,tsx}"],
        setupFiles: ["src/test/setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "json-summary", "html"],
            reportOnFailure: true,
            thresholds: {
                lines: 50,
                functions: 50,
                branches: 40,
                statements: 50,
                "src/core/**": { lines: 80, functions: 80, branches: 70, statements: 80 },
            },
        },
    },
});
