import React, { useEffect } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
    className?: string;
    children: React.ReactNode;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ children, className = "" }) => {
    useEffect(() => {
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
        mermaid.run({ querySelector: ".mermaid" }).catch((error) => {
            console.error("Failed to render Mermaid diagram", error);
        });
    }, [children]);

    return <pre className={`mermaid w-full flex justify-center ${className}`}>{children}</pre>;
};

export default MermaidDiagram;
