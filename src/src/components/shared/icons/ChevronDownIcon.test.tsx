import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ChevronDownIcon from "./ChevronDownIcon";

describe("ChevronDownIcon", () => {
    it("renders a clean stroke-only chevron", () => {
        const { container } = render(<ChevronDownIcon />);
        const icon = container.querySelector("svg");

        expect(container.firstElementChild?.tagName).toBe("svg");
        expect(icon?.getAttribute("fill")).toBe("none");
        expect(icon?.getAttribute("stroke-width")).toBe("2");
    });
});
