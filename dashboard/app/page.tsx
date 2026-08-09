"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { signIn } from "next-auth/react";
import {
  Shield, Zap, BarChart4, Ticket, Trophy, MessageSquare,
  ArrowRight, Terminal, CheckCircle2, Activity, Lock,
  Mail, Gavel, Bell, Users, Hash,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND     = process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox";
const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";
const BOT_INVITE = CLIENT_ID
  ? `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot+applications.commands`
  : "https://discord.com/oauth2/authorize";

/* ─── Data ──────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Shield,        label: "AutoMod",       desc: "ML-backed raid, spam, and bad-actor detection before they cause damage." },
  { icon: Gavel,         label: "Moderation",    desc: "Warn, mute, kick, ban with full audit log, case history, and appeal flows." },
  { icon: Trophy,        label: "Leveling",      desc: "XP system with voice & text tracking, rank cards, and leaderboards." },
  { icon: Ticket,        label: "Tickets",       desc: "Structured support threads with categories, transcripts, and SLA timers." },
  { icon: BarChart4,     label: "Analytics",     desc: "Real-time member growth, message heatmaps, and channel activity graphs." },
  { icon: MessageSquare, label: "Logging",       desc: "Every edit, delete, join, and role change with full diff views." },
  { icon: Zap,           label: "Auto-Roles",    desc: "Reaction roles, join roles, level-gate roles, and timed role expiry." },
  { icon: Mail,          label: "DM Automation", desc: "Welcome DMs, onboarding flows, and custom triggers — no commands." },
  { icon: Activity,      label: "Status Alerts", desc: "Instant Discord notifications when any linked service changes state." },
];

const STATS = [
  { value: "12,400+", label: "Servers",        num: 12400 },
  { value: "4.2M+",   label: "Members served", num: 4200000 },
  { value: "99.8%",   label: "Uptime",         num: 99.8 },
  { value: "<120ms",  label: "Avg latency",    num: 120 },
];

const STEPS = [
  { n: "01", title: "Add the bot",     desc: "Click 'Add to Discord', pick your server, authorize in under a minute." },
  { n: "02", title: "Sign in",         desc: "Log in with Discord to access your personal server dashboard." },
  { n: "03", title: "Configure & go", desc: "Enable modules, tweak settings, and let your server run itself." },
];

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
      else if (target >= 1_000_000) setShown((v / 1_000_000).toFixed(1) + "M+");
      else if (target >= 1_000) setShown(Math.floor(v).toLocaleString() + "+");
      else setShown("<" + Math.ceil(v) + "ms");
      if (i >= steps) { setShown(stat.value); clearInterval(iv); }
    }, 28);
    return () => clearInterval(iv);
  }, [entered, stat]);

  return (
    <motion.div
      className="stat-card p-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setEntered(true)}
      transition={{ duration: 0.45 }}
    >
      <div className="text-3xl md:text-4xl font-black font-display text-white tracking-tight mb-1">{shown}</div>
      <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--ink-muted)" }}>{stat.label}</div>
    </motion.div>
  );
}

/* ─── Feature card ───────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, label, desc, index }: {
  icon: typeof Shield; label: string; desc: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card-feature group rounded-2xl p-6"
      style={{ background: "var(--navy-2)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
        style={{
          background: "var(--blue-dim)",
          border: "1px solid var(--border-blue)",
        }}
      >
        <Icon size={17} style={{ color: "var(--blue-hi)" }} />
      </div>
      <h3 className="font-bold text-sm text-white mb-2 tracking-wide">{label}</h3>
      <p className="text-xs leading-relaxed" style={{ color: "var(--ink-muted)" }}>{desc}</p>
    </motion.div>
  );
}

/* ─── Discord activity mock ──────────────────────────────────────────── */
function DiscordMock() {
  const feed = [
    { icon: <Shield size={12} />, color: "#3D7EFF", text: "AutoMod blocked a raid · 47 accounts",  time: "now" },
    { icon: <Trophy size={12} />, color: "#22C55E", text: "@Alex reached Level 25 🎉",              time: "2m" },
    { icon: <Bell size={12} />,   color: "#818CF8", text: "Ticket #142 opened by @Sara",            time: "5m" },
    { icon: <Users size={12} />,  color: "#EF4444", text: "3 accounts flagged as fake invites",     time: "8m" },
    { icon: <Hash size={12} />,   color: "#3D7EFF", text: "Welcome DM sent to @NewMember",         time: "12m" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative"
    >
      {/* outer glow */}
      <div className="absolute -inset-8 rounded-3xl blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(61,126,255,0.12) 0%, transparent 70%)" }} />
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "rgba(8,13,26,0.97)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.3)" }}>
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs font-mono" style={{ color: "var(--ink-faint)" }}>
            # {BRAND.toLowerCase()}-logs
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--green)" }}>
            <span className="dot-live" /> LIVE
          </span>
        </div>
        {/* feed */}
        <div className="p-4 space-y-3">
          {feed.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.12 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: item.color + "20", color: item.color }}
              >
                {item.icon}
              </div>
              <span className="text-xs flex-1" style={{ color: "var(--ink-muted)" }}>{item.text}</span>
              <span className="text-xs font-mono shrink-0" style={{ color: "var(--ink-faint)" }}>{item.time}</span>
            </motion.div>
          ))}
        </div>
        {/* fake input */}
        <div className="px-4 pb-4">
          <div className="rounded-lg px-3 py-2 flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
            <span className="text-xs font-mono" style={{ color: "var(--ink-faint)" }}>
              Message #{BRAND.toLowerCase()}-logs
            </span>
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
    <div
      className="min-h-screen flex flex-col dot-grid"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
      onMouseMove={handleMouseMove}
    >
      {/* spotlight */}
      <div ref={spotlightRef} className="spotlight" aria-hidden />

      {/* glow blobs */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glow-blob-1" style={{ width: 700, height: 700, top: "-180px", left: "15%" }} />
        <div className="glow-blob-2" style={{ width: 600, height: 600, top: "35%", right: "-120px" }} />
        <div className="glow-blob-3" style={{ width: 500, height: 500, bottom: "5%", left: "5%" }} />
      </div>

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl" style={{ borderBottom: "1px solid var(--border)", background: "rgba(6,10,20,0.80)" }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center animate-blue-pulse"
              style={{ background: "linear-gradient(135deg, #3D7EFF, #2563EB)", boxShadow: "0 0 20px rgba(61,126,255,0.35)" }}
            >
              <Terminal size={14} className="text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white">{BRAND}</span>
          </div>

          {/* nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {(["Features", "How it works", "Stats"] as const).map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(l.toLowerCase().replace(/ /g, "-"))?.scrollIntoView({ behavior: "smooth" });
                }}
                className="nav-link text-xs font-semibold uppercase tracking-widest"
              >
                {l}
              </a>
            ))}
          </nav>

          {/* cta */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="hidden md:flex items-center gap-2 btn-ghost text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-xl"
            >
              <Lock size={11} /> Sign in
            </button>
            <motion.a
              href={BOT_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl"
            >
              Add to Discord <ArrowRight size={11} />
            </motion.a>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-28 px-5 overflow-hidden">
          {/* top center glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(61,126,255,0.12) 0%, transparent 70%)" }} />

          <div className="relative max-w-6xl mx-auto">
            {/* live badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="flex justify-center mb-10">
              <span className="badge-blue">
                <span className="dot-live" />
                {BRAND} — now live · v2
              </span>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* left */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-extrabold leading-[1.06] tracking-tight mb-6"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontFamily: "var(--font-space-grotesk), sans-serif" }}
                >
                  Manage your Discord server{" "}
                  <span className="text-shimmer">without lifting a finger.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="text-base leading-relaxed mb-9 max-w-lg"
                  style={{ color: "var(--ink-muted)" }}
                >
                  Moderation, leveling, tickets, analytics, and auto-roles — all managed from one clean dashboard. No commands. No hassle.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                  className="flex flex-wrap gap-3 mb-10"
                >
                  <motion.a
                    href={BOT_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center gap-2 font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-xl"
                  >
                    Add to Discord <ArrowRight size={14} />
                  </motion.a>
                  <motion.button
                    onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-ghost flex items-center gap-2 font-semibold text-sm px-6 py-3.5 rounded-xl"
                  >
                    Sign in to dashboard
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.38 }}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2"
                >
                  {["Free to start", "No credit card", "5-min setup"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-muted)" }}>
                      <CheckCircle2 size={12} style={{ color: "var(--green)" }} /> {t}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* right — discord mock */}
              <DiscordMock />
            </div>
          </div>
        </section>

        {/* ── divider ──────────────────────────────────────────────── */}
        <div className="divider-glow mx-5 md:mx-auto max-w-6xl" />

        {/* ── Stats ────────────────────────────────────────────────── */}
        <section id="stats" className="py-20 px-5">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => <Counter key={s.label} stat={s} />)}
          </div>
        </section>

        {/* ── divider ──────────────────────────────────────────────── */}
        <div className="divider-glow mx-5 md:mx-auto max-w-6xl" />

        {/* ── Features ─────────────────────────────────────────────── */}
        <section id="features" className="py-28 px-5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <span className="badge-blue mb-5 inline-flex">Capabilities</span>
              <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight mb-4 text-white">
                Everything your server needs.
              </h2>
              <p className="text-sm max-w-md mx-auto" style={{ color: "var(--ink-muted)" }}>
                Nine core modules. One dashboard. Zero extra bots to juggle.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => <FeatureCard key={f.label} {...f} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── divider ──────────────────────────────────────────────── */}
        <div className="divider-glow mx-5 md:mx-auto max-w-6xl" />

        {/* ── How it works ─────────────────────────────────────────── */}
        <section id="how-it-works" className="py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <span className="badge-blue mb-5 inline-flex">Setup</span>
              <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight text-white">Live in 3 steps.</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="card-feature rounded-2xl p-7"
                  style={{ background: "var(--navy-2)", border: "1px solid var(--border)" }}
                >
                  <div className="step-num mb-4">{s.n}</div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA banner ───────────────────────────────────────────── */}
        <section className="py-28 px-5 relative overflow-hidden">
          <div className="divider-glow mb-0" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(61,126,255,0.07) 0%, transparent 70%)" }} />
          <div className="relative max-w-2xl mx-auto text-center pt-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="badge-blue mb-6 inline-flex"
            >
              Get started
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="font-extrabold text-3xl md:text-5xl tracking-tight mb-6 text-white"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              Add {BRAND} in{" "}
              <span className="text-shimmer">60 seconds.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="text-sm mb-10 max-w-sm mx-auto"
              style={{ color: "var(--ink-muted)" }}
            >
              Authorize with Discord, pick your server, done. No setup headaches.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <motion.a
                href={BOT_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest px-9 py-4 rounded-xl"
              >
                Add to Discord — it&apos;s free <ArrowRight size={14} />
              </motion.a>
              <motion.button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-ghost inline-flex items-center gap-2 font-semibold text-sm px-7 py-4 rounded-xl"
              >
                Sign in to dashboard
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-10 px-5" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3D7EFF, #2563EB)" }}>
              <Terminal size={10} className="text-white" />
            </div>
            <span className="font-bold text-sm text-white">{BRAND}</span>
          </div>
          <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
            © {new Date().getFullYear()} CodeX Devs. Not affiliated with Discord Inc.
          </p>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Docs"].map((l) => (
              <a key={l} href="#" className="nav-link text-xs uppercase tracking-wider font-semibold">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
