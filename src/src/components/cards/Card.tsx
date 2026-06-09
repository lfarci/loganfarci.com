import type React from "react";
import { Link } from "react-router";
import { mergeClassNames } from "@/core/mergeClassNames";
import { Heading3 } from "@/components/shared/typography";
import { typographyStyles } from "@/components/shared/typography/core";
import { ImageProps } from "@/types";
import GridContainer from "@/components/layout/GridContainer";
import { cardRootClassName } from "@/components/shared/primitives/CardPrimitives";

type PolymorphicProps<E extends React.ElementType> = {
    as?: E;
    className?: string;
    children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, "as" | "className" | "children">;

type SimpleProps = {
    className?: string;
    children?: React.ReactNode;
};

type CardGridProps = SimpleProps & { columns?: number };

type CardMediaProps = {
    media: ImageProps;
    size?: "small" | "medium" | "large" | "full";
    align?: "center" | "start";
    className?: string;
    containerClassName?: string;
};

type CardLinkProps = {
    href: string;
    external?: boolean;
    className?: string;
    children: React.ReactNode;
};

const visualCardClassName =
    "group/card relative isolate overflow-hidden rounded-2xl border-border-light bg-surface/88 p-6 shadow-soft backdrop-blur transition-all duration-300 ease-brand hover:-translate-y-1 hover:border-accent-cool/60 hover:shadow-card focus-within:border-primary focus-within:shadow-glow";

const mediaSizes: Record<NonNullable<CardMediaProps["size"]>, string> = {
    small: "w-1/3",
    medium: "w-1/2",
    large: "w-3/4",
    full: "w-full",
};

const Card = <E extends React.ElementType = "div">({
    as,
    className,
    children,
    ...props
}: PolymorphicProps<E>) => {
    const Component = as ?? "div";
    return (
        <Component
            className={mergeClassNames(cardRootClassName, visualCardClassName, className)}
            {...(props as React.ComponentPropsWithoutRef<E>)}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gradient-mid/70 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            />
            {children}
        </Component>
    );
};

export const CardHeader: React.FC<SimpleProps> = ({ children, className }) => (
    <div className={mergeClassNames("flex flex-col gap-2 min-w-0", className)}>{children}</div>
);

export const CardTitle: React.FC<SimpleProps> = ({ children, className }) => (
    <Heading3 className={mergeClassNames("leading-tight", className)}>{children}</Heading3>
);

export const CardSubtitle: React.FC<PolymorphicProps<React.ElementType>> = ({ as, children, className, ...props }) => {
    const Component = (as as React.ElementType) ?? "p";
    return (
        <Component className={mergeClassNames(typographyStyles.caption, className)} {...props}>
            {children}
        </Component>
    );
};

export const CardBody: React.FC<SimpleProps> = ({ children, className }) => (
    <div className={mergeClassNames("flex flex-col gap-2", className)}>{children}</div>
);

export const CardFooter: React.FC<SimpleProps> = ({ children, className }) => (
    <div className={mergeClassNames("mt-4 flex flex-wrap gap-2 justify-start items-start", className)}>{children}</div>
);

export const CardMedia: React.FC<CardMediaProps> = ({
    media,
    size = "medium",
    align = "center",
    className,
    containerClassName,
}) => (
    <div
        className={mergeClassNames(
            "flex justify-center",
            align === "start" ? "items-start" : "items-center",
            containerClassName,
        )}
    >
        <img
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            className={mergeClassNames("object-contain", mediaSizes[size], className)}
        />
    </div>
);

export const CardGrid: React.FC<CardGridProps> = ({ columns = 3, className, children }) => (
    <GridContainer columns={columns} className={className}>
        {children}
    </GridContainer>
);

export const CardLink: React.FC<CardLinkProps> = ({ href, external = false, className, children }) => {
    const linkClass = mergeClassNames(
        "block h-full rounded-2xl transition-transform duration-300 ease-brand hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
        className,
    );

    return external ? (
        <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
            {children}
        </a>
    ) : (
        <Link to={href} className={linkClass}>
            {children}
        </Link>
    );
};

export default Card;
