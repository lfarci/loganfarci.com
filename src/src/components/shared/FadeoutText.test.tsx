import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FadeoutText from "./FadeoutText";

describe("FadeoutText", () => {
    it("fades into the elevated card surface", () => {
        const { container } = render(<FadeoutText>Preview text</FadeoutText>);

        expect(container.querySelector(".to-surface-elevated")).toBeTruthy();
    });
});
