import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import MarkdownContent from "./MarkdownContent";

vi.mock("./MermaidDiagram", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div aria-label="Mermaid diagram">{children}</div>,
}));

describe("MarkdownContent", () => {
    afterEach(() => {
        window.history.replaceState({}, "", "/");
    });

    it("maps a body-level heading to a level-two heading", () => {
        render(<MarkdownContent content="# Body heading" />);

        expect(screen.getByRole("heading", { level: 2, name: "Body heading" })).toBeTruthy();
    });

    it("renders GFM tables with their accessible table role", () => {
        render(<MarkdownContent content={"| Name | Value |\n| --- | --- |\n| Test | Passed |"} />);

        expect(screen.getByRole("table")).toBeTruthy();
    });

    it("renders thematic breaks with the semantic separator primitive", () => {
        render(<MarkdownContent content={"Before\n\n---\n\nAfter"} measure />);

        const separator = screen.getByRole("separator");

        expect({
            hasPrimitiveGeometry: separator.classList.contains("h-px") && separator.classList.contains("w-full"),
            hasSemanticColor: separator.classList.contains("bg-border"),
            preservesSpacing: separator.classList.contains("my-10"),
            preservesMeasure: separator.classList.contains("max-w-[72ch]"),
        }).toEqual({
            hasPrimitiveGeometry: true,
            hasSemanticColor: true,
            preservesSpacing: true,
            preservesMeasure: true,
        });
    });

    it("opens rendered links in a new tab", () => {
        render(<MarkdownContent content="[Project](https://example.com)" />);

        expect(screen.getByRole("link", { name: "Project" }).getAttribute("target")).toBe("_blank");
    });

    it("routes Mermaid code fences to the diagram renderer", async () => {
        render(<MarkdownContent content={"```mermaid\ngraph TD; A-->B\n```"} />);

        expect((await screen.findByRole("generic", { name: "Mermaid diagram" })).textContent).toContain(
            "graph TD; A-->B",
        );
    });

    it("keeps raw HTML inert", () => {
        render(<MarkdownContent content={'<img src="invalid" alt="unsafe" />'} />);

        expect(screen.queryByRole("img", { name: "unsafe" })).toBeNull();
    });

    it.each([
        ["NOTE", "Note"],
        ["TIP", "Tip"],
        ["IMPORTANT", "Important"],
        ["WARNING", "Warning"],
        ["CAUTION", "Caution"],
    ])("renders the %s marker as a labeled callout", (marker, label) => {
        const { container } = render(<MarkdownContent content={`> [!${marker}]\n> ${label} body content.`} />);
        const variant = marker.toLowerCase();
        const title = screen.getByText(label);
        const icon = title.previousElementSibling;
        const callout = title.parentElement?.parentElement?.parentElement;
        const body = screen.getByText(`${label} body content.`);

        expect({
            hasLabel: title.textContent,
            hasBody: body.textContent,
            hidesMarker: container.textContent?.includes(`[!${marker}]`),
            hasSharedSurface: callout?.classList.contains("bg-surface-elevated"),
            hasSharedBorder: callout?.classList.contains("border-border-light"),
            titleUsesVariantColor: title.classList.contains(`text-callout-${variant}`),
            iconUsesVariantColor: icon?.classList.contains(`text-callout-${variant}`),
            titleUsesBodySize: title.classList.contains("text-base") && title.classList.contains("md:text-[1.0625rem]"),
            bodyUsesBodySize: body.classList.contains("text-base") && body.classList.contains("md:text-[1.0625rem]"),
            avoidsCardElevation: callout?.classList.contains("shadow-sm"),
        }).toEqual({
            hasLabel: label,
            hasBody: `${label} body content.`,
            hidesMarker: false,
            hasSharedSurface: true,
            hasSharedBorder: true,
            titleUsesVariantColor: true,
            iconUsesVariantColor: true,
            titleUsesBodySize: true,
            bodyUsesBodySize: true,
            avoidsCardElevation: false,
        });
    });

    it("preserves Markdown semantics throughout a callout body", () => {
        render(
            <MarkdownContent
                content={
                    "> [!TIP]\n> First paragraph with *emphasis*.\n>\n> Second paragraph with a [link](https://example.com) and `code`.\n>\n> - First item\n> - Second item"
                }
            />,
        );

        expect({
            paragraphs: [screen.getByText(/First paragraph/).tagName, screen.getByText(/Second paragraph/).tagName],
            emphasis: screen.getByText("emphasis").tagName,
            link: screen.getByRole("link", { name: "link" }).getAttribute("href"),
            code: screen.getByText("code").tagName,
            listItems: screen.getAllByRole("listitem").map((item) => item.textContent),
        }).toEqual({
            paragraphs: ["P", "P"],
            emphasis: "EM",
            link: "https://example.com",
            code: "CODE",
            listItems: ["First item", "Second item"],
        });
    });

    it.each([
        ["> An ordinary quotation.", "An ordinary quotation."],
        ["> [!ALERT]\n> Unsupported marker.", "[!ALERT]"],
        ["> [!NOTE] Same-line content.", "[!NOTE] Same-line content."],
        ["> Before the marker.\n> [!NOTE]\n> After the marker.", "[!NOTE]"],
        ["> [!note]\n> Lowercase marker.", "[!note]"],
    ])("keeps non-callout blockquotes as ordinary quotations", (content, visibleText) => {
        const { container } = render(<MarkdownContent content={content} />);

        expect({
            blockquoteIncludesText: container.querySelector("blockquote")?.textContent?.includes(visibleText),
            fallbackIsVisible: screen.getByText((text) => text.includes(visibleText)).textContent.includes(visibleText),
            calloutLabel: screen.queryByText("Note")?.textContent,
        }).toEqual({ blockquoteIncludesText: true, fallbackIsVisible: true, calloutLabel: undefined });
    });

    it("gives ordinary quotations a distinct editorial treatment", () => {
        const { container } = render(<MarkdownContent content="> A considered observation." />);
        const blockquote = container.querySelector("blockquote");
        const quoteMark = blockquote?.querySelector('[aria-hidden="true"]');
        const quoteText = screen.getByText("A considered observation.");

        expect({
            keepsBlockquoteSemantics: blockquote?.tagName,
            usesEditorialRules:
                blockquote?.classList.contains("border-y") && blockquote.classList.contains("border-border-light"),
            usesEditorialLayout: blockquote?.classList.contains("grid"),
            hasDecorativeQuoteMark: quoteMark?.textContent?.trim(),
            usesBodyTextSize:
                quoteText.classList.contains("text-base") && quoteText.classList.contains("md:text-[1.0625rem]"),
            keepsBodyTextUpright: quoteText.parentElement?.classList.contains("italic"),
            avoidsTintedPanel: blockquote?.classList.contains("bg-primary-light"),
            avoidsHeavySideRule: blockquote?.classList.contains("border-l-4"),
        }).toEqual({
            keepsBlockquoteSemantics: "BLOCKQUOTE",
            usesEditorialRules: true,
            usesEditorialLayout: true,
            hasDecorativeQuoteMark: "“",
            usesBodyTextSize: true,
            keepsBodyTextUpright: false,
            avoidsTintedPanel: false,
            avoidsHeavySideRule: false,
        });
    });

    it("does not convert a nested callout attempt", () => {
        const { container } = render(
            <MarkdownContent content={"> Outer quotation.\n>\n> > [!NOTE]\n> > Nested attempt."} />,
        );

        expect({
            blockquotes: container.querySelectorAll("blockquote").length,
            markerVisible: container.textContent?.includes("[!NOTE]"),
            calloutLabel: screen.queryByText("Note"),
        }).toEqual({ blockquotes: 2, markerVisible: true, calloutLabel: null });
    });

    it("keeps callout labels in reading order without live-region semantics", () => {
        const { container } = render(<MarkdownContent content={"> [!WARNING]\n> Read this body carefully."} />);
        const text = container.textContent ?? "";

        expect({
            labelBeforeBody: text.indexOf("Warning") < text.indexOf("Read this body carefully."),
            decorativeIcon: container.querySelector("svg")?.getAttribute("aria-hidden"),
            alertRole: container.querySelector('[role="alert"]'),
            liveRegion: container.querySelector("[aria-live]"),
        }).toEqual({ labelBeforeBody: true, decorativeIcon: "true", alertRole: null, liveRegion: null });
    });

    it("preserves readable measure and wraps stress content within the callout", () => {
        render(
            <MarkdownContent
                content={
                    "> [!NOTE]\n> VeryLongUnbrokenCalloutContentThatMustWrapWithoutForcingPageLevelHorizontalScrolling1234567890"
                }
                measure
            />,
        );

        const label = screen.getByText("Note");
        const content = label.parentElement?.parentElement;
        const callout = content?.parentElement;

        expect({
            readableMeasure: callout?.classList.contains("max-w-[72ch]"),
            constrainedGrid: callout?.classList.contains("min-w-0"),
            clippedChrome: callout?.classList.contains("overflow-hidden"),
            wrappingBody: content?.lastElementChild?.classList.contains("[overflow-wrap:anywhere]"),
        }).toEqual({ readableMeasure: true, constrainedGrid: true, clippedChrome: true, wrappingBody: true });
    });

    it("renders complete callout content in static HTML", () => {
        const html = renderToStaticMarkup(
            <MarkdownContent content={"> [!IMPORTANT]\n> Prerendered **callout content**."} />,
        );

        expect({
            hasLabel: html.includes("Important"),
            hasBody: html.includes("<strong"),
            hasMarker: html.includes("[!IMPORTANT]"),
            hidesIcon: html.includes('aria-hidden="true"'),
        }).toEqual({ hasLabel: true, hasBody: true, hasMarker: false, hidesIcon: true });
    });

    it("assigns collision-safe ids to duplicate article headings", () => {
        const { container } = render(
            <MarkdownContent content={"## Repeat\n\n## Repeat\n\n## Repeat 2"} articleNavigation />,
        );

        expect(Array.from(container.querySelectorAll(".markdown-heading"), (heading) => heading.id)).toEqual([
            "repeat",
            "repeat-2",
            "repeat-2-2",
        ]);
    });

    it.each([
        ["## API\n\n## API label", ["api", "api-label-2"]],
        ["## API label\n\n## API", ["api-label", "api-2"]],
    ])("reserves generated label ids for headings in either order", (content, expectedHeadingIds) => {
        const { container } = render(<MarkdownContent content={content} articleNavigation />);
        const renderedIds = Array.from(container.querySelectorAll("[id]"), (element) => element.id);

        expect(screen.getAllByRole("heading").map((heading) => heading.id)).toEqual(expectedHeadingIds);
        expect(new Set(renderedIds).size).toBe(renderedIds.length);
    });

    it("uses inline heading content in the permalink accessible name", () => {
        render(<MarkdownContent content={"## Install *with* `npm`"} articleNavigation />);

        expect(screen.getByRole("link", { name: 'Link to "Install with npm" section' }).getAttribute("href")).toBe(
            "#install-with-npm",
        );
    });

    it("keeps heading permalinks keyboard reachable", () => {
        render(<MarkdownContent content={"## Keyboard access"} articleNavigation />);

        const permalink = screen.getByRole("link", { name: 'Link to "Keyboard access" section' });
        permalink.focus();

        expect(document.activeElement).toBe(permalink);
    });

    it("keeps heading permalinks simple and hides them below desktop widths", () => {
        render(<MarkdownContent content={"## Responsive permalink"} articleNavigation />);

        const permalink = screen.getByRole("link", { name: 'Link to "Responsive permalink" section' });
        const glyph = permalink.firstElementChild as HTMLElement;

        expect({
            hiddenByDefault: permalink.classList.contains("hidden"),
            visibleAtWideDesktop: permalink.classList.contains("xl:inline-flex"),
            visibleAtClippedDesktopWidth: permalink.classList.contains("lg:inline-flex"),
            hasHoverBackground: permalink.classList.contains("hover:bg-surface-hover"),
            hasFocusBackground: permalink.classList.contains("focus-visible:bg-surface-hover"),
            hasRoundedContainer: Array.from(permalink.classList).some((className) => className.startsWith("rounded-")),
            suppressesBoxOutline: permalink.classList.contains("focus-visible:outline-none"),
            hasRoundedGlyph: glyph.classList.contains("rounded-full"),
            hasGlyphFocusOutline: glyph.classList.contains("group-focus-visible/permalink:outline-2"),
            hasGlyphFocusOffset: glyph.classList.contains("group-focus-visible/permalink:outline-offset-2"),
            hasGlyphFocusColor: glyph.classList.contains("group-focus-visible/permalink:outline-ring"),
            scalesFocusedGlyph: glyph.classList.contains("group-focus-visible/permalink:scale-110"),
        }).toEqual({
            hiddenByDefault: true,
            visibleAtWideDesktop: true,
            visibleAtClippedDesktopWidth: false,
            hasHoverBackground: false,
            hasFocusBackground: false,
            hasRoundedContainer: false,
            suppressesBoxOutline: true,
            hasRoundedGlyph: true,
            hasGlyphFocusOutline: true,
            hasGlyphFocusOffset: true,
            hasGlyphFocusColor: true,
            scalesFocusedGlyph: true,
        });
    });

    it("preserves nested heading levels in the table of contents", () => {
        render(<MarkdownContent content={"## Parent\n\n### Child\n\n#### Detail"} articleNavigation />);

        const navigation = screen.getByRole("navigation", { name: "In this article" });

        expect(within(navigation).getAllByRole("list")).toHaveLength(3);
    });

    it("shows only top-level table-of-contents lists below desktop widths", () => {
        render(<MarkdownContent content={"## Parent\n\n### Child\n\n#### Detail"} articleNavigation />);

        const navigation = screen.getByRole("navigation", { name: "In this article" });
        const [rootList, ...nestedLists] = within(navigation).getAllByRole("list");

        expect({
            rootHidden: rootList.classList.contains("hidden"),
            nestedVisibility: nestedLists.map((list) => ({
                hiddenByDefault: list.classList.contains("hidden"),
                visibleOnDesktop: list.classList.contains("lg:block"),
            })),
        }).toEqual({
            rootHidden: false,
            nestedVisibility: [
                { hiddenByDefault: true, visibleOnDesktop: true },
                { hiddenByDefault: true, visibleOnDesktop: true },
            ],
        });
    });

    it("keeps article navigation visible without a disclosure or duplicate top divider", () => {
        const { container } = render(
            <MarkdownContent content={"## Parent\n\n### Child\n\n## Next"} articleNavigation />,
        );

        const navigation = screen.getByRole("navigation", { name: "In this article" });

        expect({
            hasVisibleTitle: within(navigation).getByRole("heading", { level: 2, name: "In this article" }).id,
            hasDisclosure: container.querySelector("details, summary") !== null,
            hasBottomDivider: navigation.classList.contains("border-b"),
            hasTopDivider: navigation.classList.contains("border-t") || navigation.classList.contains("border-y"),
        }).toEqual({
            hasVisibleTitle: navigation.getAttribute("aria-labelledby"),
            hasDisclosure: false,
            hasBottomDivider: true,
            hasTopDivider: false,
        });
    });

    it("marks the current table-of-contents link with neutral typographic emphasis", () => {
        render(<MarkdownContent content={"## Parent\n\n### Child\n\n## Next"} articleNavigation />);

        const navigation = screen.getByRole("navigation", { name: "In this article" });
        const links = within(navigation).getAllByRole("link");
        const currentLinks = links.filter((link) => link.getAttribute("aria-current") === "location");

        expect({
            currentLinkNames: currentLinks.map((link) => link.textContent),
            usesWeight: currentLinks[0]?.classList.contains("font-semibold"),
            usesNeutralText: currentLinks[0]?.classList.contains("text-text-primary"),
            usesBlueIndicator: links.some(
                (link) => link.classList.contains("border-primary") || link.classList.contains("text-primary"),
            ),
        }).toEqual({ currentLinkNames: ["Parent"], usesWeight: true, usesNeutralText: true, usesBlueIndicator: false });
    });

    it("targets the shared heading ids from table-of-contents links", () => {
        render(<MarkdownContent content={"## Parent\n\n### Child\n\n## Next"} articleNavigation />);

        const navigation = screen.getByRole("navigation", { name: "In this article" });

        expect(
            within(navigation)
                .getAllByRole("link")
                .map((link) => link.getAttribute("href")),
        ).toEqual(["#parent", "#child", "#next"]);
    });

    it("omits the table of contents when too few headings justify it", () => {
        render(<MarkdownContent content={"## First\n\n## Second"} articleNavigation />);

        expect(screen.queryByRole("navigation", { name: "In this article" })).toBeNull();
    });

    it("does not add article navigation when there are no eligible headings", () => {
        render(<MarkdownContent content={"##### Small detail\n\nBody copy."} articleNavigation />);

        expect(screen.queryAllByRole("link")).toHaveLength(0);
    });

    it("provides a fragment target offset below the sticky header", () => {
        window.history.replaceState({}, "", "/articles/example#getting-started");
        render(<MarkdownContent content={"## Getting started"} articleNavigation />);

        const target = screen.getByRole("heading", { name: "Getting started" });

        expect(document.getElementById(window.location.hash.slice(1))).toBe(target);
        expect(target.className).toContain("scroll-mt-24");
    });

    it("renders heading ids and fragment links in static HTML", () => {
        const html = renderToStaticMarkup(
            <MarkdownContent content={"## First\n\n### Second\n\n## Third"} articleNavigation />,
        );

        expect([
            html.includes('id="first"'),
            html.includes('href="#first"'),
            html.includes("In this article"),
            html.includes('data-article-end=""'),
            html.includes('aria-hidden="true"'),
        ]).toEqual([true, true, true, true, true]);
    });

    it("keeps nested table-of-contents links in static HTML", () => {
        const html = renderToStaticMarkup(
            <MarkdownContent content={"## Parent\n\n### Child\n\n#### Detail"} articleNavigation />,
        );

        expect([
            html.includes('href="#parent"'),
            html.includes('href="#child"'),
            html.includes('href="#detail"'),
        ]).toEqual([true, true, true]);
    });
});
