import { describe, it, expect } from "vitest";
import { mockContact, mockContactsData } from "../tools";

mockContactsData();

import { getContacts } from "@/core/data";

describe("getContacts", () => {
    it("returns an array", () => {
        expect(Array.isArray(getContacts())).toBe(true);
    });

    it("returns the mocked contact", () => {
        expect(getContacts()).toHaveLength(1);
    });

    it("returns the correct contact name", () => {
        expect(getContacts()[0].name).toBe(mockContact.name);
    });
});
