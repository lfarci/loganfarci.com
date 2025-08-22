import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: { 
        extend: { 
            colors: { 
                // Next.js compatibility
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                
                // Semantic theme colors
                primary: {
                    DEFAULT: "var(--color-primary)",
                    hover: "var(--color-primary-hover)",
                    light: "var(--color-primary-light)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    hover: "var(--color-secondary-hover)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    hover: "var(--color-accent-hover)",
                },
                
                // Text colors
                text: {
                    primary: "var(--color-text-primary)",
                    secondary: "var(--color-text-secondary)",
                    tertiary: "var(--color-text-tertiary)",
                    muted: "var(--color-text-muted)",
                    inverse: "var(--color-text-inverse)",
                },
                
                // Border colors
                border: {
                    DEFAULT: "var(--color-border)",
                    light: "var(--color-border-light)",
                    strong: "var(--color-border-strong)",
                },
                
                // Surface colors
                surface: {
                    DEFAULT: "var(--color-surface)",
                    elevated: "var(--color-surface-elevated)",
                    hover: "var(--color-surface-hover)",
                },
                
                // Status colors
                success: "var(--color-success)",
                warning: "var(--color-warning)",
                error: "var(--color-error)",
                info: "var(--color-info)",
            } 
        } 
    },
    darkMode: "class",
    plugins: [heroui()],
} satisfies Config;
