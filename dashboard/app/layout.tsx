/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                                                                  ║
 * ║   ░█▀▀░█▀█░█▀▄░█▀▀░█░█   ░█▀▄░█▀▀░█░█░█▀▀                     ║
 * ║   ░█░░░█░█░█░█░█▀▀░▄▀▄   ░█░█░█▀▀░▀▄▀░▀▀█                     ║
 * ║   ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀   ░▀▀░░▀▀▀░░▀░░▀▀▀                     ║
 * ║                                                                  ║
 * ║           © 2026 CodeX Devs — All Rights Reserved               ║
 * ║                                                                  ║
 * ║   discord  ──  https://discord.gg/codexdev                      ║
 * ║   youtube  ──  https://youtube.com/@CodeXDevs                   ║
 * ║   github   ──  https://github.com/RayExo                        ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Zyrox";

export const metadata: Metadata = {
  title: `${brandName} - Ultimate Discord Bot`,
  description: "Advanced Discord community management and security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased text-slate-200">
        {/* Ambient background: neon-indigo / neon-cyan floating glows */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="orb orb-violet -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[760px]" />
          <div className="orb orb-cyan top-1/3 -left-44 h-[440px] w-[440px] [animation-delay:-5s]" />
          <div className="orb orb-violet bottom-[-10%] -right-44 h-[420px] w-[460px] [animation-delay:-9s]" />
          <div className="orb orb-cyan top-[10%] right-[12%] h-[300px] w-[300px] opacity-70 [animation-delay:-12s]" />
        </div>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
