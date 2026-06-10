import type { ComponentProps } from "react";
import { mergeClassNames } from "@/core/mergeClassNames";
import { typographyStyles } from "@/components/shared/typography/core";

export function Badge({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            className={mergeClassNames(
                "inline-flex items-center gap-1 rounded-md border border-border bg-transparent px-3 py-1",
                typographyStyles.caption,
                className,
            )}
            {...props}
        />
    );
}
