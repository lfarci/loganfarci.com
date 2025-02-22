"use client";
import { useState } from "react";

function Prompt({ prompt, onCommandSubmit }: { prompt: string, onCommandSubmit: (command: string) => void }) {
  const [command, setCommand] = useState("");

  const onCommandSubmission = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onCommandSubmit(command);
      setCommand("");
    }
  };

  return <div>
    <span>{prompt} </span>
    <input
      type="text"
      value={command}
      onChange={(e) => setCommand(e.target.value)}
      onKeyDown={onCommandSubmission}
      style={{ backgroundColor: "black", color: "white", border: "none", outline: "none" }}
      autoFocus
      />
  </div>;
}

export default function Home() {
  const [output, setOutput] = useState<string[]>([]);

  const handleCommandSubmit = (command: string) => {
    setOutput([...output, "$ " + command]);
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "10px", fontFamily: "monospace" }}>
      <div>
      {output.map((cmd, index) => (
        <div key={index}>{cmd}</div>
      ))}
      </div>
      <Prompt prompt="$" onCommandSubmit={handleCommandSubmit} />
    </div>
  );
}
