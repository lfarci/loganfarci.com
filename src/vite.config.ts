import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import markdownPlugin from "./plugins/vite-plugin-markdown";
import path from "node:path";

export default defineConfig({
    plugins: [tailwindcss(), react(), markdownPlugin()],
    resolve: {
        alias: {
            "@/": path.resolve(__dirname, "src") + "/",
            "@content/": path.resolve(__dirname, "../content") + "/",
        },
    },
    build: {
        outDir: "dist",
    },
    server: {
        fs: {
            allow: [".."], // Allow reading content/ outside project root
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        include: ["tests/unit/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
        setupFiles: ["src/test/setup.ts"],
        coverage: {
            reporter: ["text", "json", "html"],
        },
    },
});
