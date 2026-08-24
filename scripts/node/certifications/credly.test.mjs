import assert from "node:assert/strict";
import test from "node:test";
import { parseCredlyCredential } from "./credly.mjs";

test("parses Credly page metadata", () => {
    const credential = parseCredlyCredential(
        "https://www.credly.com/badges/example/public_url",
        '<meta content="Professional Scrum Developer I was issued by Scrum.org to Logan" property="og:title"><meta content="https://images.example/badge.png" property="og:image"><meta content="July 22, 2024" property="article:published_time">',
    );

    assert.deepEqual(credential, {
        title: "Professional Scrum Developer I",
        issuer: "Scrum.org",
        date: "2024-07-22",
        imageUrl: "https://images.example/badge.png",
        url: "https://www.credly.com/badges/example/public_url",
    });
});
