import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Tag from "./Tag";

describe("Tag", () => {
    it("reserves a fixed rendered box for its icon", () => {
        render(
            <Tag imageSrc="/images/icon.svg" imageAlt="Test icon">
                Test
            </Tag>,
        );

        const iconClasses = screen.getByRole("img", { name: "Test icon" }).className.split(" ");

        expect(iconClasses).toEqual(expect.arrayContaining(["h-4", "w-4", "shrink-0"]));
    });
});
