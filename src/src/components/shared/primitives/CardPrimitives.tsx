import type { ComponentProps, ElementType, ReactNode } from "react";
import { mergeClassNames } from "@/core/mergeClassNames";

type PolymorphicProps<E extends ElementType> = {
    as?: E;
    className?: string;
    children?: ReactNode;
} & Omit<ComponentProps<E>, "as" | "className" | "children">;

export const cardRootClassName =
    "h-full rounded-card border border-border-light bg-surface p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover active:shadow-card-hover";

export function Card<E extends ElementType = "div">({ as, className, children, ...props }: PolymorphicProps<E>) {
    const Component = as ?? "div";

    return (
        <Component
            className={mergeClassNames(cardRootClassName, className)}
            {...(props as ComponentProps<E>)}
        >
            {children}
        </Component>
    );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
    return <div className={mergeClassNames("flex flex-col gap-2 min-w-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"div">) {
    return <div className={mergeClassNames("leading-tight", className)} {...props} />;
}

export function CardDescription<E extends ElementType = "p">({
    as,
    className,
    children,
    ...props
}: PolymorphicProps<E>) {
    const Component = as ?? "p";

    return (
        <Component className={mergeClassNames("text-base text-text-muted", className)} {...(props as ComponentProps<E>)}>
            {children}
        </Component>
    );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
    return <div className={mergeClassNames("flex flex-col gap-2", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
    return <div className={mergeClassNames("mt-4 flex flex-wrap gap-2 justify-start items-start", className)} {...props} />;
}
