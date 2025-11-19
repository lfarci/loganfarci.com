import { fileURLToPath } from "node:url";
import path from "node:path";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
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
        ignores: ["node_modules", ".next", "out", "dist", "coverage"],
    },
    js.configs.recommended,
    ...typeCheckedConfigs,
    nextPlugin.configs["core-web-vitals"],
    prettierConfig,
);
