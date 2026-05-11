import type React from "react";
import { Link } from "react-router";
import { Heading3 } from "@/components/shared/typography";
import { ImageProps } from "@/types";
import GridContainer from "@/components/layout/GridContainer";

type PolymorphicProps<E extends React.ElementType> = {
    as?: E;
    className?: string;
    variant?: "default" | "quiet" | "feature" | "compact";
    children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, "as" | "className" | "variant" | "children">;

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

const baseCardClass =
    "h-full border transition-[border-color,box-shadow,transform] duration-200 focus-within:border-primary";

const cardVariants = {
    default:
        "rounded-2xl border-border-light bg-surface p-6 shadow-sm hover:-translate-y-0.5 hover:border-border hover:shadow-lg active:shadow-lg",
    quiet:
        "rounded-2xl border-border-light bg-surface/70 p-5 shadow-none hover:border-border hover:bg-surface-hover/60",
    feature:
        "rounded-3xl border-border-light bg-surface p-6 shadow-md hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-xl md:p-8",
    compact:
        "rounded-xl border-border-light bg-surface/80 p-4 shadow-none hover:border-border hover:bg-surface-hover/70",
} satisfies Record<NonNullable<PolymorphicProps<"div">["variant"]>, string>;

const mediaSizes: Record<NonNullable<CardMediaProps["size"]>, string> = {
    small: "w-1/3",
    medium: "w-1/2",
    large: "w-3/4",
    full: "w-full",
};

const cn = (...classes: Array<string | undefined | null | false>) => classes.filter(Boolean).join(" ");

const Card = <E extends React.ElementType = "div">({
    as,
    className,
    variant = "default",
    children,
    ...props
}: PolymorphicProps<E>) => {
    const Component = as ?? "div";
    return (
        <Component className={cn(baseCardClass, cardVariants[variant], className)} {...(props as React.ComponentPropsWithoutRef<E>)}>
            {children}
        </Component>
    );
};

export const CardHeader: React.FC<SimpleProps> = ({ children, className }) => (
    <div className={cn("flex flex-col gap-2 min-w-0", className)}>{children}</div>
);

export const CardTitle: React.FC<SimpleProps> = ({ children, className }) => (
    <Heading3 className={cn("leading-tight", className)}>{children}</Heading3>
);

export const CardSubtitle: React.FC<PolymorphicProps<React.ElementType>> = ({ as, children, className, ...props }) => {
    const Component = (as as React.ElementType) ?? "p";
    return (
        <Component className={cn("text-base text-text-muted", className)} {...props}>
            {children}
        </Component>
    );
};

export const CardBody: React.FC<SimpleProps> = ({ children, className }) => (
    <div className={cn("flex flex-col gap-2", className)}>{children}</div>
);

export const CardFooter: React.FC<SimpleProps> = ({ children, className }) => (
    <div className={cn("mt-4 flex flex-wrap gap-2 justify-start items-start", className)}>{children}</div>
);

export const CardMedia: React.FC<CardMediaProps> = ({
    media,
    size = "medium",
    align = "center",
    className,
    containerClassName,
}) => (
    <div
        className={cn(
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
            className={cn("object-contain", mediaSizes[size], className)}
        />
    </div>
);

export const CardGrid: React.FC<CardGridProps> = ({ columns = 3, className, children }) => (
    <GridContainer columns={columns} className={className}>
        {children}
    </GridContainer>
);

export const CardLink: React.FC<CardLinkProps> = ({ href, external = false, className, children }) => {
    const linkClass = cn(
        "block h-full transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
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
