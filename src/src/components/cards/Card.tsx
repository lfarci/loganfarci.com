import type React from "react";
import { Link } from "react-router";
import { Heading3 } from "@/components/shared/typography";
import { ImageProps } from "@/types";
import GridContainer from "@/components/layout/GridContainer";
import {
    CardContent as UICardContent,
    CardDescription as UICardDescription,
    CardFooter as UICardFooter,
    CardHeader as UICardHeader,
    cardRootClassName,
} from "@/components/ui/card";

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
    children,
    ...props
}: PolymorphicProps<E>) => {
    const Component = as ?? "div";
    return (
        <Component className={cn(cardRootClassName, className)} {...(props as React.ComponentPropsWithoutRef<E>)}>
            {children}
        </Component>
    );
};

export const CardHeader: React.FC<SimpleProps> = ({ children, className }) => (
    <UICardHeader className={className}>{children}</UICardHeader>
);

export const CardTitle: React.FC<SimpleProps> = ({ children, className }) => (
    <Heading3 className={cn("leading-tight", className)}>{children}</Heading3>
);

export const CardSubtitle: React.FC<PolymorphicProps<React.ElementType>> = ({ as, children, className, ...props }) => {
    const Component = (as as React.ElementType) ?? "p";
    return (
        <UICardDescription as={Component} className={className} {...props}>
            {children}
        </UICardDescription>
    );
};

export const CardBody: React.FC<SimpleProps> = ({ children, className }) => (
    <UICardContent className={className}>{children}</UICardContent>
);

export const CardFooter: React.FC<SimpleProps> = ({ children, className }) => (
    <UICardFooter className={className}>{children}</UICardFooter>
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
