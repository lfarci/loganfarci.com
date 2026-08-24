import { dateFrom, dateInText, extractStructuredData, fetchPage, imageUrl, issuerName, metadata } from "./shared.js";
import type { DiscoveredCredential } from "./types.js";

export function parseCredlyCredential(url: string, body: string): DiscoveredCredential | undefined {
    const structured = extractStructuredData(body).find(
        (value) => value.issuedOn || value.dateIssued || value.datePublished,
    );
    const rawTitle = metadata(body, "og:title") ?? body.match(/<title[^>]*>([^<]+)/i)?.[1]?.trim();
    const issuedTitle = rawTitle?.match(/^(.+?)\s+was issued by\s+(.+?)\s+to\s+/i);
    const title = structured?.name ?? issuedTitle?.[1] ?? rawTitle?.replace(/\s+\|\s+Credly$/i, "").trim();

    return title
        ? {
              title,
              issuer: issuerName(structured?.issuer) ?? issuedTitle?.[2] ?? "Credly",
              date:
                  dateFrom(structured?.issuedOn ?? structured?.dateIssued ?? structured?.datePublished) ??
                  dateInText(body),
              imageUrl: imageUrl(structured?.image) ?? metadata(body, "og:image"),
              url,
          }
        : undefined;
}

export async function readCredlyCredential(url: string): Promise<DiscoveredCredential | undefined> {
    const page = await fetchPage(url);
    return parseCredlyCredential(url, page.body);
}
