import type { Metadata } from "next";
import { Reddit_Mono } from "next/font/google";
import "./globals.css";

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lfarci",
  description: "Logan Farci, Software Engineer",
  keywords: ["Software Engineer", "Logan Farci", "Developer", "Brussels", "Belgium"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${redditMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
