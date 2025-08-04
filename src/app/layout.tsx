import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./components/SessionProvider";
import ApolloProvider from "./components/ApolloProvider";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bluedit - A Reddit-like Community Platform",
  description: "Share, discuss, and discover content in communities you love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-light-bg text-light-text-primary`}
      >
        <NextAuthProvider>
          <ApolloProvider>
            <nav className="bg-light-fg border-b border-light-border px-6 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-4">
                <Link href="/" className="font-bold text-lg text-brand hover:text-brand/80 transition-colors duration-150">
                  Bluedit
                </Link>
                <Link href="/b/create" className="text-light-text-secondary hover:text-light-text-primary transition-colors duration-150">
                  Create Subbluedit
                </Link>
              </div>
            </nav>
            <main className="min-h-screen bg-light-bg">
              {children}
            </main>
          </ApolloProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
