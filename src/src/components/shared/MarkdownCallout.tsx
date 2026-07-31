import type { ReactNode } from "react";

import type { MarkdownCalloutVariant } from "@/components/shared/markdownCallouts";
import { mergeClassNames } from "@/core/mergeClassNames";

interface MarkdownCalloutProps {
    children: ReactNode;
    className?: string;
    variant: MarkdownCalloutVariant;
}

interface CalloutPresentation {
    containerClassName: string;
    foregroundClassName: string;
    iconClassName: string;
    icon: ReactNode;
    label: string;
}

const calloutPresentation = {
    note: {
        containerClassName: "border-l-callout-note bg-callout-note-subtle",
        foregroundClassName: "text-callout-note",
        iconClassName: "bg-callout-note text-background",
        icon: (
            <>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 10.75v5.5M12 7.75h.01" />
            </>
        ),
        label: "Note",
    },
    tip: {
        containerClassName: "border-l-callout-tip bg-callout-tip-subtle",
        foregroundClassName: "text-callout-tip",
        iconClassName: "bg-callout-tip text-background",
        icon: (
            <path d="M9.25 18h5.5M10 21h4M8.5 14.75a6 6 0 1 1 7 0c-.9.65-1.25 1.35-1.25 2.25h-4.5c0-.9-.35-1.6-1.25-2.25Z" />
        ),
        label: "Tip",
    },
    important: {
        containerClassName: "border-l-callout-important bg-callout-important-subtle",
        foregroundClassName: "text-callout-important",
        iconClassName: "bg-callout-important text-background",
        icon: (
            <path d="m12 3 1.75 5.25L19 10l-5.25 1.75L12 17l-1.75-5.25L5 10l5.25-1.75L12 3Zm6 12 .75 2.25L21 18l-2.25.75L18 21l-.75-2.25L15 18l2.25-.75L18 15Z" />
        ),
        label: "Important",
    },
    warning: {
        containerClassName: "border-l-callout-warning bg-callout-warning-subtle",
        foregroundClassName: "text-callout-warning",
        iconClassName: "bg-callout-warning text-background",
        icon: <path d="M12 4 3.75 19h16.5L12 4Zm0 5.25v4.5M12 16.75h.01" />,
        label: "Warning",
    },
    caution: {
        containerClassName: "border-l-callout-caution bg-callout-caution-subtle",
        foregroundClassName: "text-callout-caution",
        iconClassName: "bg-callout-caution text-background",
        icon: <path d="m8 3-5 5v8l5 5h8l5-5V8l-5-5H8Zm4 5.25v5.5M12 16.75h.01" />,
        label: "Caution",
    },
} satisfies Record<MarkdownCalloutVariant, CalloutPresentation>;

function CalloutIcon({ presentation }: { presentation: CalloutPresentation }) {
    return (
        <span
            aria-hidden="true"
            className={mergeClassNames(
                "flex size-8 shrink-0 items-center justify-center rounded-control",
                presentation.iconClassName,
            )}
        >
            <svg
                aria-hidden="true"
                className="size-[1.125rem] fill-none stroke-current stroke-[1.8]"
                focusable="false"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
            >
                {presentation.icon}
            </svg>
        </span>
    );
}

export default function MarkdownCallout({ children, className, variant }: MarkdownCalloutProps) {
    const presentation = calloutPresentation[variant];

    return (
        <div
            className={mergeClassNames(
                "mb-6 min-w-0 overflow-hidden rounded-card border border-border border-l-[0.375rem]",
                presentation.containerClassName,
                className,
            )}
        >
            <div className="min-w-0 p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                    <CalloutIcon presentation={presentation} />
                    <span
                        className={mergeClassNames(
                            "heading-font text-sm font-bold tracking-[-0.01em]",
                            presentation.foregroundClassName,
                        )}
                    >
                        {presentation.label}
                    </span>
                </div>
                <div className="min-w-0 [overflow-wrap:anywhere] [&>*:last-child]:mb-0">{children}</div>
            </div>
        </div>
    );
}
