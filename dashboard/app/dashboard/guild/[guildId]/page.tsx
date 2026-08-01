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

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Terminal,
  Database,
  Zap,
  ShieldCheck,
  Ticket,
  BarChart4,
  FileText,
  Activity,
  Server,
  Clock,
  Globe,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export default function GuildOverviewPage({ params }: { params: { guildId: string } }) {
  const modules = [
    { title: "Auto Moderation", desc: "Anti-spam, bad words, and link protection.", icon: ShieldCheck, status: "Active" },
    { title: "Ticket System", desc: "Helpdesk for user support and inquiries.", icon: Ticket, status: "Configured" },
    { title: "Leveling", desc: "XP and rank progression for your community.", icon: BarChart4, status: "Active" },
    { title: "Event Logging", desc: "Audit log for every server event.", icon: FileText, status: "Active" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Config Column */}
      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-semibold text-white tracking-tight">Active Modules</h2>
            <div className="h-px flex-1 bg-slate-800" />
            <Plus className="h-4 w-4 text-slate-600 cursor-pointer hover:text-white transition-colors" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.title}
                {...fadeUp}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="bg-slate-900 border border-slate-800 p-5 rounded-xl group hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-9 w-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <mod.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[9px] font-semibold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {mod.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{mod.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-semibold text-white tracking-tight">System Console</h2>
            <div className="h-px flex-1 bg-slate-800" />
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px]">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span className="text-slate-500">guild_event_stream_{params.guildId}</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-slate-600">[{new Date().toLocaleTimeString()}] <span className="text-emerald-500">INIT</span> Dashboard connected to WebSocket pool...</p>
              <p className="text-slate-600">[{new Date().toLocaleTimeString()}] <span className="text-primary">INFO</span> Fetching guild config from primary database...</p>
              <p className="text-slate-600">[{new Date().toLocaleTimeString()}] <span className="text-emerald-500">DONE</span> Cache synchronized successfully.</p>
              <p className="text-slate-400 animate-pulse">_</p>
            </div>
          </div>
        </section>
      </div>

      {/* Integration Status Column */}
      <div className="space-y-6">
        <motion.section
          {...fadeUp}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
              <Database className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Database Status</h2>
              <p className="text-xs text-slate-500">Guild configuration persistence</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Uptime", value: "99.98%", icon: Zap },
              { label: "Sync Delay", value: "12ms", icon: Activity },
              { label: "Region", value: "Global Edges", icon: Globe },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 bg-slate-900 border border-slate-800 rounded-md flex items-center justify-center text-primary">
                    <stat.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-300">{stat.label}</span>
                </div>
                <span className="text-xs font-semibold text-white font-mono">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
              <Server className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold text-white">Security Context</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 rounded-full border-4 border-emerald-500/15 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                <span className="text-emerald-500 font-bold text-lg">100%</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">Trust Factor</h3>
              <p className="text-xs text-slate-500">Bot is fully authenticated with administrator privileges.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-400">Last configuration update</span>
          </div>
          <span className="text-xs font-mono text-slate-300">—</span>
        </section>
      </div>
    </div>
  );
}
