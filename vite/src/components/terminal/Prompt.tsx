"use client";
import { useState } from "react";

export default function Prompt({
    prompt,
    onCommandSubmit,
}: {
    prompt: string;
    onCommandSubmit: (command: string) => void;
}) {
    const [command, setCommand] = useState("");

    const onCommandSubmission = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onCommandSubmit(command);
            setCommand("");
        }
    };

    return (
        <div>
            <span>{prompt} </span>
            <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={onCommandSubmission}
                style={{ backgroundColor: "black", color: "white", border: "none", outline: "none" }}
                autoFocus
            />
        </div>
    );
}
