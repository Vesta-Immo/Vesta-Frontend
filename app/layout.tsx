import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";
import ThemeRegistry from "@/components/ThemeRegistry";
import { SessionResetProvider } from "@/lib/SessionResetContext";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

// AppNav is injected per-layout (simulation and landing) to allow
// different visual contexts without forcing it globally.
export const metadata: Metadata = {
  title: "Vesta Immo",
  description: "Frontend de simulation immobiliere pour particuliers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeRegistry>
          <SessionResetProvider>
            <AuthProvider>{children}</AuthProvider>
          </SessionResetProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
