import MarkdownContent from "@/components/shared/MarkdownContent";
import { Heading1, Text } from "@/components/shared/typography";

const showcaseMarkdown = `
> [!NOTE]
> Useful context can include \`inline code\` and **strong emphasis**.
>
> A second paragraph confirms that longer callouts keep a comfortable reading rhythm.

> [!TIP]
> A practical suggestion can include a short checklist:
>
> - Keep the marker on its own line.
> - Write the body with normal Markdown.

> [!IMPORTANT]
> Read the [Markdown rendering specification](https://example.com/docs/markdown-rendering/with/a/deliberately/long/path/that/needs/to/wrap) before changing the shared pipeline.

> [!WARNING]
> Review *theme contrast* and narrow layouts before publishing VeryLongUnbrokenCalloutContentThatMustWrapWithoutForcingPageLevelHorizontalScrolling1234567890.

> [!CAUTION]
> Raw HTML and nested callouts are intentionally outside this authoring contract.

> This remains an ordinary quotation and uses the editorial quote treatment.

> [!ALERT]
> Unsupported markers stay visible as ordinary blockquote content.

> [!NOTE] A marker with content on the same line is malformed and also stays visible.
`.trim();

export default function MarkdownCalloutsShowcasePage() {
    return (
        <>
            <title>Markdown Callouts Showcase - Development</title>
            <section className="py-8 md:py-10">
                <Heading1 className="mb-4">Markdown callouts</Heading1>
                <Text className="mb-8 max-w-[72ch]">
                    Development-only review surface for every supported callout, ordinary quotations, and fallback
                    states.
                </Text>
                <MarkdownContent content={showcaseMarkdown} measure />
            </section>
        </>
    );
}
