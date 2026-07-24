import { fileURLToPath } from "node:url";
import path from "node:path";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

import noHardcodedColors from "./src/lint/no-hardcoded-colors.js";

// Local plugin holding project-specific guardrail rules (see docs/specs/linting.md).
const local = {
    rules: {
        "no-hardcoded-colors": noHardcodedColors,
    },
};

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
                                "mermaid is a heavy dependency; import it only from src/components/shared/MermaidDiagram.tsx to keep it confined to that single module — the seam where it can be given a dynamic-import boundary — rather than spreading across the app (see docs/specs/non-goals.md and quality-bars.md).",
                        },
                    ],
                    patterns: [
                        {
                            group: ["mermaid/*"],
                            message:
                                "mermaid is a heavy dependency; import it only from src/components/shared/MermaidDiagram.tsx to keep it confined to that single module — the seam where it can be given a dynamic-import boundary — rather than spreading across the app (see docs/specs/non-goals.md and quality-bars.md).",
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
    {
        files: ["**/*.tsx"],
        plugins: { local, "jsx-a11y": jsxA11y },
        rules: {
            "local/no-hardcoded-colors": "error",
            // Enforce the accessibility contract from docs/specs/accessibility.md:
            // every image must carry alt text.
            "jsx-a11y/alt-text": "error",
        },
    },
    prettierConfig,
);
