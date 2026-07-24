import { fileURLToPath } from "node:url";
import path from "node:path";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsconfigPath = path.resolve(__dirname, "./tsconfig.json");

const typeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
        ...config.languageOptions,
        parserOptions: {
            ...config.languageOptions?.parserOptions,
            project: tsconfigPath,
            tsconfigRootDir: __dirname,
        },
    },
}));

export default tseslint.config(
    {
        ignores: ["dist", "node_modules", "coverage"],
    },
    js.configs.recommended,
    {
        files: ["scripts/**/*.mjs"],
        languageOptions: {
            globals: {
                console: "readonly",
                process: "readonly",
            },
        },
    },
    ...typeCheckedConfigs,
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "mermaid",
                            message:
                                "mermaid is a heavy dependency; import it only from src/components/shared/MermaidDiagram.tsx so it stays out of the shared client bundle (see docs/specs/non-goals.md and quality-bars.md).",
                        },
                    ],
                    patterns: [
                        {
                            group: ["mermaid/*"],
                            message:
                                "mermaid is a heavy dependency; import it only from src/components/shared/MermaidDiagram.tsx so it stays out of the shared client bundle (see docs/specs/non-goals.md and quality-bars.md).",
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ["src/components/shared/MermaidDiagram.tsx"],
        rules: {
            "no-restricted-imports": "off",
        },
    },
    prettierConfig,
);
