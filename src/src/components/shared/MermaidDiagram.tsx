"use client";

import React, { useEffect } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
    className?: string;
    children: React.ReactNode;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ children, className = "" }) => {
    useEffect(() => {
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
        void mermaid.run({ querySelector: ".mermaid" });
    }, [children]);

    return <pre className={`mermaid w-full flex justify-center ${className}`}>{children}</pre>;
};

export default MermaidDiagram;
