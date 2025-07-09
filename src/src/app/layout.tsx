import type { Metadata } from "next";
import { Manrope, Reddit_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

const redditMono = Reddit_Mono({
  variable: "--font-reddit-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap"
});


export const metadata: Metadata = {
  title: "Logan Farci - Software Engineer",
  description: "Logan Farci, Software Engineer",
  keywords: ["Software Engineer", "Logan Farci", "Developer", "Brussels", "Belgium"],
};

const githubRepositoryUrl = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY_URL;
const latestCommitHash = process.env.NEXT_PUBLIC_COMMIT_HASH;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${redditMono.variable} ${manrope.variable}`}>
        <Providers>
          <NavigationBar title="Logan Farci" />
          <main className="max-w-screen-lg mx-auto px-6">
            {children}
          </main>
          <hr className="border-t border-gray-300 my-8" />
          <Footer githubRepositoryUrl={githubRepositoryUrl} commitHash={latestCommitHash} />
        </Providers>
      </body>
    </html>
  );
}