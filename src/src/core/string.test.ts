import { describe, expect, it } from "vitest";

import { createId } from "./string";

describe("createId", () => {
    it("normalizes mixed-case text with spaces into a lowercase slug", () => {
        expect(createId("Hello World")).toBe("hello-world");
        expect(createId("foo  bar")).toBe("foo-bar");
    });

    it("preserves already-normalized ids", () => {
        expect(createId("already-fine")).toBe("already-fine");
    });

    it("trims leading and trailing whitespace", () => {
        expect(createId("  hello")).toBe("hello");
        expect(createId("hello  ")).toBe("hello");
    });

    it("returns an empty string for empty input", () => {
        expect(createId("")).toBe("");
    });

    it("throws when called with null", () => {
        expect(() => createId(null as unknown as string)).toThrow();
    });
});
