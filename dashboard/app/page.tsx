"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { signIn } from "next-auth/react";
import {
  Shield, Zap, BarChart4, Ticket, Trophy, MessageSquare,
  ArrowRight, Terminal, CheckCircle2, Activity, Lock,
  Mail, Gavel, Bell, Users, Hash,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox";
const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";
const BOT_INVITE = CLIENT_ID
  ? `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot+applications.commands`
  : "https://discord.com/oauth2/authorize";

/* ─── Data ──────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Shield,        label: "AutoMod",        desc: "ML-backed raid, spam, and bad-actor detection before they cause damage." },
  { icon: Gavel,         label: "Moderation",     desc: "Warn, mute, kick, ban with full audit log, case system, and appeal flows." },
  { icon: Trophy,        label: "Leveling",       desc: "XP system with voice & text tracking. Custom rank cards, leaderboards." },
  { icon: Ticket,        label: "Tickets",        desc: "Structured support threads with categories, transcripts, SLA timers." },
  { icon: BarChart4,     label: "Analytics",      desc: "Real-time member growth, message heatmaps, channel activity graphs." },
  { icon: MessageSquare, label: "Logging",        desc: "Every edit, delete, join, leave, and role change with full diff views." },
  { icon: Zap,           label: "Auto-Roles",     desc: "Reaction roles, join roles, level-gate roles, timed role expiry." },
  { icon: Mail,          label: "DM Automation",  desc: "Welcome DMs, onboarding flows, and custom triggers — no commands." },
  { icon: Activity,      label: "Status Alerts",  desc: "Instant Discord notifications when any linked service changes state." },
];

const STATS = [
  { value: "12,400+", label: "Servers",        num: 12400 },
  { value: "4.2M+",   label: "Members served", num: 4200000 },
  { value: "99.8%",   label: "Uptime",         num: 99.8 },
  { value: "<120ms",  label: "Avg latency",    num: 120 },
];

const STEPS = [
  { n: "01", title: "Add the bot",      desc: "Click 'Add to Discord', pick your server, and authorize in seconds." },
  { n: "02", title: "Sign in",          desc: "Log in with Discord to access your personal dashboard." },
  { n: "03", title: "Configure & go",  desc: "Enable modules, tweak settings, and watch your server run itself." },
];

// Deterministic particle positions — no Math.random() to avoid hydration mismatch
const PARTICLES = [
  { left: "4%",  delay: "0s",    dur: "20s", size: 2, opacity: 0.4 },
  { left: "9%",  delay: "3.5s",  dur: "17s", size: 1, opacity: 0.6 },
  { left: "15%", delay: "7s",    dur: "23s", size: 2, opacity: 0.3 },
  { left: "21%", delay: "1s",    dur: "19s", size: 1, opacity: 0.5 },
  { left: "28%", delay: "5s",    dur: "25s", size: 3, opacity: 0.2 },
  { left: "33%", delay: "9s",    dur: "18s", size: 1, opacity: 0.7 },
  { left: "40%", delay: "2s",    dur: "21s", size: 2, opacity: 0.4 },
  { left: "46%", delay: "6s",    dur: "16s", size: 1, opacity: 0.5 },
  { left: "52%", delay: "11s",   dur: "24s", size: 2, opacity: 0.3 },
  { left: "58%", delay: "4s",    dur: "20s", size: 1, opacity: 0.6 },
  { left: "63%", delay: "8s",    dur: "18s", size: 2, opacity: 0.4 },
  { left: "69%", delay: "0.5s",  dur: "22s", size: 1, opacity: 0.5 },
  { left: "74%", delay: "13s",   dur: "17s", size: 3, opacity: 0.2 },
  { left: "79%", delay: "3s",    dur: "26s", size: 1, opacity: 0.6 },
  { left: "84%", delay: "7.5s",  dur: "19s", size: 2, opacity: 0.3 },
  { left: "88%", delay: "10s",   dur: "21s", size: 1, opacity: 0.5 },
  { left: "92%", delay: "2.5s",  dur: "23s", size: 2, opacity: 0.4 },
  { left: "96%", delay: "6.5s",  dur: "15s", size: 1, opacity: 0.7 },
  { left: "11%", delay: "14s",   dur: "20s", size: 2, opacity: 0.3 },
  { left: "55%", delay: "4.5s",  dur: "18s", size: 1, opacity: 0.5 },
];

/* ─── Particle field ─────────────────────────────────────────────────── */
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: i % 3 === 0 ? "#F59E0B" : i % 3 === 1 ? "#8B5CF6" : "#3B82F6",
            boxShadow: `0 0 ${p.size * 3}px currentColor`,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated counter ───────────────────────────────────────────────── */
function Counter({ stat }: { stat: typeof STATS[0] }) {
  const [shown, setShown] = useState("0");
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!entered) return;
    const isDecimal = stat.num < 1000 && String(stat.num).includes(".");
    const target = stat.num;
    const steps = 50;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      const v = (target * i) / steps;
      if (isDecimal) setShown(v.toFixed(1) + "%");
      else if (target >= 1000000) setShown((v / 1000000).toFixed(1) + "M+");
      else if (target >= 1000) setShown(Math.floor(v).toLocaleString() + "+");
      else setShown("<" + Math.ceil(v) + "ms");
      if (i >= steps) { setShown(stat.value); clearInterval(iv); }
    }, 30);
    return () => clearInterval(iv);
  }, [entered, stat]);

  return (
    <motion.div className="text-center"
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} onViewportEnter={() => setEntered(true)}
      transition={{ duration: 0.4 }}>
      <div className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">{shown}</div>
      <div className="text-xs font-mono uppercase tracking-widest text-white/30 mt-1">{stat.label}</div>
    </motion.div>
  );
}

