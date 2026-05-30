import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Prompt from "./Prompt";

describe("Prompt", () => {
    it("submits the current command and clears the input on Enter", () => {
        const onCommandSubmit = vi.fn();

        render(<Prompt prompt="$" onCommandSubmit={onCommandSubmit} />);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "help" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(onCommandSubmit).toHaveBeenCalledWith("help");
        expect((input as HTMLInputElement).value).toBe("");
    });

    it("does not submit when a non-Enter key is pressed", () => {
        const onCommandSubmit = vi.fn();

        render(<Prompt prompt="$" onCommandSubmit={onCommandSubmit} />);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "help" } });
        fireEvent.keyDown(input, { key: "Escape" });

        expect(onCommandSubmit).not.toHaveBeenCalled();
        expect((input as HTMLInputElement).value).toBe("help");
    });
});
