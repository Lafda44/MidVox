"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Shield, Zap, BarChart4, Ticket, Trophy, MessageSquare,
  ArrowRight, Terminal, CheckCircle2, Users2, Globe, Activity,
  ChevronRight, Lock, Mail, Gavel
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox";

/* ─── Data ──────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Shield,       label: "AutoMod",       desc: "Catch raids, spam, and bad actors before they cause damage. ML-backed pattern detection." },
  { icon: Gavel,        label: "Moderation",    desc: "Warn, mute, kick, ban. Full audit log, case system, and appeal workflows baked in." },
  { icon: Trophy,       label: "Leveling",      desc: "XP system with voice & text tracking. Custom rank cards, milestone rewards, leaderboards." },
  { icon: Ticket,       label: "Tickets",       desc: "Structured support threads. Categories, staff assignment, transcripts, SLA timers." },
  { icon: BarChart4,    label: "Analytics",     desc: "Real-time member growth, message heatmaps, channel activity, and retention graphs." },
  { icon: MessageSquare,label: "Logging",       desc: "Every edit, delete, join, leave, and role change captured with full diff views." },
  { icon: Zap,          label: "Auto-Roles",    desc: "Reaction roles, join roles, level-gate roles, and timed role expiry." },
  { icon: Mail,         label: "DM Automation", desc: "Welcome DMs, onboarding flows, and custom triggers without a single slash command." },
  { icon: Activity,     label: "Status Alerts", desc: "Instant Discord notifications when any linked service changes state." },
];

const STATS = [
  { value: "12,400+", label: "Servers" },
  { value: "4.2M+",   label: "Members served" },
  { value: "99.8%",   label: "Uptime" },
  { value: "<120ms",  label: "Avg latency" },
];

const TERMINAL_LINES = [
  { prefix: "$", text: "invite midvox --server my-guild", delay: 0 },
  { prefix: "✓", text: "Bot joined · 3 roles created", delay: 600 },
  { prefix: "$", text: "midvox automod enable --sensitivity high", delay: 1400 },
  { prefix: "✓", text: "AutoMod active · 14 rules loaded", delay: 2000 },
  { prefix: "$", text: "midvox logs channel #audit-log", delay: 2900 },
  { prefix: "✓", text: "Logging live · events: 23 types", delay: 3500 },
];

/* ─── Sub-components ─────────────────────────────────────────────────── */
function TypeWriter({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        setShown(text.slice(0, ++i));
        if (i >= text.length) clearInterval(iv);
      }, 22);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, startDelay]);
  return <span>{shown}</span>;
}

