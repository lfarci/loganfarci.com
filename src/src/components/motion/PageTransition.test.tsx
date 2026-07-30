import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import PageTransition from "./PageTransition";

describe("PageTransition", () => {
    it("does not clip content that extends into the article gutter", () => {
        const { container } = render(
            <MemoryRouter>
                <PageTransition>
                    <div>Article content</div>
                </PageTransition>
            </MemoryRouter>,
        );

        expect(container.firstElementChild?.classList.contains("overflow-x-clip")).toBe(false);
    });
});
