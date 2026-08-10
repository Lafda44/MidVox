"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { signIn } from "next-auth/react";
import {
  Shield, Zap, BarChart4, Ticket, Trophy, MessageSquare,
  ArrowRight, Terminal, CheckCircle2, Activity,
  Mail, Gavel, Bell, Users, Hash, Check, X, Moon, Sun,
} from "lucide-react";
import { motion } from "framer-motion";

const BRAND     = process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox";
const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";
const BOT_INVITE = CLIENT_ID
  ? `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot+applications.commands`
  : "https://discord.com/oauth2/authorize";

/* ─── Data ──────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Shield,        label: "AutoMod",       desc: "AI-backed raid, spam, and bad-actor detection before they cause damage." },
  { icon: Gavel,         label: "Moderation",    desc: "Warn, mute, kick, ban with full audit log, case history, and appeal flows." },
  { icon: Trophy,        label: "Leveling",      desc: "XP system with voice & text tracking, rank cards, and leaderboards." },
  { icon: Ticket,        label: "Tickets",       desc: "Structured support threads with categories, transcripts, and SLA timers." },
  { icon: BarChart4,     label: "Analytics",     desc: "Real-time member growth, message heatmaps, and channel activity graphs." },
  { icon: MessageSquare, label: "Logging",       desc: "Every edit, delete, join, and role change captured with full diff views." },
  { icon: Zap,           label: "Auto-Roles",    desc: "Reaction roles, join roles, level-gate roles, and timed role expiry." },
  { icon: Mail,          label: "DM Automation", desc: "Welcome DMs, onboarding flows, and custom triggers — no commands." },
  { icon: Activity,      label: "Uptime Monitor",desc: "Instant Discord notifications when any linked service changes state." },
];

const STATS = [
  { value: "12,400+", label: "Active Servers",  num: 12400 },
  { value: "4.2M+",   label: "Members Served",  num: 4200000 },
  { value: "99.8%",   label: "Uptime",          num: 99.8 },
  { value: "<120ms",  label: "Response Time",   num: 120 },
];

const STEPS = [
  { n: "01", title: "Add the bot",     desc: "Click 'Add to Discord', pick your server, and authorize in under 60 seconds." },
  { n: "02", title: "Sign in",         desc: "Log in with Discord to access your personal server management dashboard." },
  { n: "03", title: "Configure & go", desc: "Enable modules, tweak settings, and let your server run on autopilot." },
];

const COMPARISON = [
  { feature: "AutoMod & Raid Protection",  us: true,  a: false, b: false },
  { feature: "Leveling & XP System",       us: true,  a: true,  b: false },
  { feature: "Ticket System",              us: true,  a: false, b: true  },
  { feature: "Detailed Analytics",         us: true,  a: false, b: false },
  { feature: "Welcome DM Automation",      us: true,  a: true,  b: false },
  { feature: "One Dashboard for All",      us: true,  a: false, b: false },
];

/* ─── Fade-up wrapper ────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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
      if (isDecimal)              setShown(v.toFixed(1) + "%");
      else if (target >= 1_000_000) setShown((v / 1_000_000).toFixed(1) + "M+");
      else if (target >= 1_000)   setShown(Math.floor(v).toLocaleString() + "+");
      else                        setShown("<" + Math.ceil(v) + "ms");
      if (i >= steps) { setShown(stat.value); clearInterval(iv); }
    }, 28);
    return () => clearInterval(iv);
  }, [entered, stat]);

  return (
    <motion.div
      className="stat-box"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setEntered(true)}
      transition={{ duration: 0.4 }}
    >
      <div className="text-3xl font-black tracking-tight text-orange mb-1"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif", color: "var(--orange)" }}>
        {shown}
      </div>
      <div className="text-sm font-medium" style={{ color: "var(--ink-muted)" }}>{stat.label}</div>
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
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="card p-6"
    >
      <div className="icon-wrap mb-4">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-[15px] mb-2" style={{ color: "var(--ink)" }}>{label}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>{desc}</p>
    </motion.div>
  );
}

/* ─── Discord mock ───────────────────────────────────────────────────── */
function DiscordMock() {
  const feed = [
    { icon: <Shield size={12} />, color: "#8A9A5B", text: "AutoMod blocked a raid · 47 accounts",  time: "now" },
    { icon: <Trophy size={12} />, color: "#16A34A", text: "@Alex reached Level 25 🎉",              time: "2m"  },
    { icon: <Bell size={12} />,   color: "#7C3AED", text: "Ticket #142 opened by @Sara",            time: "5m"  },
    { icon: <Users size={12} />,  color: "#DC2626", text: "3 accounts flagged as fake invites",     time: "8m"  },
    { icon: <Hash size={12} />,   color: "#0369A1", text: "Welcome DM sent to @NewMember",         time: "12m" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.55 }}
      className="animate-float"
    >
      <div className="rounded-2xl overflow-hidden border bg-white"
        style={{ border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)" }}>
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)", background: "#FAFAFA" }}>
          <span className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#22C55E" }} />
          <span className="ml-3 text-xs font-mono font-medium" style={{ color: "var(--ink-faint)" }}>
            #{BRAND.toLowerCase()}-logs
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--green)" }}>
            <span className="dot-green" /> LIVE
          </span>
        </div>
        {/* feed */}
        <div className="p-4 space-y-3">
          {feed.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: item.color + "18", color: item.color }}>
                {item.icon}
              </div>
              <span className="text-xs flex-1" style={{ color: "var(--ink-muted)" }}>{item.text}</span>
              <span className="text-xs font-mono shrink-0" style={{ color: "var(--ink-faint)" }}>{item.time}</span>
            </motion.div>
          ))}
        </div>
        {/* input */}
        <div className="px-4 pb-4">
          <div className="rounded-lg px-3 py-2 text-xs font-mono"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--ink-faint)" }}>
            Message #{BRAND.toLowerCase()}-logs
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Comparison table ───────────────────────────────────────────────── */
function CompareTable() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white"
      style={{ border: "1px solid var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      {/* header */}
      <div className="grid grid-cols-4 text-xs font-bold uppercase tracking-wide"
        style={{ background: "#FAFAFA", borderBottom: "1px solid var(--border)" }}>
        <div className="px-5 py-3.5" style={{ color: "var(--ink-muted)" }}>Features</div>
        <div className="px-3 py-3.5 text-center">
          <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold"
            style={{ background: "var(--orange)" }}>{BRAND}</span>
        </div>
        <div className="px-3 py-3.5 text-center" style={{ color: "var(--ink-faint)" }}>Competitor A</div>
        <div className="px-3 py-3.5 text-center" style={{ color: "var(--ink-faint)" }}>Competitor B</div>
      </div>
      {COMPARISON.map((row, i) => (
        <div key={i}
          className="grid grid-cols-4 text-sm"
          style={{ borderBottom: i < COMPARISON.length - 1 ? "1px solid var(--border)" : "none" }}>
          <div className="px-5 py-3.5 font-medium" style={{ color: "var(--ink)" }}>{row.feature}</div>
          {[row.us, row.a, row.b].map((v, j) => (
            <div key={j} className="px-3 py-3.5 flex justify-center items-center">
              {v
                ? <Check size={16} className="font-bold" style={{ color: "var(--orange)" }} />
                : <X size={15} style={{ color: "var(--ink-faint)" }} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(window.localStorage.getItem("midvox-theme") === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", darkMode);
    window.localStorage.setItem("midvox-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }}>

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        style={{
          background: scrolled ? "var(--nav-scrolled)" : "var(--nav-bg)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 8px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-[66px] flex items-center justify-between gap-4">
          {/* logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--orange)", boxShadow: "0 2px 8px rgba(232,84,26,0.30)" }}>
              <Terminal size={14} className="text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight" style={{ color: "var(--ink)" }}>{BRAND}</span>
          </div>

          {/* nav */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: "Explore", id: "features" },
              { label: "Collections", id: "how-it-works" },
              { label: "Pricing", id: "compare" },
            ].map((l) => (
              <a key={l.label} href={`#${l.id}`} onClick={scrollTo(l.id)} className="nav-link">
                {l.label}
              </a>
            ))}
          </nav>

          {/* cta */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setDarkMode((value) => !value)}
              className="theme-toggle"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="btn-outline hidden md:inline-flex text-sm px-5 py-2.5"
            >
              Sign In
            </button>
            <motion.a
              href={BOT_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-orange text-sm px-5 py-2.5"
            >
              Join for free <ArrowRight size={13} />
            </motion.a>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="hero-bg pt-24 pb-20 px-5">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-12">
            {/* left */}
            <div className="max-w-4xl">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="mb-6">
                <span className="badge">
                  <span className="dot-green" />
                  New · the Discord community operating system
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}
                className="font-extrabold leading-tight mb-5"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", fontFamily: "var(--font-space-grotesk), sans-serif", color: "var(--ink)" }}
              >
                Build a better Discord{" "}
                <br className="hidden sm:block" />
                community with a{" "}
                <span style={{ color: "var(--orange)" }}>calmer control center</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                className="text-base leading-relaxed mb-8 max-w-lg"
                style={{ color: "var(--ink-muted)" }}
              >
                {BRAND} brings security, automation, and insight into one beautifully simple workspace for the people running online communities.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                className="flex flex-wrap gap-3 mb-8">
                <motion.a href={BOT_INVITE} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="btn-orange text-sm font-bold px-7 py-3.5">
                  Get Started <ArrowRight size={14} />
                </motion.a>
                <motion.button
                  onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="btn-outline text-sm px-6 py-3.5">
                  Sign In to Dashboard
                </motion.button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}
                className="flex flex-wrap gap-x-6 gap-y-2">
                {["Free to start", "No credit card required", "5-minute setup"].map((t) => (
                  <span key={t} className="check-item">
                    <CheckCircle2 size={14} style={{ color: "var(--orange)", flexShrink: 0, marginTop: 2 }} />
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* right */}
            <DiscordMock />
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <section id="stats" className="stats-backdrop py-16 px-5 bg-white">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => <Counter key={s.label} stat={s} />)}
          </div>
        </section>

        <div className="section-divider" />

        {/* ── Features ─────────────────────────────────────────────── */}
        <section id="features" className="py-24 px-5 bg-white">
          <div className="max-w-6xl mx-auto">
            <FadeUp className="text-center mb-14">
              <span className="section-kicker mb-4">Everything you need</span>
              <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight mb-4" style={{ color: "var(--ink)" }}>
                All-in-One Features for Modern Communities
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "var(--ink-muted)" }}>
                From security to analytics, {BRAND} has everything you need in one place.
              </p>
            </FadeUp>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => <FeatureCard key={f.label} {...f} index={i} />)}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── How it works ─────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 px-5" style={{ background: "var(--bg)" }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp className="text-center mb-14">
              <span className="badge mb-5 inline-flex">Setup</span>
              <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight mb-4" style={{ color: "var(--ink)" }}>
                See {BRAND} in Action
              </h2>
              <p className="text-base" style={{ color: "var(--ink-muted)" }}>
                Get started in three simple steps — no technical knowledge required.
              </p>
            </FadeUp>
            <div className="grid md:grid-cols-3 gap-5">
              {STEPS.map((s, i) => (
                <FadeUp key={s.n} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="card p-7">
                    <div className="step-num mb-3">{s.n}</div>
                    <h3 className="font-bold text-[15px] mb-2" style={{ color: "var(--ink)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--ink-muted)" }}>{s.desc}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── Comparison table ─────────────────────────────────────── */}
        <section id="compare" className="py-24 px-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp className="text-center mb-12">
              <span className="section-kicker mb-4">Built different</span>
              <h2 className="font-extrabold text-3xl md:text-4xl tracking-tight mb-4" style={{ color: "var(--ink)" }}>
                Why Choose {BRAND}?
              </h2>
              <p className="text-base" style={{ color: "var(--ink-muted)" }}>
                We outperform the competition in every important metric.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <CompareTable />
            </FadeUp>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="cta-section py-24 px-5">
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <span className="badge mb-6 inline-flex">Get started free</span>
              <h2 className="font-extrabold text-3xl md:text-5xl tracking-tight mb-5" style={{ color: "var(--ink)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                Add {BRAND} in{" "}
                <span style={{ color: "var(--orange)" }}>60 seconds.</span>
              </h2>
              <p className="text-base mb-10 max-w-md mx-auto" style={{ color: "var(--ink-muted)" }}>
                Authorize with Discord, pick your server, done. No setup headaches — your community is protected immediately.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.a
                  href={BOT_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-orange text-sm font-bold px-9 py-4"
                >
                  Add to Discord — it&apos;s free <ArrowRight size={14} />
                </motion.a>
                <motion.button
                  onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline text-sm px-7 py-4"
                >
                  Sign in to dashboard
                </motion.button>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-10 px-5 bg-white" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "var(--orange)" }}>
              <Terminal size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: "var(--ink)" }}>{BRAND}</span>
          </div>
          <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
            © {new Date().getFullYear()} CodeX Devs. Not affiliated with Discord Inc.
          </p>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Docs"].map((l) => (
              <a key={l} href="#" className="nav-link text-xs font-semibold uppercase tracking-wider">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
