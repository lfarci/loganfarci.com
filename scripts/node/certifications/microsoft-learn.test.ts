import assert from "node:assert/strict";
import test from "node:test";
import { parseMicrosoftTranscript } from "./microsoft-learn.js";

test("parses Microsoft Learn transcript certifications", () => {
    const credentials = parseMicrosoftTranscript(
        "https://learn.microsoft.com/en-us/users/example/transcript/share-id",
        JSON.stringify({
            certificationData: {
                activeCertifications: [
                    { name: "Microsoft Certified: Azure Developer Associate", dateEarned: "2025-03-28T00:00:00Z" },
                ],
            },
        }),
    );

    assert.deepEqual(credentials, [
        {
            title: "Azure Developer Associate",
            issuer: "Microsoft",
            date: "2025-03-28",
            url: "https://learn.microsoft.com/en-us/users/example/transcript/share-id",
        },
    ]);
});
