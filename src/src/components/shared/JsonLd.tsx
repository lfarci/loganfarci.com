import type { JsonLdObject } from "@/core/seo";

interface JsonLdProps {
    data: JsonLdObject | JsonLdObject[];
}

const escapeJsonForHtml = (json: string): string =>
    json
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");

export default function JsonLd({ data }: Readonly<JsonLdProps>) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: escapeJsonForHtml(JSON.stringify(data)) }}
        />
    );
}
