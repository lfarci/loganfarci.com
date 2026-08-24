const timeoutMs = 15_000;

export async function fetchPage(url) {
    const response = await fetch(url, {
        headers: { accept: "application/json, text/html" },
        signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return { contentType: response.headers.get("content-type") ?? "", body: await response.text() };
}

function attribute(tag, name) {
    return tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1];
}

export function metadata(html, name) {
    return [...html.matchAll(/<meta\b[^>]*>/gi)]
        .find((match) => {
            const tag = match[0];
            return attribute(tag, "property") === name || attribute(tag, "name") === name;
        })
        ?.at(0)
        .match(/content=["']([^"']+)["']/i)?.[1]
        ?.replaceAll("&amp;", "&")
        .trim();
}

export function extractStructuredData(html) {
    return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap(
        (match) => {
            try {
                const value = JSON.parse(match[1]);
                const entries = Array.isArray(value) ? value : [value];
                return entries.flatMap((entry) => (Array.isArray(entry["@graph"]) ? entry["@graph"] : [entry]));
            } catch {
                return [];
            }
        },
    );
}

export function dateFrom(value) {
    const numeric = value?.match(/(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (numeric) return `${numeric[1]}-${numeric[2].padStart(2, "0")}-${numeric[3].padStart(2, "0")}`;

    const named = value?.match(/([A-Z][a-z]+)\s+(\d{1,2}),\s+(20\d{2})/);
    if (!named) return undefined;

    const month = new Date(`${named[1]} 1, ${named[3]}`).getMonth() + 1;
    return `${named[3]}-${String(month).padStart(2, "0")}-${named[2].padStart(2, "0")}`;
}

export function dateInText(html) {
    return dateFrom(
        metadata(html, "article:published_time") ??
            html.match(
                /(?:issued(?:\s+on)?|earned(?:\s+on)?|date|issuedon|issued_at)\s*[:\-]?\s*(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},\s+20\d{2}|20\d{2}[-/.]\d{1,2}[-/.]\d{1,2})/i,
            )?.[1],
    );
}

export function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);
}
