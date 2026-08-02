"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Zap, BarChart4, MessageSquare, ChevronRight, LayoutDashboard,
  LogIn, Layers, Sparkles, Activity, History, CheckCircle2, ShieldAlert,
  Globe, Users2, Lock, Gamepad2, Music4, User, Settings, Mail, ArrowRight,
  Download, Ban, Ticket, Server, TrendingUp, Bell, Search,   Shield, Terminal,
  ArrowUpRight, Cpu, Wifi, HardDrive, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "ZyroX";

/* ── Subtle particle canvas ─────────────────────────────────────────────── */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.4,
      color: Math.random() > 0.5 ? "99,102,241" : "34,211,238",
    }));

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},0.6)`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${pts[i].color},${(1 - d / 120) * 0.12})`;
            ctx.lineWidth = 0.8;
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
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="fixed inset-0 z-0 pointer-events-none opacity-50" />;
}

/* ── CountUp ────────────────────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const val = useMotionValue(0);
  const spring = useSpring(val, { stiffness: 80, damping: 22 });

  useEffect(() => {
    if (!inView) return;
    val.set(to);
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    });
  }, [inView, to, suffix, val, spring]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ── Security terminal ──────────────────────────────────────────────────── */
const LOGS = [
  { tag: "SHIELD",    tone: "text-primary-light",  text: "Anti-Nuke armed — 18 modules online" },
  { tag: "AUTOMOD",   tone: "text-cyan-400",        text: "Deleted spam in #general (score 97)" },
  { tag: "ANTINUKE",  tone: "text-rose-400",        text: "Blocked role-delete by @mallory#1337" },
  { tag: "VERIFY",    tone: "text-emerald-400",     text: "@nova passed gateway in 1.8s" },
  { tag: "TICKETS",   tone: "text-violet-400",      text: "Ticket #42 opened by @rayexo" },
  { tag: "LEVELING",  tone: "text-amber-400",       text: "@kira reached level 24, role granted" },
  { tag: "INSTA-DL",  tone: "text-primary-light",   text: "Saved reel → #media/clip-8.2MB.mp4" },
  { tag: "ANTI-SPAM", tone: "text-cyan-400",        text: "Purged 3 duplicates from #giveaways" },
  { tag: "RAID-SCAN", tone: "text-emerald-400",     text: "Join scan complete — 0 suspicious (2s)" },
  { tag: "WELCOMER",  tone: "text-violet-400",      text: "Welcome card rendered for @nova" },
];

