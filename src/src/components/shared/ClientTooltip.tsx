import type { ReactElement, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type TooltipPlacement = "top" | "right" | "bottom" | "left";

interface ClientTooltipProps {
    children: ReactElement;
    content: ReactNode;
    placement?: TooltipPlacement;
    className?: string;
}

export default function ClientTooltip({ children, content, placement = "top", className }: ClientTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={placement} className={className}>
                {content}
            </TooltipContent>
        </Tooltip>
    );
}
