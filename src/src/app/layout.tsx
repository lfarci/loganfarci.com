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
        <div className="max-w-screen-lg mx-auto px-4">
          {children}
        </div>
        <hr className="border-t border-gray-300 my-8" />
        <footer className="text-center mt-8">
          © 2023 Logan Farci. All rights reserved.
        </footer>
      </body>
    </html>
  );
}