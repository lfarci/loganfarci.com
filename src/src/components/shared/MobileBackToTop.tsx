import { useEffect, useState, type MouseEvent } from "react";
import { ChevronUpIcon } from "@/components/shared/icons";
import { Button } from "@/components/shared/primitives/Button";
import { mergeClassNames } from "@/core/mergeClassNames";

interface MobileBackToTopProps {
    visibilityAnchorId: string;
    targetId?: string;
}

export default function MobileBackToTop({
    visibilityAnchorId,
    targetId = "main-content",
}: Readonly<MobileBackToTopProps>) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const visibilityAnchor = document.getElementById(visibilityAnchorId);

        if (!visibilityAnchor || typeof window.IntersectionObserver !== "function") {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry) {
                    setIsVisible(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
                }
            },
            { threshold: 0 },
        );

        observer.observe(visibilityAnchor);

        return () => observer.disconnect();
    }, [visibilityAnchorId]);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        const target = event.currentTarget.ownerDocument.getElementById(targetId);
        target?.focus({ preventScroll: true });
    };

    return (
        <Button
            asChild
            variant="icon"
            size="icon"
            className={mergeClassNames(
                "fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] z-40 size-11 touch-manipulation rounded-full border-border bg-surface p-0 text-text-primary shadow-popover transition-[opacity,transform,background-color] duration-150 ease-out hover:bg-surface-hover active:bg-surface-muted motion-reduce:transition-none lg:hidden",
                isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
            )}
        >
            <a
                href={`#${targetId}`}
                aria-label="Back to top"
                aria-hidden={isVisible ? undefined : true}
                inert={!isVisible}
                tabIndex={isVisible ? undefined : -1}
                onClick={handleClick}
            >
                <ChevronUpIcon size={20} viewBox="0 0 24 24" />
            </a>
        </Button>
    );
}
