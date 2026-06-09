import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1 text-base font-medium text-text-primary shadow-sm",
                className,
            )}
            {...props}
        />
    );
}
