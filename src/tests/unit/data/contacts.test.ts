import { describe, it, expect, vi } from "vitest";

vi.mock("@content/data/contacts.json", () => ({
    default: [{
        name: "GitHub",
        icon: "/github.svg",
        url: "https://github.com/test",
    }]
}));

import { getContacts } from "@/core/data";

describe("getContacts", () => {
    it("returns an array", () => {
        expect(Array.isArray(getContacts())).toBe(true);
    });

    it("returns the mocked contact", () => {
        expect(getContacts()).toHaveLength(1);
    });

    it("returns the correct contact name", () => {
        expect(getContacts()[0].name).toBe("GitHub");
    });
});
