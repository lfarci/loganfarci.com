import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

// Fontsource font imports (self-hosted, no external requests)
import "@fontsource-variable/manrope";
import "@fontsource/noto-sans";
import "@fontsource/reddit-mono";

// Global styles (Tailwind + theme)
import "./globals.css";

const rootElement = document.getElementById("root")!;

const app = (
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);

if (rootElement.innerHTML.trim()) {
    // Prerendered HTML exists — hydrate it
    ReactDOM.hydrateRoot(rootElement, app);
} else {
    // No prerendered HTML (dev mode) — create fresh root
    ReactDOM.createRoot(rootElement).render(app);
}
