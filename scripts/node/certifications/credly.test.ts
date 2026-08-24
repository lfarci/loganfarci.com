import assert from "node:assert/strict";
import test from "node:test";
import { parseCredlyProfile } from "./credly.js";

test("parses Credly profile badges", () => {
    const credentials = parseCredlyProfile(
        "https://www.credly.com/users/example",
        JSON.stringify({
            data: [
                {
                    id: "badge-id",
                    issued_at_date: "2024-07-22",
                    image_url: "https://images.example/badge.png",
                    issuer: { entities: [{ primary: true, entity: { name: "Scrum.org" } }] },
                    badge_template: { name: "Professional Scrum Developer I" },
                },
            ],
        }),
    );

    assert.deepEqual(credentials, [
        {
            title: "Professional Scrum Developer I",
            issuer: "Scrum.org",
            date: "2024-07-22",
            imageUrl: "https://images.example/badge.png",
            url: "https://www.credly.com/badges/badge-id/public_url",
        },
    ]);
});
