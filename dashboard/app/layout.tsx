/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║   © 2026 CodeX Devs — All Rights Reserved                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-provider";

const spaceGrotesk  = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", weight: ["400","500","600","700"] });
const plusJakarta   = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox";

export const metadata: Metadata = {
  title: `${brandName} — Discord Bot`,
  description: "Security, leveling, tickets, and more. One dashboard — no commands required.",
  openGraph: {
    title: `${brandName} — Discord Bot`,
    description: "Security, leveling, tickets, and more. One dashboard — no commands required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans bg-[#0C0C0C] text-[#F5F5F5]">
        {/* Subtle grid background */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-20 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#252525 1px, transparent 1px), linear-gradient(90deg, #252525 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 20%, transparent 80%)",
          }}
        />
        {/* Amber glow top center */}
        <div
          aria-hidden
          className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 -z-10"
          style={{
            width: "900px",
            height: "500px",
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.065) 0%, transparent 70%)",
          }}
        />
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
