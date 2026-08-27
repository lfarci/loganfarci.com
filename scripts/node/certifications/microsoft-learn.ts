import { fetchPage, metadata } from "./shared.js";
import type { DiscoveredCredential } from "./types.js";

interface MicrosoftTranscript {
    userName?: string;
    certificationData?: {
        activeCertifications?: MicrosoftCertification[];
        historicalCertifications?: MicrosoftCertification[];
    };
    appliedSkillsData?: { appliedSkillsCredentials?: MicrosoftAppliedSkill[] };
}

interface MicrosoftCertification {
    name?: string;
    dateEarned?: string;
}

interface MicrosoftAppliedSkill {
    credentialId?: string;
    title?: string;
    awardedOn?: string;
}

function transcriptId(profileUrl: string): string {
    const id = new URL(profileUrl).pathname.match(/\/transcript\/([^/]+)/)?.[1];
    if (!id) throw new Error("Microsoft Learn profile URL must contain a transcript ID");
    return id;
}

function transcriptUrl(profileUrl: string): string {
    const profile = new URL(profileUrl);
    return `${profile.origin}/api/profiles/transcript/share/${transcriptId(profileUrl)}?locale=en-us`;
}

function microsoftTitle(title: string): string {
    return title.replace(/^Microsoft Certified:\s*/i, "");
}

export function parseMicrosoftTranscript(profileUrl: string, body: string): DiscoveredCredential[] {
    const transcript = JSON.parse(body) as MicrosoftTranscript;
    return [
        ...(transcript.certificationData?.activeCertifications ?? []),
        ...(transcript.certificationData?.historicalCertifications ?? []),
    ].flatMap((certification) => {
        if (!certification.name || !certification.dateEarned) return [];
        return [
            {
                title: microsoftTitle(certification.name),
                issuer: "Microsoft",
                date: certification.dateEarned.slice(0, 10),
                url: profileUrl,
            },
        ];
    });
}

export async function readMicrosoftLearnProfile(profileUrl: string): Promise<DiscoveredCredential[]> {
    const transcriptPage = await fetchPage(transcriptUrl(profileUrl));
    const transcript = JSON.parse(transcriptPage.body) as MicrosoftTranscript;
    const credentials = parseMicrosoftTranscript(profileUrl, transcriptPage.body);
    const shareId = transcriptId(profileUrl);

    for (const skill of transcript.appliedSkillsData?.appliedSkillsCredentials ?? []) {
        if (!skill.credentialId || !skill.title || !skill.awardedOn || !transcript.userName) continue;

        const credentialUrl = `https://learn.microsoft.com/api/credentials/share/en-us/${transcript.userName}/${skill.credentialId}?sharingId=${shareId}`;
        const credentialPage = await fetchPage(credentialUrl);
        credentials.push({
            title: skill.title,
            issuer: "Microsoft",
            date: skill.awardedOn.slice(0, 10),
            imageUrl: metadata(credentialPage.body, "og:image"),
            url: credentialUrl,
        });
    }

    return credentials;
}
