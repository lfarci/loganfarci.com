import type { ReactElement, ReactNode } from "react";
import { Tooltip as TooltipRoot, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type TooltipPlacement = "top" | "right" | "bottom" | "left";

interface TooltipProps {
    children: ReactElement;
    content: ReactNode;
    placement?: TooltipPlacement;
    className?: string;
}

export default function Tooltip({ children, content, placement = "top", className }: TooltipProps) {
    return (
        <TooltipRoot>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={placement} className={className}>
                {content}
            </TooltipContent>
        </TooltipRoot>
    );
}
