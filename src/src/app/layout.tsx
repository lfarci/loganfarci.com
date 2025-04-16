import type { Metadata } from "next";
import { Reddit_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logan Farci - Software Engineer",
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
        <NavigationBar title="Logan Farci" />
        <main className="max-w-screen-lg mx-auto px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}