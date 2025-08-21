import type { Metadata } from "next";
import { Manrope, Noto_Sans, Reddit_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

const redditMono = Reddit_Mono({
    variable: "--font-reddit-mono",
    subsets: ["latin"],
    display: "swap",
    fallback: ["monospace"],
});

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "sans-serif"],
});

const notoSans = Noto_Sans({
    style: "normal",
    variable: "--font-noto-sans",
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
    title: "Logan Farci - Software Engineer",
    description: "Logan Farci, Software Engineer",
    keywords: ["Software Engineer", "Logan Farci", "Developer", "Brussels", "Belgium"],
};

const githubRepositoryUrl = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_URL;
const latestCommitHash = process.env.NEXT_PUBLIC_COMMIT_HASH;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${redditMono.variable} ${manrope.variable} ${notoSans.variable} bg-background text-foreground`}>
                <Providers>
                    <NavigationBar title="Logan Farci" />
                    <main className="max-w-screen-lg mx-auto px-6">{children}</main>
                    <hr className="border-t border-gray-300 dark:border-gray-700 my-8" />
                    <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={latestCommitHash} />
                </Providers>
            </body>
        </html>
    );
}
