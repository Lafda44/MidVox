"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Activity, ArrowRight, Ban, BarChart4, Bot, CheckCircle2, ChevronRight,
  Download, Gavel, Globe, History, LayoutDashboard, Lock, LogIn, Mail,
  Menu, MessageSquare, Server, Shield, ShieldAlert, ShieldCheck, Sparkles,
  Ticket, Trophy, User, Users2, X, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox";

/* ── Shared accent palette (Tech-Noir) ──────────────────────────────────── */
const ACCENTS = {
  primary:  { text: "text-[#c0c1ff]", chip: "bg-[#c0c1ff]/15 border-[#c0c1ff]/40 text-[#c0c1ff]", border: "border-[#c0c1ff]/40", bar: "bg-[#c0c1ff]/50", line: "#c0c1ff", glow: "shadow-[0_0_10px_#c0c1ff]" },
  secondary:{ text: "text-[#4cd7f6]", chip: "bg-[#4cd7f6]/15 border-[#4cd7f6]/40 text-[#4cd7f6]", border: "border-[#4cd7f6]/40", bar: "bg-[#4cd7f6]/50", line: "#4cd7f6", glow: "shadow-[0_0_10px_#4cd7f6]" },
  tertiary: { text: "text-[#b76dff]", chip: "bg-[#b76dff]/15 border-[#b76dff]/40 text-[#b76dff]", border: "border-[#b76dff]/40", bar: "bg-[#b76dff]/50", line: "#b76dff", glow: "shadow-[0_0_10px_#b76dff]" },
  error:    { text: "text-[#ffb4ab]", chip: "bg-[#ffb4ab]/15 border-[#ffb4ab]/40 text-[#ffb4ab]", border: "border-[#ffb4ab]/40", bar: "bg-[#ffb4ab]/50", line: "#ffb4ab", glow: "shadow-[0_0_10px_#ffb4ab]" },
  amber:    { text: "text-[#fbbf24]", chip: "bg-[#fbbf24]/15 border-[#fbbf24]/40 text-[#fbbf24]", border: "border-[#fbbf24]/40", bar: "bg-[#fbbf24]/50", line: "#fbbf24", glow: "shadow-[0_0_10px_#fbbf24]" },
} as const;

