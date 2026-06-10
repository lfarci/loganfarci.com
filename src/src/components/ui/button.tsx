import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, Ref } from "react";
import { cn } from "@/core/cn";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-text-inverse hover:bg-primary-hover",
                secondary: "border border-border bg-surface-hover text-text-primary hover:bg-surface-elevated",
                ghost: "text-text-primary hover:bg-surface-hover",
                icon: "border border-border bg-surface-hover text-text-primary hover:bg-surface-elevated",
            },
            size: {
                default: "h-11 px-6 py-3",
                sm: "h-9 px-3",
                icon: "size-9 p-2",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    ref?: Ref<HTMLButtonElement>;
}

export function Button({ className, variant, size, asChild = false, ref, ...props }: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
