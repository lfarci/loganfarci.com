import { describe, expect, it } from "vitest";

import { mergeClassNames } from "./mergeClassNames";

describe("mergeClassNames", () => {
    it("keeps the last conflicting Tailwind class", () => {
        expect(mergeClassNames("px-2 text-sm", "px-4")).toBe("text-sm px-4");
    });

    it("omits conditional classes that are not enabled", () => {
        expect(mergeClassNames("block", { hidden: false }, null, undefined)).toBe("block");
    });
});
