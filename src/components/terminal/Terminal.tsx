"use client";
import { useState } from "react";
import Prompt from "./Prompt";
import handleCommand from "@/core/Commands";
import "./Terminal.css"; // Import the CSS file

interface IHistoryItem {
    className: string;
    input?: string;
    output: string;
}

const welcomeMessage = "Welcome my website! Type 'help' to see a list of commands.";
const defaultItems: IHistoryItem[] = [{ className: "output", input: null, output: welcomeMessage }];

const dollar = "$";

export default function Terminal() {
    const [history, setHistory] = useState<IHistoryItem[]>(defaultItems);

    const clearHistory = () => setHistory([]);

    const appendToHistory = (item: IHistoryItem) => setHistory([...history, item]);

    const handleCommandSubmit = (line: string) => {
        var command = handleCommand(line);

        if (command.hasError) {
            appendToHistory({ className: "error", input: line, output: command.error ?? "" });
            return;
        }
        
        if (command.clear) {
            clearHistory();
            return;
        }

        appendToHistory({ className: "output", input: line, output: command.output });
    };

    return (
        <div style={{ backgroundColor: "black", color: "white", padding: "10px", fontFamily: "monospace" }}>
            <div>
                {history.map((item, index) => (
                    <div key={index}>
                        {item.input !== null && <div>{dollar} {item.input}</div>}
                        <div className={item.className}>{item.output}</div>
                    </div>
                ))}
            </div>
            <Prompt prompt={dollar} onCommandSubmit={handleCommandSubmit} />
        </div>
    );
}