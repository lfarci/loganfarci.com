import { dateFrom, fetchPage } from "./shared.js";
import type { DiscoveredCredential } from "./types.js";

interface CredlyBadge {
    id?: string;
    issued_at_date?: string;
    image_url?: string;
    issuer?: { entities?: Array<{ primary?: boolean; entity?: { name?: string } }> };
    badge_template?: { name?: string; image_url?: string };
}

interface CredlyPage {
    data?: CredlyBadge[];
    metadata?: { next_page_url?: string | null };
}

export function parseCredlyProfile(profileUrl: string, body: string): DiscoveredCredential[] {
    const page = JSON.parse(body) as CredlyPage;
    const origin = new URL(profileUrl).origin;

    return (page.data ?? []).flatMap((badge) => {
        const title = badge.badge_template?.name;
        const id = badge.id;
        if (!title || !id) return [];

        const issuer = badge.issuer?.entities?.find((entity) => entity.primary)?.entity?.name ?? "Credly";
        return [
            {
                title,
                issuer,
                date: dateFrom(badge.issued_at_date),
                imageUrl: badge.image_url ?? badge.badge_template?.image_url,
                url: `${origin}/badges/${id}/public_url`,
            },
        ];
    });
}

function badgesUrl(profileUrl: string): string {
    const profile = new URL(profileUrl);
    profile.pathname = `${profile.pathname.replace(/\/$/, "")}/badges.json`;
    profile.search = "";
    return profile.toString();
}

export async function readCredlyProfile(profileUrl: string): Promise<DiscoveredCredential[]> {
    const credentials: DiscoveredCredential[] = [];
    let url: string | undefined = badgesUrl(profileUrl);

    while (url) {
        const page = await fetchPage(url);
        const parsed = JSON.parse(page.body) as CredlyPage;
        credentials.push(...parseCredlyProfile(profileUrl, page.body));
        url = parsed.metadata?.next_page_url ?? undefined;
    }

    return credentials;
}
