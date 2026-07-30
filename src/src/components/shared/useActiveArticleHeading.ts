import { useEffect, useState } from "react";

function getHashHeadingId(headingIds: ReadonlySet<string>): string | null {
    const hashHeadingId = window.location.hash.slice(1);
    return headingIds.has(hashHeadingId) ? hashHeadingId : null;
}

export function useActiveArticleHeading(headingIds: readonly string[]): string | null {
    const [activeHeadingId, setActiveHeadingId] = useState<string | null>(headingIds[0] ?? null);

    useEffect(() => {
        const eligibleHeadingIds = new Set(headingIds);
        const updateFromHash = () => {
            const hashHeadingId = getHashHeadingId(eligibleHeadingIds);

            if (hashHeadingId) {
                setActiveHeadingId(hashHeadingId);
            }
        };

        updateFromHash();
        window.addEventListener("hashchange", updateFromHash);

        if (typeof window.IntersectionObserver !== "function") {
            return () => window.removeEventListener("hashchange", updateFromHash);
        }

        const headingElements = headingIds
            .map((headingId) => document.getElementById(headingId))
            .filter((heading): heading is HTMLElement => heading !== null);
        const headingObserver = new IntersectionObserver(
            (entries) => {
                const activeEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];

                if (activeEntry) {
                    setActiveHeadingId(activeEntry.target.id);
                }
            },
            { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
        );

        headingElements.forEach((heading) => headingObserver.observe(heading));

        const lastHeadingId = headingIds.at(-1);
        const articleEndMarker = headingElements
            .at(-1)
            ?.closest("[data-article-markdown-body]")
            ?.querySelector<HTMLElement>("[data-article-end]");
        const articleEndObserver =
            lastHeadingId && articleEndMarker
                ? new IntersectionObserver(
                      (entries) => {
                          if (entries.some((entry) => entry.isIntersecting)) {
                              setActiveHeadingId(lastHeadingId);
                          }
                      },
                      { rootMargin: "-96px 0px 0px 0px", threshold: 0 },
                  )
                : null;

        articleEndObserver?.observe(articleEndMarker);

        return () => {
            headingObserver.disconnect();
            articleEndObserver?.disconnect();
            window.removeEventListener("hashchange", updateFromHash);
        };
    }, [headingIds]);

    return activeHeadingId;
}
