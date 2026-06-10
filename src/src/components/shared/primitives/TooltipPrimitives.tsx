import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps } from "react";
import { mergeClassNames } from "@/core/mergeClassNames";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
    className,
    sideOffset = 6,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                sideOffset={sideOffset}
                className={mergeClassNames(
                    "z-50 max-w-xs overflow-hidden rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-sm text-text-primary shadow-md",
                    className,
                )}
                {...props}
            />
        </TooltipPrimitive.Portal>
    );
}
