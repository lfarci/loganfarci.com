import { useEffect, useState, type MouseEvent } from "react";
import { ChevronUpIcon } from "@/components/shared/icons";
import { Button } from "@/components/shared/primitives/Button";
import { mergeClassNames } from "@/core/mergeClassNames";

interface MobileBackToContentsProps {
    targetId: string;
}

export default function MobileBackToContents({ targetId }: Readonly<MobileBackToContentsProps>) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const target = document.getElementById(targetId);

        if (!target || typeof window.IntersectionObserver !== "function") {
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

        observer.observe(target);

        return () => observer.disconnect();
    }, [targetId]);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        const target = event.currentTarget.ownerDocument.getElementById(targetId);
        target?.focus({ preventScroll: true });
    };

    return (
        <Button
            asChild
            className={mergeClassNames(
                "fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] z-40 h-11 min-w-11 px-4 py-2 shadow-popover transition-[opacity,transform] duration-200 motion-reduce:transition-none lg:hidden",
                isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
            )}
        >
            <a
                href={`#${targetId}`}
                aria-hidden={isVisible ? undefined : true}
                inert={!isVisible}
                tabIndex={isVisible ? undefined : -1}
                onClick={handleClick}
            >
                <ChevronUpIcon size={16} viewBox="0 0 24 24" />
                <span>Contents</span>
            </a>
        </Button>
    );
}
