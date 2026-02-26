import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import markdownPlugin from "./plugins/vite-plugin-markdown";
import path from "path";

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
});
