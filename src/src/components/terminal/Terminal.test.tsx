import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/core/Commands", () => ({
    default: vi.fn(),
}));

import handleCommand from "@/core/Commands";
import Terminal from "./Terminal";

type MockCommandResult = ReturnType<typeof handleCommand>;

const commandResult = (overrides: Partial<MockCommandResult> = {}): MockCommandResult =>
    ({
        hasError: false,
        error: null,
        clear: false,
        output: "",
        ...overrides,
    }) as MockCommandResult;

describe("Terminal", () => {
    it("appends command output to the history", () => {
        vi.mocked(handleCommand).mockReturnValue(commandResult({ output: "Command output" }));

        render(<Terminal />);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "help" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(handleCommand).toHaveBeenCalledWith("help");
        expect(screen.getByText("Command output")).toBeTruthy();
    });

    it("renders command errors returned by the command handler", () => {
        vi.mocked(handleCommand).mockReturnValue(commandResult({ hasError: true, error: "Unknown command" }));

        render(<Terminal />);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "unknown" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(screen.getByText("Unknown command")).toBeTruthy();
    });

    it("clears previously rendered history when the clear command is returned", () => {
        vi.mocked(handleCommand)
            .mockReturnValueOnce(commandResult({ output: "First output" }))
            .mockReturnValueOnce(commandResult({ clear: true }));

        render(<Terminal />);

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "help" } });
        fireEvent.keyDown(input, { key: "Enter" });
        expect(screen.getByText("First output")).toBeTruthy();

        fireEvent.change(input, { target: { value: "clear" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(screen.queryByText("First output")).toBeNull();
        expect(screen.queryByText(/Welcome my website!/i)).toBeNull();
    });
});
