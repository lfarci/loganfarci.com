import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";

// Fontsource font imports (self-hosted, no external requests)
import "@fontsource-variable/manrope";
import "@fontsource/noto-sans";
import "@fontsource/reddit-mono";

// Global styles (Tailwind + theme)
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