/* ── Motion helpers ─────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const RISE = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Header ─────────────────────────────────────────────────────────────── */
function Header({ navOpen, setNavOpen }: { navOpen: boolean; setNavOpen: (v: boolean) => void }) {
  const navLinks: [string, string][] = [
    ["Modules", "#modules"],
    ["How it works", "#how"],
    ["Features", "#features"],
    ["FAQ", "#faq"],
  ];

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed top-0 w-full z-50 glass-nav"
    >
      <div className="flex justify-between items-center px-4 md:px-16 py-4 max-w-[1280px] mx-auto">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#c0c1ff]/10 border border-[#c0c1ff]/30 border-glow-noir">
            <Bot className="h-[20px] w-[20px] text-[#c0c1ff]" />
          </div>
          <span className="font-display text-[24px] font-bold text-white tracking-widest">{BRAND}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map(([label, href], i) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "font-mono text-[14px] tracking-widest uppercase transition-colors font-bold relative group cursor-pointer",
                i === 0 ? "text-[#c0c1ff]" : "text-[#E2E8F0] hover:text-white"
              )}
            >
              {label}
              <span
                className={cn(
                  "absolute -bottom-1.5 left-0 w-full h-[2px] bg-gradient-to-r from-[#c0c1ff] to-transparent transition-opacity duration-300",
                  i === 0 ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="bg-[#6366F1] text-white font-mono text-[14px] px-6 py-2.5 rounded-lg transition-all scale-95 hover:scale-100 active:scale-95 btn-glow btn-sheen-auto btn-pulse-ring shadow-[0_0_20px_rgba(99,102,241,0.4)] tracking-widest uppercase"
          >
            Open Dashboard
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setNavOpen(!navOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            {navOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      {navOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-[#0a0a0f]/95 p-3 backdrop-blur-xl">
          {navLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setNavOpen(false)}
              className="block rounded-xl px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
            className="mt-2 w-full rounded-lg bg-[#6366F1] px-4 py-3 font-mono text-[13px] uppercase tracking-widest text-white btn-glow"
          >
            Sign In / Open Dashboard
          </button>
        </div>
      )}
    </motion.header>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  const stats = [
    ["120+ servers", "and growing"],
    ["18 modules", "out of the box"],
    ["< 50ms latency", "avg response"],
    ["Free forever", "core features"],
  ];

  return (
    <section className="relative w-full pt-44 pb-32 z-10 flex flex-col items-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute inset-0 cyber-grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]" />
        <div className="aurora-beam indigo" style={{ top: "-12%", left: "6%", animationDelay: "0s" }} />
        <div className="aurora-beam violet" style={{ top: "2%", left: "34%", animationDelay: "-3s" }} />
        <div className="aurora-beam cyan" style={{ top: "10%", left: "58%", animationDelay: "-6s" }} />
        <div className="cyber-orb" style={{ width: 420, height: 420, top: -96, left: "8%", background: "rgba(99,102,241,0.35)" }} />
        <div className="cyber-orb" style={{ width: 340, height: 340, top: "32%", right: "4%", background: "rgba(183,109,255,0.3)", animationDelay: "-5s" }} />
        <div className="cyber-orb" style={{ width: 260, height: 260, top: "10%", left: "52%", background: "rgba(76,215,246,0.25)", animationDelay: "-9s" }} />
      </div>
      <div className="bg-glow-indigo top-0 left-1/3" />
      <div className="bg-glow-violet top-20 right-1/3" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } } }}
        className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-16 flex flex-col items-center w-full"
      >
        <motion.h1 variants={RISE} className="font-display text-[48px] md:text-[80px] leading-[1.0] text-white max-w-5xl mb-8 font-bold tracking-tighter">
          Your server needs one bot. <br />
          <span className="text-gradient-noir animate-text-shimmer">Not fifteen.</span>
        </motion.h1>

        <motion.p variants={RISE} className="font-sans text-[20px] text-[#c7c4d7] max-w-3xl mb-12 leading-relaxed">
          Anti-nuke, automod, leveling, tickets, and Instagram media — all in one bot,
          configured from a single fast dashboard.
        </motion.p>

        <motion.div variants={RISE} className="flex flex-col sm:flex-row gap-6 mb-20 w-full sm:w-auto relative z-20">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
            className="bg-[#6366F1] hover:bg-indigo-500 text-white font-mono text-[16px] px-10 py-5 rounded-lg transition-all flex items-center justify-center gap-3 btn-glow btn-sheen-auto btn-pulse-ring shadow-[0_0_30px_rgba(99,102,241,0.6)] tracking-widest uppercase"
          >
            <LayoutDashboard className="h-[24px] w-[24px]" />
            Open Dashboard
          </motion.button>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="#modules"
              className="glass-card hover:bg-white/10 text-white font-mono text-[16px] px-10 py-5 rounded-lg transition-all flex items-center justify-center gap-3 tracking-widest uppercase border-white/20"
            >
              See what&apos;s inside
              <ArrowRight className="h-[24px] w-[24px]" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={RISE} className="flex flex-wrap justify-center gap-10 md:gap-16 opacity-90 relative z-20">
          {stats.map(([v, l], i) => (
            <div key={v} className="flex items-center gap-10 md:gap-16">
              {i > 0 && <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-[#c0c1ff]/30 to-transparent" />}
              <div className="flex flex-col items-center">
                <span className="font-display text-[32px] text-white">{v}</span>
                <span className="font-mono text-[12px] text-[#c0c1ff] tracking-widest uppercase mt-2">{l}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Dashboard mockup ───────────────────────────────────────────────────── */
type View = "overview" | "security" | "leveling" | "tickets";

const LOGS = [
  { tag: "SHIELD",    tone: "text-[#c0c1ff]", text: "Anti-Nuke armed — 18 modules online" },
  { tag: "AUTOMOD",   tone: "text-[#4cd7f6]", text: "Deleted spam in #general (score 97)" },
  { tag: "ANTINUKE",  tone: "text-[#ffb4ab]", text: "Blocked role-delete by @mallory#1337" },
  { tag: "VERIFY",    tone: "text-[#4cd7f6]", text: "@nova passed gateway in 1.8s" },
  { tag: "TICKETS",   tone: "text-[#b76dff]", text: "Ticket #42 opened by @rayexo" },
  { tag: "LEVELING",  tone: "text-[#fbbf24]", text: "@kira reached level 24, role granted" },
];

const FEED = [
  { icon: Ban,      tone: "text-[#ffb4ab] bg-[#ffb4ab]/10 border-[#ffb4ab]/20", bar: "bg-[#ffb4ab] shadow-[0_0_10px_#ffb4ab]", text: <>Anti-Spam+ deleted 3 messages in <span className="text-[#c0c1ff]">#general</span></>, time: "2m ago" },
  { icon: Download, tone: "text-[#4cd7f6] bg-[#4cd7f6]/10 border-[#4cd7f6]/20", bar: "bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6]", text: <>Instagram reel saved from <span className="text-[#c0c1ff]">#media</span></>, time: "5m ago" },
  { icon: Ticket,   tone: "text-[#c0c1ff] bg-[#c0c1ff]/10 border-[#c0c1ff]/20", bar: "bg-[#c0c1ff] shadow-[0_0_10px_#c0c1ff]", text: <>Ticket #42 opened by <span className="text-[#b76dff]">@rayexo</span></>, time: "11m ago" },
];

function DashboardMockup({ view, setView }: { view: View; setView: (v: View) => void }) {
  const views: { key: View; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "security", label: "Security", icon: ShieldCheck },
    { key: "leveling", label: "Leveling", icon: BarChart4 },
    { key: "tickets",  label: "Tickets",  icon: Ticket },
  ];

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, []);
  const incomingLog = LOGS[tick % LOGS.length];
  const logTail = Array.from({ length: LOGS.length - 1 }, (_, i) => LOGS[(tick + i + 1) % LOGS.length]);

  const bars = [
    { h: 25, cls: "bg-[#34343c]/40 border-white/5" },
    { h: 50, cls: "bg-[#34343c]/40 border-white/5" },
    { h: 33, cls: "bg-[#34343c]/40 border-white/5" },
    { h: 75, cls: "bg-[#34343c]/40 border-white/5" },
    { h: 50, cls: "bg-[#34343c]/40 border-white/5" },
    { h: 80, cls: "bg-[#b76dff]/20 border-[#b76dff]/40 shadow-[0_0_20px_rgba(183,109,255,0.2)]", top: "bg-[#b76dff] shadow-[0_0_10px_#b76dff]" },
    { h: 100, cls: "bg-[#c0c1ff]/30 border-[#c0c1ff]/50 shadow-[0_0_30px_rgba(192,193,255,0.3)]", top: "bg-[#c0c1ff] shadow-[0_0_15px_#c0c1ff]" },
    { h: 90, cls: "bg-[#4cd7f6]/30 border-[#4cd7f6]/50 shadow-[0_0_30px_rgba(76,215,246,0.3)]", top: "bg-[#4cd7f6] shadow-[0_0_15px_#4cd7f6]" },
  ];

  const ranks = [
    { name: "rayexo", xp: "12,840", pct: 92 },
    { name: "kira", xp: "11,205", pct: 81 },
    { name: "nova", xp: "9,478", pct: 68 },
    { name: "ash", xp: "7,112", pct: 52 },
  ];

  const tickets_ = [
    { id: "#42", sub: "API rate limit bug", status: "Open", cls: "text-[#4cd7f6] bg-[#4cd7f6]/10 border-[#4cd7f6]/25" },
    { id: "#41", sub: "Invite link request", status: "Closed", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25" },
    { id: "#40", sub: "Premium refund", status: "In Progress", cls: "text-[#b76dff] bg-[#b76dff]/10 border-[#b76dff]/25" },
  ];

  return (
    <section className="relative w-full py-16 mb-20 z-20 -mt-10">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="glass-panel dashboard-glow rounded-2xl overflow-hidden border border-[#c0c1ff]/20 relative z-10">
          {/* browser chrome */}
          <div className="bg-[#34343c]/80 flex items-center px-6 py-4 border-b border-white/10 gap-4 backdrop-blur-md">
            <div className="flex gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffb4ab] border border-[#ffb4ab]/50 shadow-[0_0_10px_rgba(255,180,171,0.5)]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#4cd7f6] border border-[#4cd7f6]/50 shadow-[0_0_10px_rgba(76,215,246,0.5)]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#c0c1ff] border border-[#c0c1ff]/50 shadow-[0_0_10px_rgba(192,193,255,0.5)]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-[#0e0d15]/50 border border-white/10 px-10 md:px-48 py-1.5 rounded-md flex items-center gap-2">
                <Lock className="h-[14px] w-[14px] text-[#c0c1ff]/70" />
                <span className="font-mono text-[11px] tracking-widest text-[#c7c4d7] font-medium">{BRAND.toLowerCase()}.app/dashboard</span>
              </div>
            </div>
          </div>

          {/* dashboard content */}
          <div className="flex h-auto md:h-[650px] relative">
            {/* sidebar */}
            <div className="hidden md:flex w-64 bg-[#0e0d15]/40 border-r border-white/5 p-6 flex-col gap-8 relative z-10 backdrop-blur-xl">
              <div className="flex items-center gap-3 px-2">
                <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#c0c1ff]/20 border border-[#c0c1ff]/50 border-glow-noir">
                  <Bot className="h-[20px] w-[20px] text-[#c0c1ff]" />
                </div>
                <span className="font-display text-[24px] font-bold text-white tracking-tighter">{BRAND}</span>
              </div>

              <div className="flex flex-col gap-2">
                {views.map((v) => {
                  const active = v.key === view;
                  return (
                    <button
                      key={v.key}
                      onClick={() => setView(v.key)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                        active
                          ? "bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] shadow-[inset_0_0_20px_rgba(192,193,255,0.05)]"
                          : "text-[#c7c4d7] hover:bg-white/5 hover:text-white border border-transparent"
                      )}
                    >
                      <v.icon className="h-[20px] w-[20px]" />
                      <span className="font-mono text-[13px] tracking-widest uppercase font-bold">{v.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto glass-card border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-[#c0c1ff]/30 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-[#b76dff] flex items-center justify-center font-bold text-white text-[16px] shadow-[0_0_15px_rgba(183,109,255,0.4)] border border-white/20">R</div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[14px] text-white font-medium">rayexo</span>
                    <span className="font-mono text-[10px] text-[#c0c1ff] tracking-widest uppercase mt-0.5">Admin</span>
                  </div>
                </div>
                <ChevronRight className="h-[20px] w-[20px] text-[#c7c4d7] rotate-90" />
              </div>
            </div>

            {/* main area */}
            <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex-1 p-6 md:p-8 flex flex-col gap-6 relative z-10"
            >
              {view === "overview" && (
                <>
                  {/* stats row */}
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { label: "Guilds", value: "128", acc: ACCENTS.primary },
                      { label: "Members", value: "48,213", acc: ACCENTS.secondary },
                      { label: "Latency", value: "34", suffix: "ms", acc: ACCENTS.tertiary },
                    ].map((s) => (
                      <motion.div
                        key={s.label}
                        whileHover={{ y: -4 }}
                        className="glass-card border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-[#c0c1ff]/40 transition-all duration-300"
                      >
                        <div className={cn("absolute top-0 left-0 w-1 h-full group-hover:bg-current transition-colors", s.acc.bar, s.acc.glow)} />
                        <span className={cn("font-mono text-[12px] tracking-widest uppercase font-bold", s.acc.text)}>{s.label}</span>
                        <div className="font-display text-[40px] mt-2 text-white font-bold tracking-tight">
                          {s.value}
                          {s.suffix && <span className="text-[24px] text-[#c7c4d7] font-medium">{s.suffix}</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* chart */}
                  <div className="glass-card border-white/10 rounded-xl p-6 flex-1 flex flex-col relative overflow-hidden min-h-[220px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0c1ff]/5 rounded-full blur-3xl" />
                    <div className="flex justify-between items-center mb-8 relative z-10">
                      <span className="font-mono text-[12px] text-[#c7c4d7] tracking-widest uppercase font-bold flex items-center gap-2">
                        <Activity className="h-[16px] w-[16px] text-[#c0c1ff]" />
                        Message Volume
                      </span>
                      <div className="px-3 py-1 rounded bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 text-[#4cd7f6] font-mono text-[11px] tracking-widest shadow-[0_0_10px_rgba(76,215,246,0.2)]">
                        +12.4%
                      </div>
                    </div>
                    <div className="flex-1 flex items-end gap-3 pb-4 relative z-10">
                      {bars.map((b, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.85, delay: 0.35 + i * 0.07, ease: EASE }}
                          style={{ height: `${b.h}%` }}
                          className={cn("w-full rounded-t border relative origin-bottom", b.cls, b.top && "bar-live")}
                        >
                          {b.top && <div className={cn("absolute top-0 left-0 w-full h-1", b.top)} />}
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {view === "security" && (
                <div className="flex flex-col gap-2 font-mono text-[11px] leading-[1.9]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={tick}
                      initial={{ opacity: 0, x: -10, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-baseline gap-2.5 rounded-lg border border-[#4cd7f6]/25 bg-[#4cd7f6]/[0.05] px-3 py-2.5">
                        <span className="text-[#4cd7f6]/50 shrink-0 select-none">›</span>
                        <span className={cn("font-bold shrink-0 min-w-[68px]", incomingLog.tone)}>{incomingLog.tag}</span>
                        <span className="text-[#c7c4d7]/70">{incomingLog.text}</span>
                        <span className="typing-caret ml-1" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  {logTail.map((l, i) => (
                    <div key={i} className="flex items-baseline gap-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 opacity-80">
                      <span className="text-[#c7c4d7]/30 shrink-0 select-none">›</span>
                      <span className={cn("font-bold shrink-0 min-w-[68px]", l.tone)}>{l.tag}</span>
                      <span className="text-[#c7c4d7]/70">{l.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {view === "leveling" && (
                <div className="flex flex-col gap-2">
                  {ranks.map((r, i) => (
                    <div key={r.name} className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={cn(
                          "flex h-5 w-5 items-center justify-center rounded font-mono text-[9px] font-bold",
                          i === 0 ? "bg-[#c0c1ff]/80 text-white" : "bg-white/[0.06] text-[#c7c4d7]/30"
                        )}>{i + 1}</span>
                        <span className="text-[10px] font-semibold text-white/70">{r.name}</span>
                        <span className="ml-auto font-mono text-[9px] text-[#c7c4d7]/40">{r.xp} XP</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.07] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${r.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.15 + i * 0.15, ease: EASE }}
                          className="h-full rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#b76dff]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {view === "tickets" && (
                <div className="flex flex-col gap-1.5">
                  {tickets_.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                      <span className="font-mono text-[10px] font-bold text-[#c0c1ff]">{t.id}</span>
                      <span className="flex-1 text-[10px] text-white/50 truncate">{t.sub}</span>
                      <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[8px] font-semibold", t.cls)}>{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* module status pill */}
        <div className="absolute bottom-8 left-8 glass-card border-[#c0c1ff]/30 rounded-full px-5 py-2.5 flex items-center gap-4 border-glow-noir bg-[#0a0a0f]/80 backdrop-blur-xl z-20 hidden lg:flex">
          <div className="flex items-center gap-3">
            <span className="status-live w-2.5 h-2.5 rounded-full bg-[#4cd7f6] animate-pulse shadow-[0_0_10px_#4cd7f6]" />
            <span className="font-mono text-[13px] text-white tracking-widest uppercase font-bold">18 modules online</span>
          </div>
          <span className="font-mono text-[11px] bg-[#4cd7f6]/20 text-[#4cd7f6] px-2.5 py-1 rounded border border-[#4cd7f6]/30 uppercase tracking-widest shadow-[0_0_10px_rgba(76,215,246,0.2)]">Live</span>
        </div>
      </div>
    </section>
  );
}

/* ── Real-time security ops ─────────────────────────────────────────────── */
function SecurityOps() {
  const stats = [
    { value: "99.98%", label: "uptime", acc: ACCENTS.primary },
    { value: "Sub-50ms", label: "response", acc: ACCENTS.secondary },
    { value: "12k+", label: "events / day", acc: ACCENTS.tertiary },
    { value: "Zero", label: "false positives", acc: ACCENTS.error },
  ];

  return (
    <section className="relative w-full py-24 z-10 border-t border-white/5">
      <div className="absolute inset-0 bg-[#0a0a0f] z-0" />
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <Reveal className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[12px] tracking-widest uppercase text-[#ffb4ab] px-3 py-1 border border-[#ffb4ab]/30 rounded-full bg-[#ffb4ab]/10">Security Ops</span>
            <span className="font-mono text-[12px] tracking-widest uppercase text-[#4cd7f6] px-3 py-1 border border-[#4cd7f6]/30 rounded-full bg-[#4cd7f6]/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse" />Live
            </span>
          </Reveal>
          <Reveal delay={0.08}><h2 className="font-display text-[40px] md:text-[48px] text-white font-bold tracking-tighter mb-6 leading-tight">
            The shield <br />
            <span className="text-gradient-noir">never sleeps</span>
          </h2></Reveal>
          <Reveal delay={0.16}><p className="font-sans text-[18px] text-[#c7c4d7] mb-10 leading-relaxed max-w-lg">
            Every action — spam deletion, raid detection, ticket creation, file saves —
            is logged and processed in real time. You see exactly what the bot is doing, always.
          </p></Reveal>
          <Reveal delay={0.24} className="grid grid-cols-2 gap-8 w-full max-w-md">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col border-l-2 pl-4" style={{ borderColor: s.acc.line + "4d" }}>
                <span className="font-display text-[28px] text-white font-bold">{s.value}</span>
                <span className={cn("font-mono text-[12px] tracking-widest uppercase mt-1", s.acc.text)}>{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="w-full md:w-1/2 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#c0c1ff]/20 to-[#b76dff]/20 rounded-2xl blur-2xl z-0" />
          <Reveal className="glass-card p-2 rounded-2xl border-white/10 relative z-10 overflow-hidden">
            <div className="relative h-[320px] md:h-[420px] flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
              <div className="absolute inset-0 cyber-grid-bg opacity-40" />
              <div className="bg-glow-indigo top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="relative">
                <div className="radar-ring" />
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex items-center justify-center"
                >
                  <ShieldCheck className="h-36 w-36 md:h-44 md:w-44 text-[#c0c1ff] drop-shadow-[0_0_35px_rgba(192,193,255,0.55)]" />
                </motion.div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="glass-panel px-4 py-2 rounded-lg border-white/10 flex items-center gap-3 backdrop-blur-md">
                  <Shield className="h-4 w-4 text-[#c0c1ff]" />
                  <span className="font-mono text-[12px] tracking-widest uppercase text-white font-bold">{BRAND.toLowerCase()} — security ops</span>
                </div>
                <span className="font-mono text-[12px] tracking-widest uppercase text-[#4cd7f6] flex items-center gap-2">› monitoring<span className="typing-caret" /></span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── Module cockpit showcase ────────────────────────────────────────────── */
type ShowcaseKey = "antinuke" | "leveling" | "welcomer" | "tickets" | "automod";

const SHOWCASE_MODULES: {
  key: ShowcaseKey;
  label: string;
  icon: typeof ShieldAlert;
  tagline: string;
  settings: { icon: typeof ShieldAlert; label: string; enabled: boolean }[];
  accent: keyof typeof ACCENTS;
}[] = [
  {
    key: "antinuke", label: "Anti-Nuke", icon: Gavel,
    tagline: "Mass-ban lockdown in 2ms. One toggle arms 18 guard rails.",
    settings: [
      { icon: Ban,     label: "Instant ban mitigation", enabled: true },
      { icon: Shield,  label: "Role/channel wiper block", enabled: true },
      { icon: Users2,  label: "Bot-add guard", enabled: true },
      { icon: Lock,    label: "Webhook creation block", enabled: true },
    ],
    accent: "error",
  },
  {
    key: "leveling", label: "Leveling", icon: BarChart4,
    tagline: "XP, rank cards and reward roles — auto-configured per server.",
    settings: [
      { icon: BarChart4, label: "XP per message", enabled: true },
      { icon: Sparkles,  label: "Custom rank cards", enabled: true },
      { icon: User,      label: "Reward roles", enabled: true },
      { icon: Trophy,    label: "Public leaderboard", enabled: false },
    ],
    accent: "secondary",
  },
  {
    key: "welcomer", label: "Welcomer", icon: Sparkles,
    tagline: "Render a welcome card, DM the member, assign roles instantly.",
    settings: [
      { icon: Sparkles,    label: "Welcome card render", enabled: true },
      { icon: Mail,        label: "Join DM message", enabled: true },
      { icon: User,        label: "Auto-assign roles", enabled: true },
      { icon: CheckCircle2, label: "Leave messages", enabled: false },
    ],
    accent: "tertiary",
  },
  {
    key: "tickets", label: "Tickets", icon: Ticket,
    tagline: "Panel-based support with transcripts and category routing.",
    settings: [
      { icon: MessageSquare, label: "Support panel", enabled: true },
      { icon: History,       label: "Auto transcripts", enabled: true },
      { icon: Server,        label: "Category routing", enabled: true },
      { icon: Lock,          label: "Staff-only view", enabled: false },
    ],
    accent: "primary",
  },
  {
    key: "automod", label: "Automod", icon: ShieldCheck,
    tagline: "ML scoring flags spam, scams and NSFW before anyone sees it.",
    settings: [
      { icon: ShieldCheck, label: "ML spam scoring", enabled: true },
      { icon: Ban,         label: "Auto-delete", enabled: true },
      { icon: Activity,    label: "Mod alerts", enabled: true },
      { icon: Globe,       label: "Link/domain filter", enabled: false },
    ],
    accent: "amber",
  },
];

function ModulesShowcase({ active, setActive }: { active: ShowcaseKey; setActive: (k: ShowcaseKey) => void }) {
  const mod = SHOWCASE_MODULES.find((m) => m.key === active)!;
  const acc = ACCENTS[mod.accent];

  return (
    <section id="modules" className="relative w-full py-24 z-10 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute inset-0 cyber-grid-bg opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/80 to-[#0a0a0f]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-16 text-center">
        <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full border border-[#c0c1ff]/30 bg-[#c0c1ff]/5">
          <Activity className="h-[18px] w-[18px] text-[#c0c1ff]" />
          <span className="font-mono text-[12px] tracking-widest uppercase text-[#c0c1ff] font-bold">Module preview</span>
        </div>
        <h2 className="font-display text-[40px] md:text-[48px] text-white font-bold tracking-tighter mb-6">
          Click a module — <span className="text-gradient-noir">see its cockpit</span>
        </h2>
        <p className="font-sans text-[18px] text-[#c7c4d7] mb-16 leading-relaxed max-w-2xl mx-auto">
          Every module ships with a real settings panel. Flip switches, preview cards,
          and watch the bot react — no commands required.
        </p>

        {/* module tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {SHOWCASE_MODULES.map((m) => {
            const isActive = m.key === active;
            return (
              <motion.button
                key={m.key}
                onClick={() => setActive(m.key)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "px-6 py-3 rounded-lg font-mono text-[13px] tracking-widest uppercase transition-colors",
                  isActive
                    ? cn(acc.border, "bg-[#c0c1ff]/20 text-white shadow-[0_0_15px_rgba(192,193,255,0.2)]")
                    : "bg-[#34343c]/40 border border-white/10 text-[#c7c4d7] hover:bg-white/5 hover:text-white"
                )}
              >
                {m.label}
              </motion.button>
            );
          })}
        </div>

        {/* cockpit panel */}
        <div className="glass-panel rounded-2xl border-[#c0c1ff]/20 p-8 md:p-12 text-left relative overflow-hidden max-w-4xl mx-auto dashboard-glow">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0c1ff]/10 rounded-full blur-3xl" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative z-10 flex flex-col md:flex-row gap-12"
            >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-10 h-10 rounded-lg border flex items-center justify-center", acc.chip)}>
                  <mod.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-[28px] text-white font-bold">{mod.label}</h3>
              </div>
              <p className="font-sans text-[16px] text-[#c7c4d7] mb-8 leading-relaxed">{mod.tagline}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 text-[#4cd7f6] font-mono text-[11px] tracking-widest uppercase mb-8 shadow-[0_0_10px_rgba(76,215,246,0.2)]">
                Configured
              </div>
              <div className="flex flex-col gap-4">
                {mod.settings.map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-4 rounded-xl bg-[#34343c]/40 border border-white/5">
                    <span className="font-mono text-[13px] text-white tracking-widest uppercase">{s.label}</span>
                    <span className={cn("w-10 h-5 rounded-full flex items-center p-0.5 transition-colors", s.enabled ? "bg-[#c0c1ff]" : "bg-white/10")}>
                      <span className={cn("w-4 h-4 rounded-full bg-white transition-all", s.enabled ? "ml-auto" : "ml-0")} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ── Module marquee ─────────────────────────────────────────────────────── */
const MARQUEE_MODULES = [
  "Anti-Nuke", "Smart Automod", "Leveling", "Ticket System", "Welcomer",
  "Reaction Roles", "Verification", "Media Saver", "Leaderboards", "Mod Alerts",
];

function ModuleMarquee() {
  const row = [...MARQUEE_MODULES, ...MARQUEE_MODULES];
  return (
    <section className="relative w-full py-16 z-10 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0f] z-0" />
      <Reveal className="relative z-10">
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-16 pr-16">
            {row.map((m, i) => (
              <span key={i} className="flex items-center gap-16 font-mono text-[14px] uppercase tracking-widest text-[#c7c4d7]/50">
                <span className="text-[#c0c1ff] text-[10px]">◆</span>
                {m}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── How it works ───────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { icon: Server, title: "Invite the bot", desc: "Add MidVox to your server with one click — all modules come pre-armed and safe by default." },
    { icon: LogIn, title: "Authenticate", desc: "Log in with Discord on this site. We only read what you can already see — nothing more." },
    { icon: Zap, title: "Configure visually", desc: "Toggle modules, set roles, preview rank cards — saved instantly. No commands, no config files." },
  ];

  return (
    <section id="how" className="relative w-full py-24 z-10 border-t border-white/5">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-16">
        <Reveal className="text-center mb-14">
          <span className="font-mono text-[12px] tracking-widest uppercase text-[#4cd7f6] mb-4 block">How it works</span>
          <h2 className="font-display text-[40px] md:text-[48px] text-white font-bold tracking-tighter">
            Live in <span className="text-gradient-noir">three steps</span>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              className="glass-card border-white/10 rounded-2xl p-8 text-center md:text-left relative overflow-hidden group hover:border-[#c0c1ff]/30 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c0c1ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="mb-6 relative">
                <div className="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#818CF8] to-[#4F46E5] shadow-[0_0_24px_rgba(99,102,241,0.45)]">
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#c0c1ff]/30 bg-[#0a0a0f] font-mono text-[10px] font-bold text-[#c0c1ff]">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mb-2 font-display text-[18px] font-bold text-white">{s.title}</h3>
              <p className="mx-auto md:mx-0 max-w-xs text-sm leading-relaxed text-[#c7c4d7]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ───────────────────────────────────────────────────────────── */
function Features() {
  const features = [
    { icon: ShieldAlert,     title: "Anti-Nuke",       desc: "Instant lockdown against mass bans, channel wipes, and rogue admin attacks — resolved in milliseconds." },
    { icon: ShieldCheck,     title: "Smart Automod",   desc: "ML-powered message scoring catches spam, scam links, and NSFW content before anyone sees it." },
    { icon: BarChart4,       title: "Leveling",        desc: "XP tracking, custom rank cards, reward roles, and a public leaderboard — all configurable per server." },
    { icon: MessageSquare,   title: "Ticket System",   desc: "Panel-based support tickets with transcripts, category routing, and staff assignments." },
    { icon: Sparkles,        title: "Engagement",      desc: "Reaction roles, welcome cards, vanity roles and join DMs that keep members coming back." },
    { icon: LayoutDashboard, title: "One Dashboard",   desc: "Configure every module from a single fast interface — no slash commands, no YAML, no headaches." },
  ];

  return (
    <section id="features" className="relative w-full py-24 z-10 border-t border-white/5">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-16">
        <Reveal className="max-w-2xl mb-14">
          <span className="font-mono text-[12px] tracking-widest uppercase text-[#b76dff] mb-4 block">Features</span>
          <h2 className="font-display text-[40px] md:text-[48px] text-white font-bold tracking-tighter">
            Everything communities need, <span className="text-gradient-noir">nothing they don&apos;t</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: EASE }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl glass-card border-white/10 p-6 transition-all duration-300 hover:border-[#c0c1ff]/40 hover:bg-white/[0.04]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c0c1ff]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className={cn("mb-5 flex h-11 w-11 items-center justify-center rounded-xl border", ACCENTS[i % 2 === 0 ? "primary" : "tertiary"].chip)}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2.5 font-display text-[16px] font-bold tracking-tight text-white">{f.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-[#c7c4d7]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────────────────────────── */
function Testimonials() {
  const testimonials = [
    { quote: "We replaced six bots with MidVox in one afternoon. Anti-nuke blocked a full raid while I slept — the logs looked like a movie.", name: "Kai", role: "Owner · 210k member server", grad: "from-[#c0c1ff] to-[#6366F1]", init: "K" },
    { quote: "The dashboard is the only reason I switched. Everything is clickable, and I haven't written a single slash command since.", name: "Maya", role: "Mod team lead · 45k server", grad: "from-[#4cd7f6] to-[#06b6d4]", init: "M" },
    { quote: "Leveling import from MEE6 took 30 seconds, and the rank cards look better than anything our paid bots ever did.", name: "Arjun", role: "Admin · gaming community", grad: "from-[#b76dff] to-[#a855f7]", init: "A" },
  ];

  return (
    <section className="relative w-full py-24 z-10 border-t border-white/5">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-16">
        <Reveal className="text-center mb-16">
          <span className="font-mono text-[12px] tracking-widest uppercase text-[#b76dff] mb-4 block">Testimonials</span>
          <h2 className="font-display text-[40px] md:text-[48px] text-white font-bold tracking-tighter">Loved by server owners</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -6 }}
              className="glass-card p-8 rounded-2xl border-white/10 hover:border-[#c0c1ff]/30 transition-colors relative group flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c0c1ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="font-sans text-[16px] text-[#c7c4d7] mb-8 leading-relaxed italic">“{t.quote}”</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className={cn("w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-[18px]", t.grad)}>{t.init}</div>
                <div className="flex flex-col">
                  <span className="font-display text-[18px] text-white">{t.name}</span>
                  <span className="font-mono text-[11px] text-[#c0c1ff] tracking-widest uppercase mt-1">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "Is the bot free?", a: "The full core feature set is free for any server. We may offer priority support or extended limits for premium plans in future." },
    { q: "How do I configure modules?", a: "Invite the bot, authenticate with Discord on this site, select your server, and configure everything from the visual dashboard — no commands required." },
    { q: "Can I migrate from other bots?", a: "Leveling data from MEE6 and other common bots can be imported via the dashboard in a few clicks." },
    { q: "Is my server data safe?", a: "Configuration is stored encrypted at rest. We only retain what Discord requires us to — no message content, no personal data beyond what you can see." },
  ];

  return (
    <section id="faq" className="relative w-full py-24 z-10 border-t border-white/5">
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-16">
        <Reveal className="text-center mb-12">
          <span className="font-mono text-[12px] tracking-widest uppercase text-[#4cd7f6] mb-4 block">FAQ</span>
          <h2 className="font-display text-[40px] md:text-[48px] text-white font-bold tracking-tighter">Common questions</h2>
        </Reveal>
        <div className="glass-card border-white/10 rounded-2xl px-8 divide-y divide-white/[0.07]">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors pr-8">{f.q}</span>
                <ChevronRight className={cn("h-4 w-4 text-white/30 shrink-0 transition-transform duration-300", open === i && "rotate-90")} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.p
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="pb-5 text-sm text-[#c7c4d7] leading-relaxed overflow-hidden"
                  >
                    {f.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="w-full py-16 px-4 md:px-16 flex flex-col gap-12 bg-[#050508] border-t border-white/5 relative z-10">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#c0c1ff]/10 border border-[#c0c1ff]/30">
              <Bot className="h-[20px] w-[20px] text-[#c0c1ff]" />
            </div>
            <span className="font-display text-[24px] font-bold text-white tracking-tighter">{BRAND}</span>
          </div>
          <p className="font-sans text-[14px] text-[#c7c4d7] max-w-sm">
            The Discord management platform for communities that care about quality.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[12px] text-white tracking-widest uppercase font-bold">Resources</span>
            {[["Documentation", "/docs"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]].map(([l, h]) => (
              <Link key={l} href={h} className="font-mono text-[13px] text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors tracking-wide">{l}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[12px] text-white tracking-widest uppercase font-bold">Platform</span>
            <Link href="/dashboard" className="font-mono text-[13px] text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors tracking-wide">Dashboard</Link>
            <Link href="/docs" className="font-mono text-[13px] text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors tracking-wide">API Docs</Link>
            <Link href="/" className="font-mono text-[13px] text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors tracking-wide">Support Server</Link>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto w-full pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[11px] text-[#c7c4d7]/60 tracking-widest uppercase">
          © 2026 {BRAND} Development. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6]" />
          <span className="font-mono text-[10px] text-[#c7c4d7]/60 tracking-widest uppercase">All systems operational</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [active, setActive] = useState<ShowcaseKey>("antinuke");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f] font-sans text-[#c7c4d7]">
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />
      <main className="pb-0">
        <Hero />
        <DashboardMockup view={view} setView={setView} />
        <ModuleMarquee />
        <ModulesShowcase active={active} setActive={setActive} />
        <SecurityOps />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
