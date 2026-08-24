import { dateFrom, dateInText, extractStructuredData, fetchPage, metadata } from "./shared.mjs";

export function parseCredlyCredential(url, body) {
    const structured = extractStructuredData(body).find(
        (value) => value.issuedOn || value.dateIssued || value.datePublished,
    );
    const rawTitle = metadata(body, "og:title") ?? body.match(/<title[^>]*>([^<]+)/i)?.[1]?.trim();
    const issuedTitle = rawTitle?.match(/^(.+?)\s+was issued by\s+(.+?)\s+to\s+/i);
    const title = structured?.name ?? issuedTitle?.[1] ?? rawTitle?.replace(/\s+\|\s+Credly$/i, "").trim();

    return title
        ? {
              title,
              issuer: structured?.issuer?.name ?? issuedTitle?.[2] ?? "Credly",
              date:
                  dateFrom(structured?.issuedOn ?? structured?.dateIssued ?? structured?.datePublished) ??
                  dateInText(body),
              imageUrl: structured?.image?.url ?? structured?.image ?? metadata(body, "og:image"),
              url,
          }
        : undefined;
}

export async function readCredlyCredential(url) {
    const page = await fetchPage(url);
    return parseCredlyCredential(url, page.body);
}
