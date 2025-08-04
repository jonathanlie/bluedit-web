import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./components/SessionProvider";
import ApolloProvider from "./components/ApolloProvider";
import { Navbar } from "@/components/ui/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bluedit - Reddit Clone",
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
            <Navbar />
            <main className="min-h-screen bg-light-bg">
              {children}
            </main>
          </ApolloProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
