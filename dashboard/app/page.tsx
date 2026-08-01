"use client";

import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
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
  Terminal,
  Users2,
  Lock,
  Gamepad2,
  Music4,
  User,
  Settings,
  Mail,
  Star,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

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
    { name: "Anti-Nuke", desc: "Server lockdown protection", icon: ShieldAlert },
    { name: "Automod", desc: "Automated moderation rules", icon: ShieldCheck },
    { name: "Anti-Spam+", desc: "Message and command filtering", icon: Activity },
    { name: "Verification", desc: "Bot-free onboarding", icon: CheckCircle2 },
    { name: "Welcome", desc: "Custom join messages", icon: Sparkles },
    { name: "Leveling", desc: "XP, ranks and leaderboards", icon: BarChart4 },
    { name: "Vanity Roles", desc: "Custom server identity", icon: Gamepad2 },
    { name: "Auto Role", desc: "Instant role assignment", icon: User },
    { name: "Reaction Roles", desc: "Role menus by reaction", icon: Layers },
    { name: "Tickets", desc: "Support with transcripts", icon: MessageSquare },
    { name: "Join to Create", desc: "Self-serve voice channels", icon: Music4 },
    { name: "Invites", desc: "Growth tracking", icon: Globe },
    { name: "Join DM", desc: "Personalized direct messages", icon: Mail },
    { name: "Custom Roles", desc: "User-purchased roles", icon: Lock },
    { name: "Logging", desc: "Full audit trail", icon: History },
    { name: "Tracking", desc: "Member analytics", icon: Activity },
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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden">
      {/* Background grid + glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-primary/[0.06] blur-[140px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold tracking-tight text-white leading-none">
                {process.env.NEXT_PUBLIC_BRAND_NAME || "ZyroX"}
              </h1>
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 mt-1">
                Discord Bot
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            <Link href="#features" className="hover:text-primary-light transition-colors">Features</Link>
            <Link href="#modules" className="hover:text-primary-light transition-colors">Modules</Link>
            <Link href="#faq" className="hover:text-primary-light transition-colors">FAQ</Link>
          </div>

          <Button
            onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
            className="px-5 h-9 font-semibold uppercase tracking-wider text-[10px] gap-2"
          >
            <LogIn className="h-3.5 w-3.5" />
            Login
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-semibold uppercase tracking-[0.25em] mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Discord Management Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6"
          >
            Everything your server needs.
            <span className="block text-gradient mt-2">One dashboard.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Security, engagement and automation modules for modern Discord communities.
            Configure everything visually — no commands required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
              size="lg"
              className="w-full sm:w-auto px-8 gap-2.5 font-semibold"
            >
              <LayoutDashboard className="h-4 w-4" />
              Open Dashboard
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 gap-2.5 font-semibold" asChild>
              <Link href="#features">
                View Features
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase text-primary-light tracking-[0.3em] mb-3">
                Features
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Built for communities that take moderation seriously
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Every module is production-tested and configurable through a clean, fast interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold uppercase text-primary-light tracking-[0.3em] mb-3">
              Modules
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              16+ modules. Fully configurable.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="group bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-primary/30 hover:bg-slate-900 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                  <mod.icon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1 tracking-tight">
                  {mod.name}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium uppercase tracking-wider">
                  {mod.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto relative rounded-2xl p-12 md:p-16 overflow-hidden bg-gradient-to-br from-primary/20 via-slate-900 to-slate-900 border border-primary/20 text-center">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/20 blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to upgrade your server?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Set up takes less than a minute. Invite the bot and configure everything from the dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
                size="lg"
                className="px-10 gap-2.5 font-semibold"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold uppercase text-primary-light tracking-[0.3em] mb-3">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
              >
                <h4 className="text-sm font-bold text-white mb-2 tracking-tight">
                  {item.q}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-800 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  {process.env.NEXT_PUBLIC_BRAND_NAME || "ZyroX"}
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
                The Discord management platform for communities that care about quality moderation.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 mb-4">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="/docs" className="hover:text-primary-light transition-colors">Documentation</Link></li>
                <li><Link href="/privacy" className="hover:text-primary-light transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary-light transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 mb-4">
                Platform
              </h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="/dashboard" className="hover:text-primary-light transition-colors">Dashboard</Link></li>
                <li><Link href="/docs" className="hover:text-primary-light transition-colors">API</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-700">
              © 2026 {process.env.NEXT_PUBLIC_BRAND_NAME || "ZyroX"} Development. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
