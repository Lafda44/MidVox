"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, useMotionValue, useSpring, useInView, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  BarChart4,
  MessageSquare,
  ChevronRight,
  LayoutDashboard,
  LogIn,
  Layers,
  Sparkles,
  Bot,
  Activity,
  History,
  CheckCircle2,
  ShieldAlert,
  Globe,
  Users2,
  Lock,
  Gamepad2,
  Music4,
  User,
  Settings,
  Mail,
  ArrowRight,
  Download,
  Ban,
  Ticket,
  Server,
  TrendingUp,
  Bell,
  Search,
  Shield,
  Terminal,
  Radar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CyberBotMascot } from "@/components/cyber-bot-mascot";
import { cn } from "@/lib/utils";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "ZyroX";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

/* ── Animated char-by-char heading ─────────────────────────────────────── */
function AnimatedHeading({
  text,
  className,
  gradient = false,
  start = 0.05,
}: {
  text: string;
  className?: string;
  gradient?: boolean;
  start?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: start + i * 0.028, duration: 0.45, ease: "easeOut" }}
          className={cn("inline-block", gradient && "text-gradient")}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Interactive cyber particles canvas ────────────────────────────────── */
function CyberParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const mouse = { x: -9999, y: -9999 };
    const palette = ["99,102,241", "6,182,212", "168,85,247"];
    const COUNT = Math.min(70, Math.floor(w / 22));

    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
      c: palette[Math.floor(Math.random() * palette.length)],
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of nodes) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 0.01) {
          p.x += (dx / dist) * 0.6;
          p.y += (dy / dist) * 0.6;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},0.85)`;
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${a.c},${(1 - d / 110) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ── CountUp ───────────────────────────────────────────────────────────── */
function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);
  const spring = useSpring(value, { stiffness: 90, damping: 24 });

  useEffect(() => {
    if (!inView) return;
    value.set(to);
    const unsub = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = v.toFixed(decimals) + suffix;
      }
    });
    return unsub;
  }, [inView, to, decimals, suffix, value, spring]);

  return <span ref={ref}>{`0${suffix}`}</span>;
}

/* ── Neon toggle row (mock panels) ─────────────────────────────────────── */
function ToggleRow({ label, desc, initial = true }: { label: string; desc?: string; initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-200 truncate">{label}</p>
        {desc && <p className="text-[9px] text-slate-500 mt-0.5 truncate">{desc}</p>}
      </div>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setOn(!on)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300",
          on
            ? "bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(99,102,241,0.55)]"
            : "bg-slate-800"
        )}
      >
        <motion.span
          animate={{ left: on ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-md"
        />
      </button>
    </div>
  );
}

function SliderRow({ label, value, suffix = "%" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[11px] font-semibold text-slate-200">{label}</p>
        <p className="text-[10px] font-mono text-accent-hover tabular-nums">
          {value}
          {suffix}
        </p>
      </div>
      <div className="relative h-1.5 rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(99,102,241,0.6)]"
        />
      </div>
    </div>
  );
}

/* ── Live simulated security console ───────────────────────────────────── */
const CONSOLE_LINES: { time: string; tag: string; tone: string; text: string }[] = [
  { time: "20:41:07", tag: "CORE", tone: "text-violet-400", text: "Security shield armed — 18 modules online" },
  { time: "20:41:09", tag: "AUTO-MOD", tone: "text-cyan-400", text: "Deleted spam message in #general (score 96)" },
  { time: "20:41:11", tag: "ANTI-NUKE", tone: "text-rose-400", text: "Blocked role-deletion attempt by @mallory" },
  { time: "20:41:14", tag: "ANTI-SPAM+", tone: "text-cyan-400", text: "Purged 3 duplicate messages from #giveaways" },
  { time: "20:41:16", tag: "VERIFY", tone: "text-emerald-400", text: "@nova passed verification in 1.8s" },
  { time: "20:41:20", tag: "LOGGING", tone: "text-slate-400", text: "Audit snapshot synced — 12,440 events" },
  { time: "20:41:24", tag: "TICKETS", tone: "text-violet-400", text: "Ticket #42 opened by @rayexo" },
  { time: "20:41:28", tag: "LEVELING", tone: "text-amber-400", text: "@kira reached level 24 — reward role granted" },
  { time: "20:41:31", tag: "WELCOMER", tone: "text-cyan-400", text: "Welcome card rendered for @nova" },
  { time: "20:41:35", tag: "INSTA-DL", tone: "text-violet-400", text: "Saved reel from #media → media/8.2MB.mp4" },
  { time: "20:41:39", tag: "ANTI-RAID", tone: "text-emerald-400", text: "Join scan complete — 0 suspicious (2.0s)" },
  { time: "20:41:42", tag: "AUTO-REACT", tone: "text-slate-400", text: "Added reactions in #announcements" },
];

function SecurityConsole({ compact = false }: { compact?: boolean }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let line = 0;
    let chars = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      const current = CONSOLE_LINES[line % CONSOLE_LINES.length];
      chars += 1;
      setLineIdx(line % CONSOLE_LINES.length);
      setCharIdx(chars);
      if (chars >= current.text.length) {
        line += 1;
        chars = 0;
        timer = setTimeout(tick, 700);
      } else {
        timer = setTimeout(tick, 26);
      }
    };
    timer = setTimeout(tick, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [lineIdx, charIdx]);

  const visibleLines = CONSOLE_LINES.map((l, i) => ({ ...l, i }));
  const start = Math.max(0, lineIdx - 8);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-800 bg-[#030308]/90 shadow-[0_0_40px_-12px_rgba(99,102,241,0.25)]",
        compact ? "text-[8.5px] leading-[1.7]" : "text-[11px] leading-[1.8]"
      )}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950/80 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-rose-500/80" />
        <span className="h-2 w-2 rounded-full bg-amber-500/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
        <span className="ml-2 flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-slate-500">
          <Terminal className="h-2.5 w-2.5 text-accent-hover" />
          zyrox — security ops
        </span>
        <span className="ml-auto flex items-center gap-1 font-mono text-[8px] text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          LIVE
        </span>
      </div>

      {/* Scanline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scan" />

      {/* Log body */}
      <div ref={boxRef} className={cn("overflow-hidden px-3 py-2 font-mono", compact ? "h-28" : "h-56")}>
        {visibleLines.slice(start, start + 9).map((l) => {
          const isCurrent = l.i === lineIdx;
          const text = isCurrent ? l.text.slice(0, charIdx) : l.text;
          return (
            <div key={l.i} className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-slate-600">[{l.time}]</span>
              <span className={cn("shrink-0 font-bold", l.tone)}>{l.tag}</span>
              <span className={cn("text-slate-300", isCurrent && "text-slate-100")}>{text}</span>
              {isCurrent && <span className="ml-0.5 inline-block h-2.5 w-1 bg-cyan-400 animate-blink" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Interactive dashboard mockup ──────────────────────────────────────── */
type ViewKey = "overview" | "security" | "leveling" | "tickets";

const SIDEBAR_ITEMS: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "leveling", label: "Leveling", icon: BarChart4 },
  { key: "tickets", label: "Tickets", icon: Ticket },
];

function DashboardMockup() {
  const [view, setView] = useState<ViewKey>("overview");

  const metrics = [
    { label: "Guilds", value: 128, icon: Server, color: "text-primary-light" },
    { label: "Members", value: 48213, icon: Users2, color: "text-cyan-400" },
    { label: "API Latency", value: 34, icon: Zap, color: "text-emerald-400", suffix: "ms" },
  ];

  const bars = [34, 58, 42, 76, 51, 88, 64, 95, 72, 84, 61, 90];

  const events = [
    { icon: Ban, text: "Anti-Spam+ deleted 3 messages in #general", time: "2m ago", tone: "text-rose-400" },
    { icon: Download, text: "Instagram reel saved from #media", time: "5m ago", tone: "text-primary-light" },
    { icon: Ticket, text: "New ticket #42 created by @rayexo", time: "11m ago", tone: "text-amber-400" },
  ];

  const ranks = [
    { name: "rayexo", xp: "12,840 XP", pct: 92 },
    { name: "kira", xp: "11,205 XP", pct: 81 },
    { name: "nova", xp: "9,478 XP", pct: 68 },
    { name: "ash", xp: "7,112 XP", pct: 52 },
  ];

  const tickets = [
    { id: "#42", subject: "API rate limit bug", status: "Open", tone: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10" },
    { id: "#41", subject: "Invite link request", status: "Solved", tone: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
    { id: "#40", subject: "Premium refund", status: "In Progress", tone: "text-violet-400 border-violet-400/30 bg-violet-400/10" },
  ];

  const panelMeta: Record<ViewKey, { title: string; sub: string }> = {
    overview: { title: "Overview", sub: "Live metrics" },
    security: { title: "Security Console", sub: "Real-time shield activity" },
    leveling: { title: "Leveling", sub: "Top members this week" },
    tickets: { title: "Tickets", sub: "Open support threads" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-5xl"
      style={{ perspective: 1200 }}
    >
      {/* Glow under the window */}
      <div className="absolute inset-x-8 -bottom-8 h-24 rounded-full bg-primary/25 blur-[80px]" />
      <div className="absolute inset-x-24 -bottom-12 h-16 rounded-full bg-accent/15 blur-[70px]" />

      <div className="border-gradient relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/15">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-slate-800 bg-[#050509] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="mx-auto flex max-w-md flex-1 items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-1">
            <Lock className="h-3 w-3 text-slate-600" />
            <span className="font-mono text-[10px] text-slate-500">zyrox.app/dashboard</span>
          </div>
          <Bell className="h-3.5 w-3.5 text-slate-600" />
        </div>

        <div className="flex">
          {/* Mini sidebar */}
          <div className="hidden w-40 flex-col gap-1 border-r border-slate-800 bg-[#050509]/80 p-3 sm:flex">
            <div className="mb-3 flex items-center gap-2 px-2 py-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent shadow-[0_0_12px_rgba(99,102,241,0.5)]">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-50">{BRAND}</span>
            </div>

            {SIDEBAR_ITEMS.map((item) => {
              const active = view === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setView(item.key)}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200",
                    active ? "text-primary-light" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="mock-tab"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-lg border border-primary/30 bg-primary/15"
                    />
                  )}
                  <item.icon className={cn("relative z-10 h-3.5 w-3.5", active && "text-primary-light")} />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}

            <div className="mt-auto flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[8px] font-bold text-white">
                R
              </div>
              <span className="text-[9px] font-semibold text-slate-400">rayexo</span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            </div>
          </div>

          {/* Main panel */}
          <div className="flex-1 space-y-4 bg-slate-900/40 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-50">{panelMeta[view].title}</p>
                <p className="mt-0.5 text-[9px] text-slate-500">{panelMeta[view].sub}</p>
              </div>
              <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-slate-600 md:flex">
                <Search className="h-3 w-3" />
                <span className="text-[9px]">Search…</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-4"
              >
                {view === "overview" && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {metrics.map((m, i) => (
                        <motion.div
                          key={m.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                          className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                        >
                          <div className="mb-2 flex items-center gap-1.5">
                            <m.icon className={cn("h-3 w-3", m.color)} />
                            <span className="text-[8px] font-semibold uppercase tracking-widest text-slate-600">
                              {m.label}
                            </span>
                          </div>
                          <p className="font-mono text-lg font-bold tabular-nums text-slate-50">
                            <CountUp to={m.value} suffix={m.suffix || ""} />
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-600">
                          Message volume
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
                          <TrendingUp className="h-3 w-3" /> +12.4%
                        </span>
                      </div>
                      <div className="flex h-20 items-end gap-1.5">
                        {bars.map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.25 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                            className={cn(
                              "flex-1 rounded-sm",
                              i >= 7
                                ? "bg-gradient-to-t from-primary via-violet-400 to-accent-hover shadow-[0_0_14px_rgba(99,102,241,0.45)]"
                                : "bg-gradient-to-t from-primary/40 to-accent/25"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {events.map((e) => (
                        <div
                          key={e.text}
                          className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
                        >
                          <e.icon className={cn("h-3 w-3 shrink-0", e.tone)} />
                          <span className="flex-1 truncate text-[10px] text-slate-400">{e.text}</span>
                          <span className="font-mono text-[8px] text-slate-600">{e.time}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {view === "security" && <SecurityConsole compact />}

                {view === "leveling" && (
                  <div className="space-y-2">
                    {ranks.map((r, i) => (
                      <div key={r.name} className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5">
                        <div className="mb-1.5 flex items-center gap-2">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-md font-mono text-[8px] font-bold",
                              i === 0
                                ? "bg-gradient-to-br from-primary to-accent text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                : "bg-slate-800 text-slate-500"
                            )}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-200">{r.name}</span>
                          <span className="ml-auto font-mono text-[8px] text-slate-500">{r.xp}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${r.pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {view === "tickets" && (
                  <div className="space-y-1.5">
                    {tickets.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
                      >
                        <span className="font-mono text-[10px] font-bold text-primary-light">{t.id}</span>
                        <span className="flex-1 truncate text-[10px] text-slate-400">{t.subject}</span>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider",
                            t.tone
                          )}
                        >
                          {t.status}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 opacity-70">
                      <Radar className="h-3 w-3 text-slate-600" />
                      <span className="text-[9px] text-slate-500">Transcripts archived to #support-logs</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating toast */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.9, duration: 0.5, ease: "easeOut" }}
        className="glass-cyber absolute -right-2 top-24 flex items-center gap-3 rounded-xl px-3.5 py-2.5 sm:-right-6"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 neon-glow-primary">
          <Download className="h-3.5 w-3.5 text-primary-light" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-50">Reel downloaded</p>
          <p className="text-[9px] text-slate-500">#media → 8.2 MB mp4</p>
        </div>
      </motion.div>

      {/* Floating module pill */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.5, ease: "easeOut" }}
        className="glass-cyber absolute -bottom-5 -left-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 sm:-left-6"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] font-semibold text-slate-300">18 modules online</span>
      </motion.div>
    </motion.div>
  );
}

/* ── Interactive modules showcase ──────────────────────────────────────── */
const MODULE_TABS = [
  {
    key: "antinuke",
    name: "Anti-Nuke",
    desc: "Server lockdown protection",
    icon: ShieldAlert,
    rows: [
      { type: "toggle", label: "Server Lockdown", desc: "Freeze all destructive actions", initial: true },
      { type: "toggle", label: "Ban Blast Protection", desc: "Blocks mass-ban attacks", initial: true },
      { type: "toggle", label: "Whitelist Admins", desc: "Exempt trusted roles", initial: false },
      { type: "slider", label: "Sensitivity", value: 85 },
      { type: "toggle", label: "Auto-Kick on Alert", desc: "Removes flagged members", initial: true },
    ],
  },
  {
    key: "leveling",
    name: "Leveling",
    desc: "XP, ranks and leaderboards",
    icon: BarChart4,
    rows: [
      { type: "toggle", label: "XP Enabled", desc: "Earn XP per message", initial: true },
      { type: "toggle", label: "Level-up Messages", desc: "Announce in channel", initial: true },
      { type: "toggle", label: "Reward Roles", desc: "Auto roles on level", initial: false },
      { type: "slider", label: "XP Rate", value: 1.5, suffix: "x" },
      { type: "toggle", label: "Leaderboard", desc: "Public /leaderboard", initial: true },
    ],
  },
  {
    key: "welcomer",
    name: "Welcomer",
    desc: "Custom join messages",
    icon: Sparkles,
    rows: [
      { type: "toggle", label: "Welcome Messages", desc: "Embed + image card", initial: true },
      { type: "toggle", label: "DM on Join", desc: "Personalized DM", initial: true },
      { type: "toggle", label: "Auto Role", desc: "Assign instantly", initial: true },
      { type: "slider", label: "Card Delay", value: 2, suffix: "s" },
      { type: "toggle", label: "Background Image", desc: "Custom banner", initial: false },
    ],
  },
  {
    key: "antispam",
    name: "Anti-Spam+",
    desc: "Message and command filtering",
    icon: Activity,
    rows: [
      { type: "toggle", label: "Message Filter", desc: "Deletes flagged content", initial: true },
      { type: "toggle", label: "Link Scanning", desc: "Suspicious URL detection", initial: true },
      { type: "toggle", label: "Caps Lock Filter", desc: "SHOUTING punishment", initial: false },
      { type: "slider", label: "Strictness", value: 70 },
      { type: "toggle", label: "Auto Deletion", desc: "Clean history instantly", initial: true },
    ],
  },
] as const;

function ModuleShowcase() {
  const [active, setActive] = useState<(typeof MODULE_TABS)[number]["key"]>("antinuke");
  const tab = MODULE_TABS.find((t) => t.key === active)!;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[280px_1fr]">
      {/* Tab list */}
      <div className="glass-cyber flex gap-2 overflow-x-auto p-2 no-scrollbar lg:flex-col">
        {MODULE_TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={cn(
                "relative flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors duration-200 lg:w-full",
                isActive ? "text-slate-50" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="module-tab"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-xl border border-primary/40 bg-primary/15 neon-glow-primary"
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                  isActive
                    ? "border-primary/40 bg-gradient-to-br from-primary/30 to-accent/20 text-primary-light"
                    : "border-slate-800 bg-slate-900 text-slate-500"
                )}
              >
                <t.icon className="h-4 w-4" />
              </span>
              <span className="relative z-10 min-w-0">
                <span className="block text-xs font-bold">{t.name}</span>
                <span className="block truncate text-[10px] text-slate-500">{t.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Preview panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab.key}
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="glass-cyber overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30">
                <tab.icon className="h-4 w-4 text-primary-light" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-50">{tab.name}</p>
                <p className="text-[10px] text-slate-500">Live settings preview</p>
              </div>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Synced
            </span>
          </div>

          <div className="space-y-1 px-5 py-4">
            {tab.rows.map((row) =>
              row.type === "toggle" ? (
                <ToggleRow
                  key={row.label}
                  label={row.label}
                  desc={(row as { desc?: string }).desc}
                  initial={(row as { initial?: boolean }).initial}
                />
              ) : (
                <SliderRow
                  key={row.label}
                  label={row.label}
                  value={(row as { value: number }).value}
                  suffix={(row as { suffix?: string }).suffix}
                />
              )
            )}
          </div>

          <div className="border-t border-white/10 px-5 py-3">
            <Button size="sm" className="btn-slide w-full gap-2 font-semibold neon-glow-primary">
              <Settings className="h-3.5 w-3.5" />
              Open in Dashboard
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Landing page ──────────────────────────────────────────────────────── */
export default function LandingPage() {
  const features = [
    {
      title: "Server Security",
      desc: "Anti-nuke, automod, verification and anti-spam tools that protect your community around the clock.",
      icon: ShieldCheck,
    },
    {
      title: "Engagement",
      desc: "Welcome messages, leveling, vanity roles and reaction roles that keep members active.",
      icon: Zap,
    },
    {
      title: "Support Systems",
      desc: "Ticket management with transcripts, join-to-create voice channels and custom role menus.",
      icon: MessageSquare,
    },
    {
      title: "Insights",
      desc: "Invite tracking, member analytics and detailed moderation logs in one place.",
      icon: BarChart4,
    },
    {
      title: "Automation",
      desc: "Auto role assignment, join DMs and auto reactions configured in minutes.",
      icon: Settings,
    },
    {
      title: "Modern Dashboard",
      desc: "Every module configured from a single, fast dashboard. No commands required.",
      icon: LayoutDashboard,
    },
  ];

  const modules = [
    { name: "Anti-Nuke", desc: "Lockdown protection", icon: ShieldAlert },
    { name: "Automod", desc: "Moderation rules", icon: ShieldCheck },
    { name: "Anti-Spam+", desc: "Message filtering", icon: Activity },
    { name: "Verification", desc: "Bot-free onboarding", icon: CheckCircle2 },
    { name: "Welcome", desc: "Custom join messages", icon: Sparkles },
    { name: "Leveling", desc: "XP, ranks, leaderboards", icon: BarChart4 },
    { name: "Vanity Roles", desc: "Server identity", icon: Gamepad2 },
    { name: "Auto Role", desc: "Instant assignment", icon: User },
    { name: "Reaction Roles", desc: "Role menus by reaction", icon: Layers },
    { name: "Tickets", desc: "Support with transcripts", icon: MessageSquare },
    { name: "Join to Create", desc: "Self-serve voice", icon: Music4 },
    { name: "Invites", desc: "Growth tracking", icon: Globe },
    { name: "Join DM", desc: "Personalized DMs", icon: Mail },
    { name: "Custom Roles", desc: "User-purchased roles", icon: Lock },
    { name: "Logging", desc: "Full audit trail", icon: History },
    { name: "Insta Downloader", desc: "Auto-save media", icon: Download },
  ];

  const faqs = [
    {
      q: "Is the bot free to use?",
      a: "The core engine is 100% free for all communities. Premium features are available for larger servers.",
    },
    {
      q: "How do I configure modules?",
      a: "Invite the bot, then manage every module from the web dashboard — no commands needed.",
    },
    {
      q: "Can I migrate from other bots?",
      a: "Yes. Leveling and configuration data can be imported from most popular bots in minutes.",
    },
    {
      q: "Where is my server data stored?",
      a: "Configuration data is stored securely and encrypted at rest. We never store personal user data beyond Discord's requirements.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-slate-200">
      {/* Cyber grid + interactive particles */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 cyber-grid-bg opacity-70" />
      </div>
      <CyberParticles />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-800/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_0_18px_rgba(99,102,241,0.45)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold leading-none tracking-tight text-slate-50">{BRAND}</h1>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Discord Bot
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-slate-500 lg:flex">
            <Link href="#features" className="transition-colors hover:text-primary-light">
              Features
            </Link>
            <Link href="#modules" className="transition-colors hover:text-primary-light">
              Modules
            </Link>
            <Link href="#faq" className="transition-colors hover:text-primary-light">
              FAQ
            </Link>
          </div>

          <Button
            onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
            className="btn-slide gap-2 px-5 text-[10px] font-semibold uppercase tracking-wider neon-glow-primary"
          >
            <LogIn className="h-3.5 w-3.5" />
            Login
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 px-6 pb-16 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Floating mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-6 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-[-30px] rounded-full bg-primary/25 blur-2xl" />
              <CyberBotMascot className="relative h-28 w-28 drop-shadow-[0_0_24px_rgba(99,102,241,0.5)] md:h-36 md:w-36" />
            </motion.div>
          </motion.div>

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass-cyber flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-light neon-glow-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              System online — trusted by 120+ servers
            </motion.div>
          </motion.div>

          <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight text-slate-50 sm:text-6xl md:text-7xl">
            <AnimatedHeading text="Everything your server needs." />
            <AnimatedHeading text="One dashboard." gradient start={0.7} className="mt-2 block" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400"
          >
            Anti-nuke, automod, tickets, leveling and Instagram media saving — configured visually from a
            single dashboard. No commands required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              size="lg"
              className="btn-slide w-full gap-2.5 font-semibold neon-glow-primary sm:w-auto"
            >
              <LayoutDashboard className="h-4 w-4" />
              Open Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="btn-slide w-full gap-2.5 border-slate-700 font-semibold transition-colors duration-300 hover:border-accent/50 hover-neon-cyan sm:w-auto"
            >
              <Link href="#features">
                View Features
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="mt-16 px-6">
          <DashboardMockup />
        </div>
      </header>

      {/* Live Security Ops */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-hover">
              Live Security Ops
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
              Watch the shield <span className="neon-text">working in real time</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              Every event the bot handles is streamed to a live terminal — spam, raids, verifications and
              downloads, as they happen.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-primary/15 via-transparent to-accent/15 blur-2xl" />
            <SecurityConsole />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: Shield, label: "Shield uptime 99.98%", tone: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
                { icon: Activity, label: "12,440 events / day", tone: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10" },
                { icon: Radar, label: "Scan: 2.0s average", tone: "text-violet-400 border-violet-400/30 bg-violet-400/10" },
              ].map((s) => (
                <span
                  key={s.label}
                  className={cn("flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest", s.tone)}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-light">
                Features
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
                Built for communities that take moderation seriously
              </h2>
            </div>
            <p className="max-w-sm text-sm text-slate-500">
              Every module is production-tested and configurable through a clean, fast interface.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="glass-cyber card-3d group overflow-hidden p-6"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="hover-neon-primary mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/25 to-accent/15 transition-transform duration-300 group-hover:scale-105">
                  <feature.icon className="h-5 w-5 text-primary-light transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="mb-2 text-base font-bold tracking-tight text-slate-50">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-primary/50 via-accent/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Modules Showcase */}
      <section id="modules" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-light">
              Modules
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
              17 modules. Fully configurable.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              Click a module to preview its actual settings panel — every toggle below is live.
            </p>
          </div>

          <ModuleShowcase />

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="glass-cyber group p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className={cn(
                    "mb-4 flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300 group-hover:scale-110",
                    i % 2 === 0
                      ? "border-primary/30 bg-primary/10 group-hover-glow-primary"
                      : "border-accent/30 bg-accent/10 group-hover-glow-cyan"
                  )}
                >
                  <mod.icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      i % 2 === 0 ? "text-primary-light" : "text-accent-hover"
                    )}
                  />
                </div>
                <h4 className="mb-1 text-sm font-bold tracking-tight text-slate-50">{mod.name}</h4>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="neon-panel border-gradient relative overflow-hidden rounded-3xl p-12 text-center md:p-16"
          >
            <div className="absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]" />
            <div className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-accent/20 blur-[100px]" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-14 right-8 hidden md:block"
            >
              <CyberBotMascot className="h-32 w-32 drop-shadow-[0_0_28px_rgba(6,182,212,0.45)]" />
            </motion.div>

            <div className="relative z-10">
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-accent-hover">
                {"// zero commands required"}
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-50 md:text-5xl">
                Ready to upgrade <span className="neon-text">your server?</span>
              </h2>
              <p className="mx-auto mb-8 max-w-xl leading-relaxed text-slate-400">
                Set up takes less than a minute. Invite the bot and configure everything from the dashboard.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                  size="lg"
                  className="btn-slide gap-2.5 px-10 font-semibold neon-glow-primary"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="btn-slide gap-2.5 border-slate-700 font-semibold transition-colors duration-300 hover:border-primary/50 hover-neon-primary"
                >
                  <Link href="/docs">
                    <Shield className="h-4 w-4" />
                    Read the Docs
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-light">
              FAQ
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-50">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <motion.div
                key={item.q}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="glass-cyber p-6 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <h4 className="mb-2 flex items-center gap-2.5 text-sm font-bold tracking-tight text-slate-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                  {item.q}
                </h4>
                <p className="text-sm leading-relaxed text-slate-500">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-background-deep py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_0_14px_rgba(99,102,241,0.4)]">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-50">{BRAND}</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-slate-600">
                The Discord management platform for communities that care about quality moderation.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <Link href="/docs" className="transition-colors hover:text-primary-light">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-primary-light">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition-colors hover:text-primary-light">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600">
                Platform
              </h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <Link href="/dashboard" className="transition-colors hover:text-primary-light">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="transition-colors hover:text-primary-light">
                    API
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 md:flex-row">
            <p className="text-xs text-slate-500">
              © 2026 {BRAND} Development. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
