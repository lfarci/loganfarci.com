import type { Config } from "tailwindcss";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // App-level document colors
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",

                brand: {
                    DEFAULT: "var(--color-brand)",
                    hover: "var(--color-brand-hover)",
                    subtle: "var(--color-brand-subtle)",
                    foreground: "var(--color-brand-foreground)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    hover: "var(--color-accent-hover)",
                    subtle: "var(--color-accent-subtle)",
                    foreground: "var(--color-accent-foreground)",
                },

                // Compatibility aliases for existing semantic classes.
                primary: {
                    DEFAULT: "var(--color-brand)",
                    hover: "var(--color-brand-hover)",
                    light: "var(--color-brand-subtle)",
                    foreground: "var(--color-brand-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    hover: "var(--color-secondary-hover)",
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
                    muted: "var(--color-surface-muted)",
                },
                muted: {
                    DEFAULT: "var(--color-muted)",
                    foreground: "var(--color-muted-foreground)",
                },
                ring: {
                    DEFAULT: "var(--color-ring)",
                    muted: "var(--color-ring-muted)",
                },

                // Status colors
                success: "var(--color-success)",
                warning: "var(--color-warning)",
                error: "var(--color-error)",
                info: "var(--color-info)",
            },
            backgroundImage: {
                "gradient-brand": "var(--gradient-brand)",
                "gradient-accent": "var(--gradient-accent)",
                "gradient-surface": "var(--gradient-surface)",
                "fade-surface": "var(--gradient-fade-surface)",
            },
            boxShadow: {
                card: "var(--shadow-card)",
                "card-hover": "var(--shadow-card-hover)",
                popover: "var(--shadow-popover)",
                focus: "var(--shadow-focus)",
            },
            borderRadius: {
                control: "var(--radius-control)",
                card: "var(--radius-card)",
                surface: "var(--radius-surface)",
            },
        }
    },
    darkMode: "class",
    plugins: [],
} satisfies Config;
