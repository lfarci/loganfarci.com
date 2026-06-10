import type { ComponentProps } from "react";
import { cn } from "@/core/cn";

export function Badge({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-md border border-border bg-transparent px-3 py-1 text-base text-text-tertiary text-font",
                className,
            )}
            {...props}
        />
    );
}
