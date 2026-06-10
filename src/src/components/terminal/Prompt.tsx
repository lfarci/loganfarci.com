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
                className="border-0 bg-surface text-text-primary outline-none"
                autoFocus
            />
        </div>
    );
}
