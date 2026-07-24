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
        // Guardrail (docs/specs/quality-bars.md#component-conventions): interactive
        // behavior MUST NOT be reimplemented by hand. Flag raw JSX elements that a shared
        // primitive already covers so contributors reach for the primitive instead.
        files: ["**/*.tsx"],
        rules: {
            "no-restricted-syntax": [
                "warn",
                {
                    selector: "JSXOpeningElement[name.name='button']",
                    message:
                        "Use the Button primitive (@/components/shared/primitives) instead of a raw <button>; don't reimplement its behavior by hand.",
                },
                {
                    selector: "JSXOpeningElement[name.name='hr']",
                    message:
                        "Use the Separator primitive (@/components/shared/primitives) instead of a raw <hr>; don't reimplement its behavior by hand.",
                },
            ],
        },
    },
    {
        // The primitive source files legitimately render these raw elements.
        files: ["src/components/shared/primitives/**/*.tsx"],
        rules: {
            "no-restricted-syntax": "off",
        },
    },
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
