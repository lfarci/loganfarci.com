"use client";
import { useState } from "react";

export default function Home() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOutput([...output, "$ " + command]);
      setCommand("");
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "10px", fontFamily: "monospace" }}>
      <div>
      {output.map((cmd, index) => (
        <div key={index}>{cmd}</div>
      ))}
      </div>
      <span>$ </span>
      <input
      type="text"
      value={command}
      onChange={(e) => setCommand(e.target.value)}
      onKeyDown={handleKeyPress}
      style={{ backgroundColor: "black", color: "white", border: "none", outline: "none" }}
      autoFocus
      />
    </div>
  );
}
