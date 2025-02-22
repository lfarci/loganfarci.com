"use client";
import { useState } from "react";
import Prompt from "../components/terminal/Prompt";

export default function Home() {
  const [output, setOutput] = useState<string[]>([]);

  const handleCommandSubmit = (command: string) => {
    if (command === "clear") {
      setOutput([]);
      return;
    }

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
