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
  ArrowUpRight, Cpu, Wifi, HardDrive, Menu, X, ArrowUp, Star, Quote, SlidersHorizontal,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "ZyroX";

/* ── Cyber particles canvas — reacts to the cursor ──────────────────────── */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const mouse = { x: -9999, y: -9999 };

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      base: Math.random() > 0.45 ? "99,102,241" : "6,182,212",
      pulse: Math.random() * Math.PI * 2,
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
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        /* cursor repulsion — particles flee the pointer */
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 140 && d > 0.001) {
          const f = ((140 - d) / 140) * 0.9;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        p.pulse += 0.03;
        const glow = 0.45 + Math.sin(p.pulse) * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.base},${glow.toFixed(2)})`;
        ctx.shadowColor = `rgba(${p.base},0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        /* link to cursor */
        if (d < 170) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${p.base},${((1 - d / 170) * 0.35).toFixed(2)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${pts[i].base},${(1 - d / 110) * 0.14})`;
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
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="fixed inset-0 z-0 pointer-events-none opacity-60" />;
}

/* ── CountUp ────────────────────────────────────────────────────────────── */
function CountUp({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const val = useMotionValue(0);
  const spring = useSpring(val, { stiffness: 80, damping: 22 });

  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useEffect(() => {
    if (!inView) return;
    val.set(to);
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = fmt(v);
    });
  }, [inView, to, suffix, decimals, val, spring, fmt]);

  return <span ref={ref}>{fmt(0)}</span>;
}

/* ── Cursor glow ────────────────────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[520px] w-[520px] rounded-full transition-transform duration-300 ease-out"
      style={{
        background:
          "radial-gradient(circle, rgba(99,102,241,0.09) 0%, rgba(6,182,212,0.05) 32%, transparent 65%)",
      }}
    />
  );
}

/* ── Scroll progress bar ────────────────────────────────────────────────── */
function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-primary via-accent to-primary"
      style={{ width: `${p}%` }}
    />
  );
}

/* ── Back to top ────────────────────────────────────────────────────────── */
function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(129,140,248,0.3)] bg-[#0d0d1f]/90 text-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors hover:border-[rgba(129,140,248,0.5)] hover:text-white cursor-pointer"
        >
          <ArrowUp className="h-[18px] w-[18px]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
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
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#818CF8] to-[#4F46E5] flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.5)]">
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
                      className="absolute inset-0 rounded-lg bg-primary/15 border border-primary/30 shadow-[0_0_18px_rgba(99,102,241,0.35)]"
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
                                ? "bg-gradient-to-t from-primary to-accent shadow-[0_0_8px_rgba(99,102,241,0.4)]"
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
        className="absolute -right-3 sm:-right-8 top-28 flex min-w-[225px] items-center gap-3 rounded-xl border border-[rgba(129,140,248,0.28)] bg-[#0d0d1f]/95 px-4 py-3 backdrop-blur-xl shadow-[0_16px_40px_-12px_rgba(99,102,241,0.35)]"
      >
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#818CF8] to-[#4F46E5] shadow-[0_0_14px_rgba(99,102,241,0.5)]">
          <Download className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-white">Reel downloaded</p>
          <p className="mt-0.5 font-mono text-[9px] text-[#98a2c3]">#media → 8.2 MB mp4</p>
        </div>
        <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.0, duration: 0.6, ease: "easeOut" }}
        className="absolute -left-3 sm:-left-8 -bottom-4 flex min-w-[190px] items-center gap-2.5 rounded-xl border border-[rgba(129,140,248,0.28)] bg-[#0d0d1f]/95 px-4 py-3 backdrop-blur-xl shadow-[0_16px_40px_-12px_rgba(99,102,241,0.35)]"
      >
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        </span>
        <span className="text-[10px] font-semibold text-white/85">18 modules online</span>
        <span className="ml-auto rounded-md border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-[#a5b4fc]">
          LIVE
        </span>
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
        "relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#818CF8] to-[#4F46E5] shadow-[0_0_20px_rgba(99,102,241,0.5)]",
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
    indigo: { text: "text-[#a5b4fc]", chip: "bg-[#6366F1]/15 border-[#6366F1]/30", glow: "rgba(99,102,241,0.5)", spot: "rgba(99,102,241,0.15)", orb: "rgba(99,102,241,0.18)", border: "hover:border-[#818CF8]/40" },
    cyan:   { text: "text-cyan-300",   chip: "bg-cyan-500/15 border-cyan-500/30",   glow: "rgba(6,182,212,0.45)", spot: "rgba(6,182,212,0.13)", orb: "rgba(6,182,212,0.16)", border: "hover:border-cyan-400/40" },
    violet: { text: "text-violet-300", chip: "bg-violet-500/15 border-violet-500/30", glow: "rgba(168,85,247,0.45)", spot: "rgba(168,85,247,0.13)", orb: "rgba(168,85,247,0.16)", border: "hover:border-violet-400/40" },
  };
  const a = accentMap[accent];

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    /* 3D tilt */
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg) translateY(-6px)`;
  };
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(129,140,248,0.16)] bg-[#0d0d1f] p-6 transition-[border-color,background-color,box-shadow] duration-300 will-change-transform cursor-pointer",
        "hover:border-[rgba(129,140,248,0.38)] hover:bg-[#0f0f26] hover:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75)]"
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
              className="rounded-md border border-primary/25 bg-primary/[0.08] px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#a5b4fc]/70 transition-colors duration-300 group-hover:border-primary/40 group-hover:text-[#a5b4fc]"
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
function ModulePill({ name, icon: Icon }: { name: string; icon: typeof ShieldAlert }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 bg-[#0d0d1f] border border-[rgba(129,140,248,0.14)] hover:bg-[#12122a] hover:border-[rgba(129,140,248,0.32)] transition-all duration-200 group cursor-pointer">
      <Icon className="h-3.5 w-3.5 text-primary-light/70 group-hover:text-primary-light transition-colors" />
      <span className="text-xs font-medium text-muted group-hover:text-white/85 transition-colors">{name}</span>
    </div>
  );
}

/* ── Scrolling module marquee ───────────────────────────────────────────── */
function MarqueeRow({ items, reverse = false }: { items: { name: string; icon: typeof ShieldAlert }[]; reverse?: boolean }) {
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={cn("marquee-track flex w-max gap-3", reverse && "reverse")}>
        {[...items, ...items].map((m, i) => (
          <ModulePill key={`${m.name}-${i}`} name={m.name} icon={m.icon} />
        ))}
      </div>
    </div>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────────── */
function StatCard({ value, suffix = "", decimals = 0, label, sub, icon: Icon }: {
  value: number; suffix?: string; decimals?: number; label: string; sub?: string; icon: typeof Server;
}) {
  return (
    <div className="flex flex-col gap-1 p-6 rounded-xl border border-[rgba(129,140,248,0.14)] bg-[#0d0d1f] hover:border-[rgba(129,140,248,0.3)] hover:bg-[#0f0f26] transition-all duration-300">
      <Icon className="h-4 w-4 text-primary-light/60 mb-1" />
      <p className="text-3xl font-bold text-white tracking-tight tabular-nums">
        <CountUp to={value} suffix={suffix} decimals={decimals} />
      </p>
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

/* ── Interactive modules showcase — click tabs to preview settings ──────── */
type ShowcaseKey = "antinuke" | "leveling" | "welcomer" | "tickets" | "automod";

const SHOWCASE_MODULES: {
  key: ShowcaseKey;
  label: string;
  icon: typeof ShieldAlert;
  tagline: string;
  settings: { icon: typeof ShieldAlert; label: string; enabled: boolean }[];
  accent: "indigo" | "cyan" | "violet" | "rose" | "amber";
}[] = [
  {
    key: "antinuke", label: "Anti-Nuke", icon: ShieldAlert,
    tagline: "Mass-ban lockdown in 2ms. One toggle arms 18 guard rails.",
    settings: [
      { icon: Ban,      label: "Instant ban mitigation", enabled: true },
      { icon: Shield,   label: "Role/channel wiper block", enabled: true },
      { icon: Users2,   label: "Bot-add guard", enabled: true },
      { icon: Lock,     label: "Webhook creation block", enabled: true },
    ],
    accent: "indigo",
  },
  {
    key: "leveling", label: "Leveling", icon: BarChart4,
    tagline: "XP, rank cards and reward roles — auto-configured per server.",
    settings: [
      { icon: BarChart4, label: "XP per message", enabled: true },
      { icon: Sparkles,  label: "Custom rank cards", enabled: true },
      { icon: User,      label: "Reward roles", enabled: true },
      { icon: Trophy,  label: "Public leaderboard", enabled: false },
    ],
    accent: "cyan",
  },
  {
    key: "welcomer", label: "Welcomer", icon: Sparkles,
    tagline: "Render a welcome card, DM the member, assign roles instantly.",
    settings: [
      { icon: Sparkles, label: "Welcome card render", enabled: true },
      { icon: Mail,     label: "Join DM message", enabled: true },
      { icon: User,     label: "Auto-assign roles", enabled: true },
      { icon: CheckCircle2, label: "Leave messages", enabled: false },
    ],
    accent: "violet",
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
    accent: "rose",
  },
  {
    key: "automod", label: "Automod", icon: ShieldCheck,
    tagline: "ML scoring flags spam, scams and NSFW before anyone sees it.",
    settings: [
      { icon: ShieldCheck, label: "ML spam scoring", enabled: true },
      { icon: Ban,         label: "Auto-delete", enabled: true },
      { icon: Bell,        label: "Mod alerts", enabled: true },
      { icon: Globe,       label: "Link/domain filter", enabled: false },
    ],
    accent: "amber",
  },
];

const SHOWCASE_ACCENTS = {
  indigo: { border: "border-primary/35", glow: "rgba(99,102,241,0.4)", chip: "bg-primary/15 border-primary/35 text-primary-light" },
  cyan:   { border: "border-accent/35",  glow: "rgba(6,182,212,0.4)",  chip: "bg-accent/15 border-accent/35 text-cyan-300" },
  violet: { border: "border-violet-500/40", glow: "rgba(168,85,247,0.4)", chip: "bg-violet-500/15 border-violet-500/40 text-violet-300" },
  rose:   { border: "border-rose-500/40", glow: "rgba(251,113,133,0.4)", chip: "bg-rose-500/15 border-rose-500/40 text-rose-300" },
  amber:  { border: "border-amber-500/40", glow: "rgba(251,191,36,0.4)", chip: "bg-amber-500/15 border-amber-500/40 text-amber-300" },
} as const;

function ModulesShowcase() {
  const [active, setActive] = useState<ShowcaseKey>("antinuke");
  const mod = SHOWCASE_MODULES.find((m) => m.key === active)!;
  const acc = SHOWCASE_ACCENTS[mod.accent];

  return (
    <section id="showcase" className="relative z-10 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl mb-12">
          <p className="label mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-primary to-transparent" />
            Module preview
          </p>
          <h2 className="heading-lg text-white">
            Click a module — <span className="text-gradient">see its cockpit</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-muted">
            Every module ships with a real settings panel. Flip switches, preview
            cards, and watch the bot react — no commands required.
          </p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* tab rail */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
            {SHOWCASE_MODULES.map((m) => {
              const isActive = m.key === active;
              return (
                <button
                  key={m.key}
                  onClick={() => setActive(m.key)}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 cursor-pointer",
                    isActive
                      ? cn(SHOWCASE_ACCENTS[m.accent].border, "bg-[#0d0d1f]")
                      : "border-white/[0.07] bg-[#0a0a14] hover:border-white/[0.16] hover:bg-[#0d0d1f]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="showcase-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl shadow-[0_0_22px_rgba(99,102,241,0.25)] pointer-events-none"
                    />
                  )}
                  <m.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? SHOWCASE_ACCENTS[m.accent].chip.split(" ")[2] : "text-slate-500"
                    )}
                  />
                  <span className={cn("text-sm font-semibold transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* preview panel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={mod.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b18] p-6 sm:p-8"
              >
                {/* glow accent */}
                <div
                  className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full blur-[90px]"
                  style={{ background: acc.glow }}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                <div className="relative flex items-start justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl border", acc.chip)}>
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{mod.label}</h3>
                      <p className="text-sm text-muted">{mod.tagline}</p>
                    </div>
                  </div>
                  <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CONFIGURED
                  </span>
                </div>

                <div className="relative grid sm:grid-cols-2 gap-3">
                  {mod.settings.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.06, duration: 0.3 }}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5"
                    >
                      <s.icon className={cn("h-4 w-4 shrink-0", s.enabled ? acc.chip.split(" ")[2] : "text-slate-600")} />
                      <span className={cn("flex-1 text-sm font-medium", s.enabled ? "text-white/80" : "text-slate-500 line-through")}>
                        {s.label}
                      </span>
                      {/* toggle */}
                      <span
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors duration-300",
                          s.enabled ? "bg-primary shadow-[0_0_12px_rgba(99,102,241,0.5)]" : "bg-slate-700"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all duration-300",
                            s.enabled ? "left-[18px]" : "left-0.5"
                          )}
                        />
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Bot mascot — metallic-white + neon-violet illustration (SVG) ───────── */
function BotMascot({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative select-none", className)} aria-hidden>
      {/* halo glow */}
      <div className="absolute inset-0 rounded-full bg-primary/25 blur-[70px] animate-pulse" />
      <svg viewBox="0 0 200 200" className="relative h-full w-full drop-shadow-[0_0_28px_rgba(99,102,241,0.45)]">
        <defs>
          <linearGradient id="mascot-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="mascot-neon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="mascot-eye" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* ears */}
        <rect x="46" y="38" width="26" height="34" rx="8" fill="url(#mascot-metal)" />
        <rect x="128" y="38" width="26" height="34" rx="8" fill="url(#mascot-metal)" />
        <rect x="52" y="46" width="14" height="16" rx="4" fill="url(#mascot-neon)" opacity="0.9" />
        <rect x="134" y="46" width="14" height="16" rx="4" fill="url(#mascot-neon)" opacity="0.9" />

        {/* head */}
        <rect x="36" y="56" width="128" height="108" rx="26" fill="url(#mascot-metal)" />
        <rect x="36" y="56" width="128" height="108" rx="26" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* face plate */}
        <rect x="52" y="72" width="96" height="52" rx="14" fill="#0b0b18" stroke="url(#mascot-neon)" strokeWidth="2" />

        {/* eyes */}
        <circle cx="78" cy="98" r="9" fill="url(#mascot-eye)" />
        <circle cx="122" cy="98" r="9" fill="url(#mascot-eye)" />
        <circle cx="78" cy="98" r="9" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="9;13;9" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="122" cy="98" r="9" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values="9;13;9" dur="3s" begin="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="75.5" cy="95.5" r="2.6" fill="#ffffff" />
        <circle cx="119.5" cy="95.5" r="2.6" fill="#ffffff" />

        {/* mouth */}
        <path d="M88 136 h24" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />

        {/* chest badge */}
        <circle cx="100" cy="158" r="12" fill="#0b0b18" stroke="url(#mascot-neon)" strokeWidth="2.5" />
        <circle cx="100" cy="158" r="4" fill="#818cf8" />
        <circle cx="100" cy="158" r="8" fill="none" stroke="rgba(129,140,248,0.5)" strokeWidth="1.5" opacity="0.7">
          <animate attributeName="r" values="8;12;8" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0.7" dur="2.6s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* floating sparkles */}
      <span className="cyber-particle h-1.5 w-1.5 bg-cyan-400 shadow-[0_0_8px_#06b6d4]" style={{ top: "8%", right: "12%", animationDelay: "-2s" }} />
      <span className="cyber-particle h-2 w-2 bg-primary shadow-[0_0_10px_#6366f1]" style={{ top: "22%", left: "6%", animationDelay: "-4s" }} />
      <span className="cyber-particle h-1 w-1 bg-violet-400 shadow-[0_0_8px_#a855f7]" style={{ bottom: "10%", right: "18%", animationDelay: "-1s" }} />
    </div>
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

  const steps = [
    { icon: Server,              title: "Invite the bot",      desc: "Add ZyroX to your server with one click — all 16 modules come pre-armed and safe by default." },
    { icon: LogIn,               title: "Authenticate",        desc: "Log in with Discord on this site. We only read what you can already see — nothing more." },
    { icon: SlidersHorizontal,   title: "Configure visually",  desc: "Toggle modules, set roles, preview rank cards — saved instantly. No commands, no config files." },
  ];

  const testimonials = [
    { quote: "We replaced six bots with ZyroX in one afternoon. Anti-nuke blocked a full raid while I slept — the logs looked like a movie.", name: "Kai",   role: "Owner · 210k member server",  grad: "from-[#6366F1] to-[#06B6D4]", init: "K" },
    { quote: "The dashboard is the only reason I switched. Everything is clickable, and I haven't written a single slash command since.",    name: "Maya",  role: "Mod team lead · 45k server", grad: "from-[#06B6D4] to-[#6366F1]", init: "M" },
    { quote: "Leveling import from MEE6 took 30 seconds, and the rank cards look better than anything our paid bots ever did.",               name: "Arjun", role: "Admin · gaming community",  grad: "from-[#4F46E5] to-[#818CF8]", init: "A" },
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
      <CursorGlow />
      <ScrollProgress />
      <BackToTop />

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
            {[["How it works", "#how"], ["Features", "#features"], ["Modules", "#modules"], ["FAQ", "#faq"]].map(([l, h]) => (
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
              className="btn-sheen h-9 gap-2 bg-primary px-5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:bg-primary-hover transition-colors"
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
              {[["How it works", "#how"], ["Features", "#features"], ["Modules", "#modules"], ["FAQ", "#faq"]].map(([l, h]) => (
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
            <span className="badge neon-glow-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Trusted by 120+ Discord servers
            </span>
          </motion.div>

          {/* headline — character-by-character reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-xl text-white mb-6"
          >
            Your server needs one bot.{" "}
            <span className="text-gradient">
              {Array.from("Not fifteen.").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.045, duration: 0.35, ease: "easeOut" }}
                  className="inline-block"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </span>
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
              className="btn-sheen h-12 w-full gap-2.5 bg-primary px-8 text-sm font-semibold text-white shadow-[0_0_32px_rgba(99,102,241,0.4)] hover:bg-primary-hover hover:shadow-[0_0_40px_rgba(99,102,241,0.55)] transition-all sm:w-auto"
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

        {/* mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex justify-center"
        >
          <div className="animate-float">
            <BotMascot className="h-36 w-36 sm:h-44 sm:w-44" />
          </div>
        </motion.div>

        {/* mockup */}
        <div className="mt-12">
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

      {/* ── MODULES SHOWCASE (interactive) ───────────────────────────────── */}
      <ModulesShowcase />

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

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how" className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-14">
            <p className="label mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-primary to-transparent" />
              How it works
            </p>
            <h2 className="heading-lg text-white">
              Live in <span className="text-gradient">three steps</span>
            </h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8 md:gap-6">
            {/* connector line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40" />

            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative text-center md:text-left"
              >
                <div className="relative z-10 mx-auto md:mx-0 mb-6 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl border border-[rgba(129,140,248,0.3)] bg-primary/10" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#818CF8] to-[#4F46E5] shadow-[0_0_24px_rgba(99,102,241,0.45)]">
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(129,140,248,0.3)] bg-[#0d0d1f] font-mono text-[10px] font-bold text-[#a5b4fc]">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{s.title}</h3>
                <p className="mx-auto md:mx-0 max-w-xs text-sm leading-relaxed text-muted">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard value={120} suffix="+" label="Active servers"  sub="growing weekly"     icon={Server} />
            <StatCard value={18}   label="Bot modules"    sub="fully configurable" icon={Layers} />
            <StatCard value={48}  suffix="k+" label="Members managed" sub="across all guilds"  icon={Users2} />
            <StatCard value={99.98} suffix="%" decimals={2} label="Uptime SLA" sub="last 90 days" icon={Activity} />
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

          <div className="space-y-4">
            <MarqueeRow items={modules.slice(0, 8)} />
            <MarqueeRow items={modules.slice(8)} reverse />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section id="testimonials" className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-14">
            <p className="label mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-primary to-transparent" />
              Testimonials
            </p>
            <h2 className="heading-lg text-white">
              Loved by <span className="text-gradient">server owners</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative flex flex-col rounded-2xl border border-[rgba(129,140,248,0.16)] bg-[#0d0d1f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(129,140,248,0.38)] hover:bg-[#0f0f26] hover:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75)]"
              >
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 text-primary/30" />
                </div>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white", t.grad)}>
                    {t.init}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-faint">{t.role}</p>
                  </div>
                </div>
              </motion.div>
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
            className="relative glass-cyber overflow-hidden p-12 md:p-16 text-center"
          >
            {/* background glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-[500px] bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 right-0 h-40 w-64 bg-accent/15 blur-[70px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 left-0 h-36 w-56 bg-violet-500/15 blur-[70px] rounded-full pointer-events-none" />
            {/* ambience cyber grid */}
            <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-30" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="badge neon-glow-primary">Free to start · No credit card</span>
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
                  className="btn-sheen neon-glow-primary h-12 w-full gap-2.5 bg-primary px-10 font-semibold text-white hover:bg-primary-hover transition-colors sm:w-auto"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-12 px-8 gap-2 font-semibold border-[rgba(129,140,248,0.25)] bg-transparent hover:bg-white/[0.05] text-white/60 hover:text-white w-full sm:w-auto"
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
