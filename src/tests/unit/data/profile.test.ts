import { describe, it, expect, vi } from "vitest";

vi.mock("@content/data/profile.json", () => ({
    default: {
        role: "Developer",
        introduction: "Hi",
        description: "A developer",
        avatar: { src: "/avatar.png", alt: "avatar" },
    }
}));

import { getProfile } from "@/core/data";

describe("getProfile", () => {
    it("returns an object", () => {
        expect(typeof getProfile()).toBe("object");
    });

    it("returns a non-null value", () => {
        expect(getProfile()).not.toBeNull();
    });

    it("returns the correct role", () => {
        expect(getProfile().role).toBe("Developer");
    });
});
