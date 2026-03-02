import { defineConfig } from "vitest/config";
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
    ssr: {
        noExternal: ["react-helmet-async"],
    },
    server: {
        fs: {
            allow: [".."], // Allow reading content/ outside project root
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./tests/unit/setup.ts"],
        include: ["tests/unit/**/*.test.{ts,tsx}"],
        coverage: {
            reporter: ["text", "json", "html"],
        },
    },
});
