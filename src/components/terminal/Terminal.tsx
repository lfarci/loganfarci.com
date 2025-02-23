"use client";
import { useState } from "react";
import Prompt from "./Prompt";
import handleCommand from "@/core/Commands";
import "./Terminal.css"; // Import the CSS file

interface IHistoryItem {
    className: string;
    input: string;
    output: string;
}

export default function Terminal() {
    const [history, setHistory] = useState<IHistoryItem[]>([]);

    const clearHistory = () => setHistory([]);

    const appendToHistory = (item: IHistoryItem) => setHistory([...history, item]);

    const handleCommandSubmit = (line: string) => {
        var command = handleCommand(line);

        console.log(command);

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
                        <div>$ {item.input}</div>
                        <div className={item.className}>{item.output}</div>
                    </div>
                ))}
            </div>
            <Prompt prompt="$" onCommandSubmit={handleCommandSubmit} />
        </div>
    );
}