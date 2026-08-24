import { dateFrom, dateInText, extractStructuredData, fetchPage, metadata } from "./shared.mjs";

export function parseMicrosoftLearnCredential(url, contentType, body) {
    if (contentType.includes("json")) {
        const data = JSON.parse(body);
        const credential = data.credential ?? data;
        return {
            title: credential.name ?? credential.title,
            issuer: credential.issuer?.name ?? credential.issuer ?? "Microsoft",
            date: dateFrom(credential.issuedOn ?? credential.issueDate ?? credential.date),
            imageUrl: credential.image ?? credential.imageUrl ?? credential.badge?.imageUrl,
            url,
        };
    }

    const structured = extractStructuredData(body).find(
        (value) => value.issuedOn || value.dateIssued || value.datePublished,
    );
    const rawTitle = metadata(body, "og:title") ?? body.match(/<title[^>]*>([^<]+)/i)?.[1]?.trim();
    const title = structured?.name ?? rawTitle?.replace(/^Microsoft Certified:\s*/i, "").trim();

    return title
        ? {
              title,
              issuer: structured?.issuer?.name ?? "Microsoft",
              date:
                  dateFrom(structured?.issuedOn ?? structured?.dateIssued ?? structured?.datePublished) ??
                  dateInText(body),
              imageUrl: structured?.image?.url ?? structured?.image ?? metadata(body, "og:image"),
              url,
          }
        : undefined;
}

export async function readMicrosoftLearnCredential(url) {
    const page = await fetchPage(url);
    return parseMicrosoftLearnCredential(url, page.contentType, page.body);
}
