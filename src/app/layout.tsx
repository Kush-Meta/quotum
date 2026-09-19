import type { Metadata } from "next";
import { Fraunces, Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sans = Syne({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Quotum — Sealed Answer Contracts for AI citation",
    template: "%s · Quotum",
  },
  description:
    "Quotum publishes sealed Answer Contracts — intent-bound, evidence-hashed, Ed25519-signed answer objects for generative engines — then measures Answer Share and citation traffic.",
  metadataBase: new URL(
    process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://quotum.vercel.app"),
  ),
  openGraph: {
    title: "Quotum — Sealed Answer Contracts for AI citation",
    description:
      "Publish intent-bound, Ed25519-sealed answer objects agents can verify and cite. Measure Answer Share and attribution-token traffic.",
    url: "https://quotum.vercel.app",
    siteName: "Quotum",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quotum — Sealed Answer Contracts for AI citation",
    description:
      "Sealed, intent-bound answers for generative engines — with Answer Share measurement.",
  },
  keywords: [
    "Quotum Answer Contracts",
    "Answer Share",
    "generative engine optimization",
    "GEO",
    "AI citation",
    "sealed contracts",
    "Ed25519",
    "agentspace",
    "llms.txt alternative",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
      >
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