function TerminalBlock() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const timers = TERMINAL_LINES.map((l, i) =>
      setTimeout(() => setVisible(i + 1), l.delay + 400)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="rounded-[6px] border border-[#252525] bg-[#0A0A0A] overflow-hidden font-mono text-xs">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1A1A1A]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
        <span className="ml-3 text-[#444] tracking-wide">midvox — zsh</span>
      </div>
      {/* Lines */}
      <div className="p-4 space-y-1.5 min-h-[160px]">
        {TERMINAL_LINES.map((l, i) =>
          visible > i ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className="flex gap-2"
            >
              <span className={l.prefix === "✓" ? "text-[#22C55E]" : "text-[#F59E0B]"}>
                {l.prefix}
              </span>
              <span className={l.prefix === "✓" ? "text-[#888]" : "text-[#F5F5F5]"}>
                {l.text}
              </span>
            </motion.div>
          ) : null
        )}
        {visible >= TERMINAL_LINES.length && (
          <div className="flex gap-2 mt-1">
            <span className="text-[#F59E0B]">$</span>
            <span className="w-[7px] h-[13px] bg-[#F59E0B] inline-block animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  label,
  desc,
  index,
}: {
  icon: typeof Shield;
  label: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group rounded-[6px] border border-[#1A1A1A] bg-[#111] p-5 hover:border-[#333] hover:bg-[#161616] transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-[4px] bg-[#1A1A1A] border border-[#252525] group-hover:border-[#F59E0B]/30 group-hover:bg-[rgba(245,158,11,0.06)] transition-all duration-200">
          <Icon size={15} className="text-[#888] group-hover:text-[#F59E0B] transition-colors duration-200" />
        </div>
        <span className="font-semibold text-sm text-[#E5E5E5] font-mono tracking-wide">{label}</span>
      </div>
      <p className="text-xs text-[#666] leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0C0C] text-[#F5F5F5]">
      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[rgba(12,12,12,0.92)] border-b border-[#1A1A1A] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[5px] bg-[#F59E0B] flex items-center justify-center">
              <Terminal size={14} className="text-black" />
            </div>
            <span className="font-bold text-[15px] tracking-tight font-mono">{BRAND}</span>
          </div>

          {/* Nav links desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {["Features", "Stats", "Docs"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-xs font-mono font-medium uppercase tracking-widest text-[#888] hover:text-[#F5F5F5] transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => signIn("discord")}
              className="hidden md:flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#888] hover:text-[#F5F5F5] transition-colors"
            >
              <Lock size={11} />
              Sign in
            </button>
            <button
              onClick={() => signIn("discord")}
              className="flex items-center gap-1.5 bg-[#F59E0B] text-black text-xs font-mono font-bold uppercase tracking-widest px-4 py-2 rounded-[4px] hover:bg-[#FBB024] hover:shadow-[0_0_18px_rgba(245,158,11,0.3)] transition-all duration-200"
            >
              Add to Discord
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-20 px-4 overflow-hidden">
          {/* grid bg */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse 100% 80% at 50% 0%, black 30%, transparent 75%)",
            }}
          />
          {/* amber radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: "700px",
              height: "400px",
              background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,158,11,0.09) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-6xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex justify-center mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#252525] bg-[#131313] text-[10px] font-mono uppercase tracking-widest text-[#F59E0B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Online · {BRAND} v2
              </span>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-bold leading-[1.05] tracking-tight mb-5"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  Your Discord server,{" "}
                  <span
                    className="text-[#F59E0B]"
                    style={{
                      background: "linear-gradient(90deg, #F59E0B, #FBB024, #F59E0B)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    fully automated.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="text-[#888] text-base leading-relaxed mb-8 max-w-md"
                >
                  Moderation, leveling, tickets, analytics, and auto-roles — all
                  managed from one dashboard. No commands needed.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <button
                    onClick={() => signIn("discord")}
                    className="flex items-center gap-2 bg-[#F59E0B] text-black text-sm font-mono font-bold uppercase tracking-widest px-6 py-3 rounded-[4px] hover:bg-[#FBB024] hover:shadow-[0_0_28px_rgba(245,158,11,0.35)] transition-all duration-200"
                  >
                    Get started free
                    <ArrowRight size={14} />
                  </button>
                  <a
                    href="#features"
                    className="flex items-center gap-2 text-sm font-mono font-semibold uppercase tracking-widest text-[#888] border border-[#252525] px-5 py-3 rounded-[4px] hover:border-[#333] hover:text-[#CCC] transition-all duration-200"
                  >
                    View features
                  </a>
                </motion.div>

                {/* Trust row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8"
                >
                  {["Free to start", "No credit card", "5-min setup"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-[11px] font-mono text-[#555]">
                      <CheckCircle2 size={11} className="text-[#22C55E]" />
                      {t}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right — terminal */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <TerminalBlock />

                {/* Mini stat strip below terminal */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {STATS.slice(0, 2).map((s) => (
                    <div
                      key={s.label}
                      className="rounded-[5px] border border-[#1A1A1A] bg-[#111] px-4 py-3"
                    >
                      <p className="font-bold text-xl font-mono text-[#F59E0B]">{s.value}</p>
                      <p className="text-[11px] font-mono text-[#555] uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ──────────────────────────────────────────────── */}
        <section id="stats" className="border-y border-[#1A1A1A] bg-[#0F0F0F] py-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <p className="text-3xl font-bold font-mono text-[#F5F5F5] tracking-tight">{s.value}</p>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#555] mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────────── */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] mb-3">
                Capabilities
              </p>
              <h2
                className="font-bold text-[#F5F5F5] mb-3 tracking-tight"
                style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontFamily: "var(--font-space-grotesk)" }}
              >
                Everything your server needs.
              </h2>
              <p className="text-[#666] text-sm max-w-md">
                Nine core modules. One dashboard. Zero extra bots.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FEATURES.map((f, i) => (
                <FeatureCard key={f.label} {...f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section className="relative py-24 px-4 overflow-hidden border-t border-[#1A1A1A]">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              opacity: 0.25,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245,158,11,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] mb-4"
            >
              Get started now
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-bold text-[#F5F5F5] mb-5 tracking-tight"
              style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontFamily: "var(--font-space-grotesk)" }}
            >
              Add {BRAND} in 60 seconds.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#666] text-sm mb-8"
            >
              Authorize with Discord, pick your server, done. No complicated setup,
              no API keys, no headaches.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              onClick={() => signIn("discord")}
              className="inline-flex items-center gap-2 bg-[#F59E0B] text-black text-sm font-mono font-bold uppercase tracking-widest px-8 py-3.5 rounded-[4px] hover:bg-[#FBB024] hover:shadow-[0_0_32px_rgba(245,158,11,0.4)] transition-all duration-200"
            >
              Add to Discord — it's free
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1A1A1A] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[3px] bg-[#F59E0B] flex items-center justify-center">
              <Terminal size={9} className="text-black" />
            </div>
            <span className="font-mono font-semibold text-sm">{BRAND}</span>
          </div>
          <p className="text-[11px] font-mono text-[#444]">
            © {new Date().getFullYear()} CodeX Devs. Not affiliated with Discord Inc.
          </p>
          <div className="flex items-center gap-5">
            {["Terms", "Privacy", "Docs"].map((l) => (
              <a key={l} href="#" className="text-[11px] font-mono text-[#555] hover:text-[#888] transition-colors uppercase tracking-wider">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
