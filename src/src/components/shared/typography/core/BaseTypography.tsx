import React, { forwardRef, ElementType, ComponentPropsWithoutRef } from "react";

// Common props interface for all typography components
export interface BaseTypographyProps {
    className?: string;
    children: React.ReactNode;
}

// Generic typography component that can render any HTML element
export interface TypographyProps<T extends ElementType = ElementType> extends BaseTypographyProps {
    as?: T;
}

type PolymorphicRef<T extends ElementType> = ComponentPropsWithoutRef<T>["ref"];

type TypographyPropsWithRef<T extends ElementType> = TypographyProps<T> & { ref?: PolymorphicRef<T> };

// Base typography component with forwardRef support
const BaseTypography = forwardRef<HTMLElement, TypographyPropsWithRef<ElementType>>(
    ({ as: Element = "div", className = "", children, ...props }, ref) => {
        return (
            <Element className={className} ref={ref} {...props}>
                {children}
            </Element>
        );
    },
);

BaseTypography.displayName = "BaseTypography";

// Factory function to create typography components
export function createTypographyComponent<T extends ElementType>(
    element: T,
    defaultClassName: string,
    displayName: string,
) {
    const Component = forwardRef<HTMLElement, TypographyPropsWithRef<T>>(
        ({ className = "", children, ...props }, ref) => {
            const combinedClassName = `${defaultClassName} ${className}`.trim();

            return (
                <BaseTypography as={element} className={combinedClassName} ref={ref} {...props}>
                    {children}
                </BaseTypography>
            );
        },
    );

    Component.displayName = displayName;
    return Component;
}

export default BaseTypography;