function Terminal_() {
  const [lines, setLines] = useState<typeof LOGS>([]);
  const [current, setCurrent] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let idx = 0;
    let chars = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      chars++;
      setCharIdx(chars);
      const len = LOGS[idx % LOGS.length].text.length;
      if (chars >= len) {
        setLines((prev) => {
          const next = [...prev, LOGS[idx % LOGS.length]];
          return next.slice(-9);
        });
        idx++;
        chars = 0;
        setCurrent(idx % LOGS.length);
        setCharIdx(0);
        timer = setTimeout(tick, 900);
      } else {
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 600);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [lines, charIdx]);

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#06060f] shadow-2xl shadow-black/60">
      {/* chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#09090f] border-b border-white/[0.06]">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 font-mono text-[9px] uppercase tracking-widest text-white/25">
          {BRAND.toLowerCase()} — security ops
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          LIVE
        </span>
      </div>

      {/* scanline */}
      <div className="pointer-events-none absolute inset-x-0 h-6 bg-gradient-to-b from-primary/10 to-transparent animate-scan" />

      {/* log body */}
      <div ref={boxRef} className="h-52 overflow-y-hidden px-4 py-3 font-mono text-[10.5px] leading-[1.85] space-y-0.5">
        {lines.map((l, i) => (
          <div key={i} className="flex items-baseline gap-2.5">
            <span className="text-white/20 shrink-0 select-none">›</span>
            <span className={cn("font-bold shrink-0 min-w-[68px]", l.tone)}>{l.tag}</span>
            <span className="text-white/55">{l.text}</span>
          </div>
        ))}
        {/* typing line */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-white/20 shrink-0 select-none">›</span>
          <span className={cn("font-bold shrink-0 min-w-[68px]", LOGS[current].tone)}>{LOGS[current].tag}</span>
          <span className="text-white/80">
            {LOGS[current].text.slice(0, charIdx)}
            <span className="inline-block h-2.5 w-0.5 bg-cyan-400 ml-0.5 animate-blink" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Interactive dashboard mockup ───────────────────────────────────────── */
type View = "overview" | "security" | "leveling" | "tickets";

function DashboardMockup() {
  const [view, setView] = useState<View>("overview");

  const views: { key: View; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview",  label: "Overview",  icon: LayoutDashboard },
    { key: "security",  label: "Security",  icon: ShieldCheck },
    { key: "leveling",  label: "Leveling",  icon: BarChart4 },
    { key: "tickets",   label: "Tickets",   icon: Ticket },
  ];

  const bars = [38, 55, 42, 78, 52, 88, 65, 95, 74, 85, 62, 91];
  const ranks = [
    { name: "rayexo", xp: "12,840", pct: 92 },
    { name: "kira",   xp: "11,205", pct: 81 },
    { name: "nova",   xp: "9,478",  pct: 68 },
    { name: "ash",    xp: "7,112",  pct: 52 },
  ];
  const tickets_ = [
    { id: "#42", sub: "API rate limit bug",  status: "Open",        cls: "text-cyan-400 bg-cyan-400/10 border-cyan-400/25" },
    { id: "#41", sub: "Invite link request", status: "Closed",      cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25" },
    { id: "#40", sub: "Premium refund",      status: "In Progress", cls: "text-violet-400 bg-violet-400/10 border-violet-400/25" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1400 }}
      className="relative mx-auto w-full max-w-5xl"
    >
      {/* glow under */}
      <div className="absolute inset-x-16 -bottom-10 h-20 rounded-full bg-primary/20 blur-[72px]" />

      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#08080f] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
        {/* browser chrome */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#060610] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/75" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/75" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/75" />
          </div>
          <div className="flex-1 max-w-sm mx-auto flex items-center gap-2 rounded-md px-3 py-1 bg-white/[0.04] border border-white/[0.06]">
            <Lock className="h-2.5 w-2.5 text-white/25" />
            <span className="font-mono text-[10px] text-white/30">{BRAND.toLowerCase()}.app/dashboard</span>
          </div>
          <Bell className="h-3.5 w-3.5 text-white/20" />
        </div>

        <div className="flex">
          {/* sidebar */}
          <div className="hidden sm:flex flex-col w-40 shrink-0 bg-[#070712] border-r border-white/[0.05] p-3 gap-0.5">
              <div className="flex items-center gap-2 px-2 py-2.5 mb-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#6B76F5] to-[#4752C4] flex items-center justify-center shadow-[0_0_12px_rgba(88,101,242,0.5)]">
                  <Zap className="h-3 w-3 text-white" fill="currentColor" />
                </div>
                <span className="text-xs font-bold text-white">{BRAND}</span>
              </div>

            {views.map((v) => {
              const active = v.key === view;
              return (
                <button
                  key={v.key}
                  onClick={() => setView(v.key)}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200",
                    active ? "text-white" : "text-white/30 hover:text-white/60"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/[0.1]"
                    />
                  )}
                  <v.icon className="relative z-10 h-3.5 w-3.5" />
                  <span className="relative z-10">{v.label}</span>
                </button>
              );
            })}

            <div className="mt-auto flex items-center gap-2 rounded-lg px-2.5 py-2 bg-white/[0.04] border border-white/[0.06]">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[8px] font-bold text-white">R</div>
              <span className="text-[9px] font-semibold text-white/40">rayexo</span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            </div>
          </div>

          {/* main panel */}
          <div className="flex-1 p-4 space-y-3 bg-[#08080f]">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {view === "overview" && (
                  <>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: "Guilds",  value: 128,   icon: Server,  color: "text-primary-light" },
                        { label: "Members", value: 48213, icon: Users2,  color: "text-cyan-400" },
                        { label: "Latency", value: 34,    icon: Zap,     color: "text-emerald-400", suffix: "ms" },
                      ].map((m) => (
                        <div key={m.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <m.icon className={cn("h-3 w-3", m.color)} />
                            <span className="font-mono text-[8px] uppercase tracking-widest text-white/25">{m.label}</span>
                          </div>
                          <p className="font-mono text-lg font-bold text-white tabular-nums">
                            <CountUp to={m.value} suffix={m.suffix || ""} />
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* chart */}
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[8px] uppercase tracking-widest text-white/25">Message volume</span>
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
                          <TrendingUp className="h-2.5 w-2.5" /> +12.4%
                        </span>
                      </div>
                      <div className="flex items-end gap-1 h-16">
                        {bars.map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.4 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                            className={cn(
                              "flex-1 rounded-sm",
                              i >= 7
                                ? "bg-gradient-to-t from-primary to-accent shadow-[0_0_8px_rgba(88,101,242,0.4)]"
                                : "bg-white/[0.08]"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* events */}
                    <div className="space-y-1.5">
                      {[
                        { icon: Ban,      text: "Anti-Spam+ deleted 3 messages in #general", time: "2m", tone: "text-rose-400" },
                        { icon: Download, text: "Instagram reel saved from #media",          time: "5m", tone: "text-primary-light" },
                        { icon: Ticket,   text: "Ticket #42 opened by @rayexo",             time: "11m", tone: "text-amber-400" },
                      ].map((e) => (
                        <div key={e.text} className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                          <e.icon className={cn("h-2.5 w-2.5 shrink-0", e.tone)} />
                          <span className="flex-1 text-[10px] text-white/40 truncate">{e.text}</span>
                          <span className="font-mono text-[8px] text-white/20">{e.time}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {view === "security" && <Terminal_ />}

                {view === "leveling" && (
                  <div className="space-y-2">
                    {ranks.map((r, i) => (
                      <div key={r.name} className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={cn(
                            "flex h-5 w-5 items-center justify-center rounded font-mono text-[8px] font-bold",
                            i === 0 ? "bg-primary/80 text-white" : "bg-white/[0.06] text-white/30"
                          )}>{i + 1}</span>
                          <span className="text-[10px] font-semibold text-white/70">{r.name}</span>
                          <span className="ml-auto font-mono text-[8px] text-white/30">{r.xp} XP</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.07]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${r.pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {view === "tickets" && (
                  <div className="space-y-1.5">
                    {tickets_.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
                        <span className="font-mono text-[10px] font-bold text-primary-light">{t.id}</span>
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
      </div>

      {/* floating badges */}
      <motion.div
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
        className="absolute -right-3 sm:-right-8 top-28 flex items-center gap-3 rounded-xl border border-white/[0.1] bg-[#0d0d1c]/90 backdrop-blur-xl px-3.5 py-2.5 shadow-2xl"
      >
        <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
          <Download className="h-3.5 w-3.5 text-primary-light" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-white">Reel downloaded</p>
          <p className="text-[9px] text-white/35">#media → 8.2 MB mp4</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.0, duration: 0.6, ease: "easeOut" }}
        className="absolute -left-3 sm:-left-8 -bottom-4 flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#0d0d1c]/90 backdrop-blur-xl px-3.5 py-2.5 shadow-2xl"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] font-semibold text-white/70">18 modules online</span>
      </motion.div>
    </motion.div>
  );
}

/* ── Falling sakura petals ───────────────────────────────────────────────── */
function Petals({ count = 14 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: `${(i * 7.3 + 3) % 100}%`,
              width: `${6 + (i % 4) * 2.5}px`,
              height: `${6 + (i % 4) * 2.5}px`,
              animationDuration: `${9 + (i % 7) * 2.6}s`,
              animationDelay: `${-i * 1.9}s`,
              "--sway": `${(i % 5) * 22 - 44}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ── Brand logo mark ─────────────────────────────────────────────────────── */
function LogoMark({ size = "h-9 w-9", iconSize = "h-[18px] w-[18px]" }: { size?: string; iconSize?: string }) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B76F5] to-[#4752C4] shadow-[0_0_20px_rgba(88,101,242,0.5)]",
        size
      )}
    >
      <Zap className={cn("text-white", iconSize)} fill="currentColor" />
      <div className="absolute inset-0 rounded-xl border border-white/25" />
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-pulse" />
    </div>
  );
}

/* ── Feature card ────────────────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon, title, desc, tags = [], delay = 0, accent = "indigo", index = 0,
}: {
  icon: typeof ShieldCheck; title: string; desc: string; tags?: string[];
  delay?: number; accent?: "indigo" | "cyan" | "violet"; index?: number;
}) {
  const accentMap = {
    indigo: { text: "text-[#a5affb]", chip: "bg-[#5865F2]/15 border-[#5865F2]/30", glow: "rgba(88,101,242,0.5)", spot: "rgba(88,101,242,0.15)", orb: "rgba(88,101,242,0.18)", border: "hover:border-[#7C85FD]/40" },
    cyan:   { text: "text-cyan-300",   chip: "bg-cyan-500/15 border-cyan-500/30",   glow: "rgba(56,189,248,0.45)", spot: "rgba(56,189,248,0.13)", orb: "rgba(56,189,248,0.16)", border: "hover:border-cyan-400/40" },
    violet: { text: "text-violet-300", chip: "bg-violet-500/15 border-violet-500/30", glow: "rgba(168,85,247,0.45)", spot: "rgba(168,85,247,0.13)", orb: "rgba(168,85,247,0.16)", border: "hover:border-violet-400/40" },
  };
  const a = accentMap[accent];

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(139,151,255,0.16)] bg-[#0d0d1f] p-6 transition-all duration-300 cursor-pointer",
        "hover:-translate-y-1.5 hover:border-[rgba(139,151,255,0.38)] hover:bg-[#0f0f26] hover:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75)]"
      )}
    >
      {/* cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), ${a.spot}, transparent 65%)` }}
      />
      {/* top gradient hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* corner orb */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: a.orb }}
      />
      {/* HUD corner brackets */}
      <div className="hud-corners" />
      {/* index watermark */}
      <span className="absolute right-5 top-5 font-mono text-[11px] text-white/15 transition-colors duration-300 group-hover:text-white/40">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* icon chip */}
      <div
        className={cn(
          "feat-icon mb-5 flex h-11 w-11 items-center justify-center rounded-xl border",
          a.chip
        )}
        style={{ "--glow": a.glow } as React.CSSProperties}
      >
        <Icon className={cn("h-5 w-5", a.text)} />
      </div>
      <h3 className="mb-2.5 text-[15px] font-bold tracking-tight text-white">{title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-muted">{desc}</p>

      {/* spec tags */}
      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-primary/25 bg-primary/[0.08] px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#a5affb]/70 transition-colors duration-300 group-hover:border-primary/40 group-hover:text-[#a5affb]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Module pill ─────────────────────────────────────────────────────────── */
function ModulePill({ name, icon: Icon, idx }: { name: string; icon: typeof ShieldAlert; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: idx * 0.04, duration: 0.4 }}
      className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 bg-[#0d0d1f] border border-[rgba(139,151,255,0.14)] hover:bg-[#12122a] hover:border-[rgba(139,151,255,0.32)] transition-all duration-200 group cursor-pointer"
    >
      <Icon className="h-3.5 w-3.5 text-primary-light/70 group-hover:text-primary-light transition-colors" />
      <span className="text-xs font-medium text-muted group-hover:text-white/85 transition-colors">{name}</span>
    </motion.div>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────────── */
function StatCard({ value, label, sub, icon: Icon }: { value: string; label: string; sub?: string; icon: typeof Server }) {
  return (
    <div className="flex flex-col gap-1 p-6 rounded-xl border border-[rgba(139,151,255,0.14)] bg-[#0d0d1f]">
      <Icon className="h-4 w-4 text-primary-light/60 mb-1" />
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-sm font-medium text-muted">{label}</p>
      {sub && <p className="text-xs text-faint mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── FAQ item ────────────────────────────────────────────────────────────── */
function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.07, duration: 0.4 }}
      className="border-b border-white/[0.07] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors pr-8">{q}</span>
        <ChevronRight className={cn("h-4 w-4 text-white/30 shrink-0 transition-transform duration-300", open && "rotate-90")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main landing page ───────────────────────────────────────────────────── */
export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);

  const features = [
    { title: "Anti-Nuke",       desc: "Instant lockdown against mass bans, channel wipes, and rogue admin attacks — resolved in milliseconds.", tags: ["2ms lockdown", "Instant restore"], icon: ShieldAlert,     accent: "indigo" as const },
    { title: "Smart Automod",   desc: "ML-powered message scoring catches spam, scam links, and NSFW content before anyone sees it.",        tags: ["ML scoring", "0 false positives"], icon: ShieldCheck,  accent: "cyan"   as const },
    { title: "Leveling",        desc: "XP tracking, custom rank cards, reward roles, and a public leaderboard — all configurable per server.", tags: ["Custom rank cards", "Reward roles"], icon: BarChart4, accent: "violet" as const },
    { title: "Ticket System",   desc: "Panel-based support tickets with transcripts, category routing, and staff assignments.",             tags: ["Auto transcripts", "Routing"], icon: MessageSquare, accent: "indigo" as const },
    { title: "Engagement",      desc: "Reaction roles, welcome cards, vanity roles and join DMs that keep members coming back.",            tags: ["Welcome cards", "Reaction roles"], icon: Sparkles,  accent: "cyan"   as const },
    { title: "One Dashboard",   desc: "Configure every module from a single fast interface — no slash commands, no YAML, no headaches.",    tags: ["Zero commands", "1-click setup"], icon: LayoutDashboard, accent: "violet" as const },
  ];

  const modules = [
    { name: "Anti-Nuke",       icon: ShieldAlert  },
    { name: "Automod",         icon: ShieldCheck  },
    { name: "Anti-Spam+",      icon: Activity     },
    { name: "Verification",    icon: CheckCircle2 },
    { name: "Welcomer",        icon: Sparkles     },
    { name: "Leveling",        icon: BarChart4    },
    { name: "Vanity Roles",    icon: Gamepad2     },
    { name: "Auto Role",       icon: User         },
    { name: "Reaction Roles",  icon: Layers       },
    { name: "Tickets",         icon: MessageSquare},
    { name: "Join to Create",  icon: Music4       },
    { name: "Invites",         icon: Globe        },
    { name: "Join DM",         icon: Mail         },
    { name: "Custom Roles",    icon: Lock         },
    { name: "Logging",         icon: History      },
    { name: "Insta Downloader",icon: Download     },
  ];

  const faqs = [
    { q: "Is the bot free?",                a: "The full core feature set is free for any server. We may offer priority support or extended limits for premium plans in future." },
    { q: "How do I configure modules?",     a: "Invite the bot, authenticate with Discord on this site, select your server, and configure everything from the visual dashboard — no commands required." },
    { q: "Can I migrate from other bots?",  a: "Leveling data from MEE6 and other common bots can be imported via the dashboard in a few clicks." },
    { q: "Is my server data safe?",         a: "Configuration is stored encrypted at rest. We only retain what Discord requires us to — no message content, no personal data beyond what you can see." },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-aurora font-sans text-white">
      <Particles />
      <Petals />

      {/* dot grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 dot-grid opacity-80" />

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-[#05050b]/85 backdrop-blur-xl">
        {/* gradient hairline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* logo */}
          <div className="relative flex items-center gap-3">
            <LogoMark />
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-white">{BRAND}</span>
              <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.3em] text-white/30">
                Discord Bot
              </span>
            </div>
          </div>

          {/* links */}
          <div className="hidden items-center gap-1 lg:flex">
            {[["Features", "#features"], ["Modules", "#modules"], ["FAQ", "#faq"]].map(([l, h]) => (
              <Link
                key={l}
                href={h}
                className="group relative px-4 py-2 text-xs font-semibold text-white/45 transition-colors hover:text-white"
              >
                {l}
                <span className="absolute inset-x-4 bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-cyan-400 to-accent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* actions */}
          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              className="btn-sheen h-9 gap-2 bg-primary px-5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(88,101,242,0.35)] hover:bg-primary-hover transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Button>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setNavOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/60 transition-colors hover:text-white lg:hidden"
            >
              {navOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        <AnimatePresence>
          {navOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/[0.07] bg-[#05050b]/95 p-2 backdrop-blur-xl lg:hidden"
            >
              {[["Features", "#features"], ["Modules", "#modules"], ["FAQ", "#faq"]].map(([l, h]) => (
                <Link
                  key={l}
                  href={h}
                  onClick={() => setNavOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {l}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-36 pb-20 px-6 text-center">
        <div className="mx-auto max-w-4xl">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="badge">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Trusted by 120+ Discord servers
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-xl text-white mb-6"
          >
            Your server needs one bot.{" "}
            <span className="text-gradient">Not fifteen.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10"
          >
            Anti-nuke, automod, leveling, tickets, and Instagram media — all in one bot,
            configured from a single fast dashboard.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
              size="lg"
              className="btn-sheen h-12 w-full gap-2.5 bg-primary px-8 text-sm font-semibold text-white shadow-[0_0_32px_rgba(88,101,242,0.4)] hover:bg-primary-hover transition-colors sm:w-auto"
            >
              <LayoutDashboard className="h-4 w-4" />
              Open Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 px-8 gap-2 font-semibold text-sm w-full sm:w-auto border-white/[0.1] bg-transparent hover:bg-white/[0.05] hover:border-white/[0.18] text-white/70 hover:text-white"
            >
              <Link href="#features">
                See what&apos;s inside
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted"
        >
          {[
            ["120+ servers", "and growing"],
            ["18 modules",   "out of the box"],
            ["< 50ms latency","avg response"],
            ["Free forever", "core features"],
          ].map(([v, l]) => (
            <div key={v} className="flex items-center gap-1.5">
              <span className="font-semibold text-white/65">{v}</span>
              <span>·</span>
              <span>{l}</span>
            </div>
          ))}
        </motion.div>

        {/* mockup */}
        <div className="mt-20">
          <DashboardMockup />
        </div>
      </section>

      {/* ── LIVE TERMINAL ───────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="label mb-4">Real-time security ops</p>
              <h2 className="heading-lg text-white mb-5">
                The shield never sleeps
              </h2>
              <p className="text-base text-muted leading-relaxed mb-8">
                Every action — spam deletion, raid detection, ticket creation, file saves —
                is logged and processed in real time. You see exactly what the bot is doing, always.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Cpu,      label: "99.98% uptime" },
                  { icon: Wifi,     label: "Sub-50ms response" },
                  { icon: HardDrive,label: "12k+ events / day" },
                  { icon: Shield,   label: "Zero false positives" },
                ].map(({ icon: I, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm text-white/50">
                    <I className="h-3.5 w-3.5 text-primary-light/60 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Terminal_ />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-14">
            <p className="label mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-primary to-transparent" />
              Features
            </p>
            <h2 className="heading-lg text-white">
              Everything communities need,{" "}
              <span className="text-gradient">nothing they don&apos;t</span>
            </h2>
            <p className="mt-4 max-w-lg text-base text-muted">
              Six core systems, each battle-tested across hundreds of servers — protected,
              engaging, and dead simple to run.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard value="120+" label="Active servers"   sub="growing weekly"     icon={Server} />
            <StatCard value="18"   label="Bot modules"      sub="fully configurable" icon={Layers} />
            <StatCard value="48k+" label="Members managed"  sub="across all guilds"  icon={Users2} />
            <StatCard value="99.98%" label="Uptime SLA"     sub="last 90 days"       icon={Activity} />
          </div>
        </div>
      </section>

      {/* ── MODULES ──────────────────────────────────────────────────────── */}
      <section id="modules" className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="label mb-4">Modules</p>
              <h2 className="heading-lg text-white">16 modules. One bot.</h2>
            </div>
            <p className="text-sm text-muted max-w-xs">
              Every module is production-tested and toggled from a single dashboard panel.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {modules.map((m, i) => (
              <ModulePill key={m.name} name={m.name} icon={m.icon} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl border border-[rgba(139,151,255,0.18)] bg-[#0c0c1c] overflow-hidden p-12 md:p-16 text-center"
          >
            {/* background glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-[500px] bg-primary/15 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 right-0 h-40 w-64 bg-cyan-500/10 blur-[70px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 left-0 h-36 w-56 bg-violet-500/10 blur-[70px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="badge">Free to start · No credit card</span>
              </div>
              <h2 className="heading-lg text-white mb-5">
                Set up in under a minute.
              </h2>
              <p className="text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed">
                Invite the bot, log in, select your server, and configure every module visually.
                No commands. No config files.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                  size="lg"
                  className="btn-sheen h-12 w-full gap-2.5 bg-primary px-10 font-semibold text-white shadow-[0_0_32px_rgba(88,101,242,0.4)] hover:bg-primary-hover transition-colors sm:w-auto"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-12 px-8 gap-2 font-semibold border-white/[0.1] bg-transparent hover:bg-white/[0.05] text-white/60 hover:text-white w-full sm:w-auto"
                >
                  <Link href="/docs">
                    Read the docs
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12">
            <p className="label mb-4">FAQ</p>
            <h2 className="heading-lg text-white">Common questions</h2>
          </div>
          <div className="divide-y divide-white/[0.07]">
            {faqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.07] bg-[#060610] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <LogoMark size="h-7 w-7" iconSize="h-3.5 w-3.5" />
                <span className="font-bold text-[15px] text-white">{BRAND}</span>
              </div>
              <p className="text-sm text-faint max-w-xs leading-relaxed">
                The Discord management platform for communities that care about quality.
              </p>
            </div>
            <div>
              <p className="label mb-5">Resources</p>
              <ul className="space-y-3 text-sm text-white/35">
                {[["Documentation", "/docs"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]].map(([l, h]) => (
                  <li key={l}>
                    <Link href={h} className="hover:text-white/70 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-5">Platform</p>
              <ul className="space-y-3 text-sm text-white/35">
                {[["Dashboard", "/dashboard"], ["API Docs", "/docs"]].map(([l, h]) => (
                  <li key={l}>
                    <Link href={h} className="hover:text-white/70 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/25">
              © 2026 {BRAND} Development. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
