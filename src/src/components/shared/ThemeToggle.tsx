import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { MoonIcon, SunIcon } from "@/components/shared/icons";
import { Button } from "@/components/shared/primitives/Button";
import { hoverLift, pressTap } from "@/core/animations";

const ThemeToggle: React.FC = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="p-2 w-9 h-9 rounded-xl bg-surface-hover border border-border shadow-soft">
                <div className="w-5 h-5" />
            </div>
        );
    }

    return <ThemeToggleInner />;
};

const ThemeToggleInner: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            asChild
            variant="icon"
            size="icon"
            className="cursor-pointer rounded-xl border-border bg-surface/85 backdrop-blur transition-all duration-200 ease-brand hover:border-accent-cool hover:bg-surface-elevated hover:shadow-glow"
        >
            <motion.button
                onClick={toggleTheme}
                whileHover={hoverLift}
                whileTap={pressTap}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                type="button"
            >
                {theme === "light" ? (
                    <MoonIcon className="w-5 h-5 text-text-primary" strokeWidth={2} size={24} />
                ) : (
                    <SunIcon className="w-5 h-5 text-text-primary" strokeWidth={2} size={24} />
                )}
            </motion.button>
        </Button>
    );
};

export default ThemeToggle;
