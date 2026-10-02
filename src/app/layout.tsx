import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { ThemeScript } from "@/components/providers/theme-provider";
import { organizationService } from "@/services/organizations";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SupportBrain AI — AI Customer Support That Knows Your Business",
    template: "%s · SupportBrain AI",
  },
  description:
    "SupportBrain AI is a RAG-enabled multi-agent SaaS platform that turns your website, Facebook Page and documents into an AI customer support agent for every channel.",
  keywords: [
    "AI customer support",
    "RAG",
    "multi-agent",
    "knowledge base",
    "omnichannel",
    "SaaS",
  ],
  applicationName: "SupportBrain AI",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050b1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizations = await organizationService.list();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <AppProviders organizations={organizations}>{children}</AppProviders>
      </body>
    </html>
  );
}
