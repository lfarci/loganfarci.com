import assert from "node:assert/strict";
import test from "node:test";
import { parseMicrosoftLearnCredential } from "./microsoft-learn.js";

test("parses Microsoft Learn JSON credential metadata", () => {
    const credential = parseMicrosoftLearnCredential(
        "https://learn.microsoft.com/credentials/example",
        "application/json",
        JSON.stringify({
            credential: {
                name: "Azure Developer Associate",
                issuedOn: "2025-03-28",
                imageUrl: "https://images.example/azure.png",
            },
        }),
    );

    assert.deepEqual(credential, {
        title: "Azure Developer Associate",
        issuer: "Microsoft",
        date: "2025-03-28",
        imageUrl: "https://images.example/azure.png",
        url: "https://learn.microsoft.com/credentials/example",
    });
});
