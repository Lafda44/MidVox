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

const spaceGrotesk  = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", weight: ["400", "500", "600", "700"] });
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        {/* Fixed aurora background image */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
          <div
            className="absolute inset-0 bg-kenburns"
            style={{
              backgroundImage: "url('/bg-aurora.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            filter: "brightness(0.6) saturate(1.2) hue-rotate(220deg)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 130% 100% at 50% 15%, rgba(5,5,11,0.55) 0%, rgba(5,5,11,0.96) 80%)",
          }}
        />
        </div>
        {/* Ambient glow orbs — fixed, very subtle */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="orb"
            style={{
              width: "700px",
              height: "500px",
              top: "-15%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)",
              animationDuration: "22s",
            }}
          />
          <div
            className="orb"
            style={{
              width: "500px",
              height: "400px",
              top: "40%",
              left: "-10%",
              background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
              animationDuration: "28s",
              animationDelay: "-8s",
            }}
          />
          <div
            className="orb"
            style={{
              width: "480px",
              height: "380px",
              bottom: "-5%",
              right: "-8%",
              background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)",
              animationDuration: "25s",
              animationDelay: "-14s",
            }}
          />
        </div>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
