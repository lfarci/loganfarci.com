"use client";
import { useState, useEffect, useRef } from "react";

import Prompt from "./Prompt";
import History from "./history/History";
import { IHistoryItem } from "./history/History";

import handleCommand from "@/core/Commands";
import "./Terminal.css"; // Import the CSS file

const welcomeMessage = "Welcome my website! Type 'help' to see a list of commands.";
const defaultItems: IHistoryItem[] = [{ type: "welcomeMessage", input: null, output: welcomeMessage }];

const dollar = "$";

export default function Terminal() {
    const [history, setHistory] = useState<IHistoryItem[]>(defaultItems);
    const terminalRef = useRef<HTMLDivElement>(null);

    const clearHistory = () => setHistory([]);

    const appendToHistory = (item: IHistoryItem) => setHistory([...history, item]);

    const handleCommandSubmit = (line: string) => {
        var command = handleCommand(line);

        if (command.hasError) {
            appendToHistory({ type: "commandError", input: line, output: command.error ?? "" });
            return;
        }
        
        if (command.clear) {
            clearHistory();
            return;
        }

        appendToHistory({ type: "commandOutput", input: line, output: command.output });
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    return (
        <div ref={terminalRef} style={{ backgroundColor: "black", color: "white", padding: "10px", fontFamily: "monospace", height: "100vh", overflowY: "auto" }}>
            <History prompt={dollar} history={history} />
            <Prompt prompt={dollar} onCommandSubmit={handleCommandSubmit} />
        </div>
    );
}