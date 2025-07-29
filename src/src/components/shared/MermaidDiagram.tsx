"use client";

import React, { useEffect } from "react";

interface MermaidDiagramProps {
    children: React.ReactNode;
}

export default function MermaidDiagram({ children }: MermaidDiagramProps) {
    useEffect(() => {
        import("mermaid").then((mermaid) => {
            mermaid.default.initialize({ startOnLoad: false, securityLevel: "strict" });
            mermaid.default.run({ querySelector: ".mermaid" });
        });
    }, [children]);

    return <pre className="mermaid">{children}</pre>;
}