/* ─── Feature card ───────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, label, desc, index }: {
  icon: typeof Shield; label: string; desc: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="card-cyber group rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6"
    >
      <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/25 group-hover:border-[#F59E0B]/40 transition-all duration-300">
        <Icon size={16} className="text-[#F59E0B]" />
      </div>
      <h3 className="font-bold text-sm text-white mb-2 tracking-wide">{label}</h3>
      <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ─── Discord mock card ──────────────────────────────────────────────── */
function DiscordMock() {
  const items = [
    { icon: <Shield size={12} />, color: "#F59E0B", text: "AutoMod blocked a raid · 47 accounts", time: "now" },
    { icon: <Trophy size={12} />, color: "#22C55E", text: "@Alex reached Level 25 🎉", time: "2m" },
    { icon: <Bell size={12} />,   color: "#5865F2", text: "Ticket #142 opened by @Sara", time: "5m" },
    { icon: <Users size={12} />,  color: "#EF4444", text: "3 accounts flagged as fake invites", time: "8m" },
    { icon: <Hash size={12} />,   color: "#A855F7", text: "Welcome DM sent to @NewMember", time: "12m" },
  ];
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }} className="relative">
      <div className="absolute -inset-6 bg-[#5865F2]/8 rounded-3xl blur-3xl" />
      <div className="absolute -inset-2 bg-[#F59E0B]/5 rounded-3xl blur-2xl" />
      <div className="relative rounded-2xl border border-white/10 bg-[#0d0d14]/95 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40">
          <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
          <span className="ml-3 text-white/30 text-xs font-mono"># {BRAND.toLowerCase()}-logs</span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-[#22C55E] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> LIVE
          </span>
        </div>
        <div className="p-4 space-y-3">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.15 }}
              className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: item.color + "20", color: item.color }}>
                {item.icon}
              </div>
              <span className="text-xs text-white/60 flex-1">{item.text}</span>
              <span className="text-[10px] text-white/20 font-mono shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2 flex items-center gap-2">
            <span className="text-[11px] text-white/20 font-mono">Message #{BRAND.toLowerCase()}-logs</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (spotlightRef.current) {
      spotlightRef.current.style.left = e.clientX + "px";
      spotlightRef.current.style.top  = e.clientY + "px";
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-white overflow-x-hidden grid-cyber"
      onMouseMove={handleMouseMove}>

      {/* Mouse spotlight */}
      <div ref={spotlightRef} className="spotlight" aria-hidden />

      {/* Aurora blobs */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="aurora-1" style={{ width: "600px", height: "600px", top: "-100px", left: "20%" }} />
        <div className="aurora-2" style={{ width: "700px", height: "700px", top: "30%", right: "-100px" }} />
        <div className="aurora-3" style={{ width: "500px", height: "500px", bottom: "10%", left: "10%" }} />
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#050507]/75 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg shadow-[#F59E0B]/30 animate-glow-pulse">
              <Terminal size={15} className="text-black" />
            </div>
            <span className="font-bold text-[15px] tracking-tight">{BRAND}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {(["Features", "How it works", "Stats"] as const).map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(l.toLowerCase().replace(/ /g, "-"))?.scrollIntoView({ behavior: "smooth" }); }}
                className="nav-link text-xs font-semibold uppercase tracking-widest text-white/40 transition-colors">
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
              <Lock size={11} /> Sign in
            </button>
            <motion.a href={BOT_INVITE} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(245,158,11,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-glow flex items-center gap-2 bg-[#F59E0B] text-black text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl">
              Add to Discord <ArrowRight size={11} />
            </motion.a>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-24 px-5 overflow-hidden">
          <ParticleField />

          {/* Extra hero glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,158,11,0.10) 0%, transparent 70%)" }} />

          <div className="relative max-w-6xl mx-auto">
            {/* Live badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="flex justify-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/8 text-[10px] font-mono uppercase tracking-widest text-[#F59E0B]">
                <span className="dot-green" />
                Online · {BRAND} v2
              </span>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="font-extrabold leading-[1.05] tracking-tight mb-6"
                  style={{ fontSize: "clamp(2.6rem,5.5vw,4.2rem)" }}>
                  Your Discord server,{" "}
                  <span className="text-shimmer">fully automated.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                  className="text-white/50 text-base leading-relaxed mb-9 max-w-lg">
                  Moderation, leveling, tickets, analytics, and auto-roles — all managed from one dashboard. No commands needed.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                  className="flex flex-wrap gap-3 mb-10">
                  <motion.a href={BOT_INVITE} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(245,158,11,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-glow flex items-center gap-2 bg-[#F59E0B] text-black font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-xl shadow-xl shadow-[#F59E0B]/20">
                    Add to Discord <ArrowRight size={14} />
                  </motion.a>
                  <motion.button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                    whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 font-semibold text-sm text-white/60 border border-white/10 px-6 py-3.5 rounded-xl hover:text-white transition-all">
                    Sign in to dashboard
                  </motion.button>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {["Free to start", "No credit card", "5-min setup"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-[11px] text-white/30">
                      <CheckCircle2 size={11} className="text-[#22C55E]" /> {t}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right */}
              <DiscordMock />
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <section id="stats" className="py-16 px-5 border-y border-white/[0.04]"
          style={{ background: "linear-gradient(180deg, transparent, rgba(245,158,11,0.02) 50%, transparent)" }}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => <Counter key={s.label} stat={s} />)}
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────── */}
        <section id="features" className="py-28 px-5">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-16 text-center">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] mb-4">Capabilities</p>
              <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight mb-4">
                Everything your server needs.
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto">Nine core modules. One dashboard. Zero extra bots.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => <FeatureCard key={f.label} {...f} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────── */}
        <section id="how-it-works" className="py-28 px-5 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-16 text-center">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] mb-4">Setup</p>
              <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight">Live in 3 steps.</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <motion.div key={s.n}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="card-cyber rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7">
                  <div className="text-5xl font-black font-mono text-[#F59E0B]/10 mb-4">{s.n}</div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="relative py-32 px-5 overflow-hidden border-t border-white/[0.04]">
          <ParticleField />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,158,11,0.07) 0%, transparent 70%)" }} />
          <div className="relative max-w-2xl mx-auto text-center">
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[11px] font-mono uppercase tracking-widest text-[#F59E0B] mb-5">
              Get started
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="font-extrabold text-3xl md:text-5xl tracking-tight mb-6">
              Add {BRAND} in{" "}
              <span className="text-shimmer">60 seconds.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.12 }} className="text-white/40 text-sm mb-10 max-w-sm mx-auto">
              Authorize with Discord, pick your server, done. No setup headaches.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.18 }} className="flex flex-wrap gap-4 justify-center">
              <motion.a href={BOT_INVITE} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.06, boxShadow: "0 0 56px rgba(245,158,11,0.55)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-glow inline-flex items-center gap-2 bg-[#F59E0B] text-black font-bold text-sm uppercase tracking-widest px-9 py-4 rounded-xl shadow-2xl shadow-[#F59E0B]/25">
                Add to Discord — it&apos;s free <ArrowRight size={14} />
              </motion.a>
              <motion.button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.25)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 font-semibold text-sm text-white/50 border border-white/10 px-7 py-4 rounded-xl hover:text-white transition-all">
                Sign in to dashboard
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
              <Terminal size={10} className="text-black" />
            </div>
            <span className="font-bold text-sm">{BRAND}</span>
          </div>
          <p className="text-[11px] text-white/20">© {new Date().getFullYear()} CodeX Devs. Not affiliated with Discord Inc.</p>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Docs"].map((l) => (
              <a key={l} href="#"
                className="nav-link text-[11px] text-white/30 uppercase tracking-wider transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

