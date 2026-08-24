import { dateFrom, dateInText, extractStructuredData, fetchPage, imageUrl, issuerName, metadata } from "./shared.js";
import type { DiscoveredCredential, StructuredCredential } from "./types.js";

export function parseMicrosoftLearnCredential(
    url: string,
    contentType: string,
    body: string,
): DiscoveredCredential | undefined {
    if (contentType.includes("json")) {
        const data = JSON.parse(body) as StructuredCredential & { credential?: StructuredCredential };
        const credential = data.credential ?? data;
        const title = credential.name ?? credential.title;

        return title
            ? {
                  title,
                  issuer: issuerName(credential.issuer) ?? "Microsoft",
                  date: dateFrom(credential.issuedOn ?? credential.issueDate ?? credential.date),
                  imageUrl: imageUrl(credential.image) ?? credential.imageUrl ?? credential.badge?.imageUrl,
                  url,
              }
            : undefined;
    }

    const structured = extractStructuredData(body).find(
        (value) => value.issuedOn || value.dateIssued || value.datePublished,
    );
    const rawTitle = metadata(body, "og:title") ?? body.match(/<title[^>]*>([^<]+)/i)?.[1]?.trim();
    const title = structured?.name ?? rawTitle?.replace(/^Microsoft Certified:\s*/i, "").trim();

    return title
        ? {
              title,
              issuer: issuerName(structured?.issuer) ?? "Microsoft",
              date:
                  dateFrom(structured?.issuedOn ?? structured?.dateIssued ?? structured?.datePublished) ??
                  dateInText(body),
              imageUrl: imageUrl(structured?.image) ?? metadata(body, "og:image"),
              url,
          }
        : undefined;
}

export async function readMicrosoftLearnCredential(url: string): Promise<DiscoveredCredential | undefined> {
    const page = await fetchPage(url);
    return parseMicrosoftLearnCredential(url, page.contentType, page.body);
}
