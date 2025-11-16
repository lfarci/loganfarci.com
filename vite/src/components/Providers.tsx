import { ThemeProvider } from "@/contexts/ThemeContext";
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </HeroUIProvider>
    );
}