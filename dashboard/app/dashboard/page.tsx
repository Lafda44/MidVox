export const dynamic = "force-dynamic";

import React from "react";
import {
  Users,
  Zap,
  Activity,
  Server as ServerIcon,
  ShieldAlert,
  FileText,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";
import { MetricCard } from "@/components/dashboard/metric-card";

export default async function DashboardPage() {
  let botInfo;
  let error = null;

  try {
    botInfo = await api.getBotInfo();
  } catch (err: any) {
    console.error("Failed to fetch bot info:", err);
    error = err.message || "Failed to connect to the bot API.";
    // Fallback data for UI structure if API fails
    botInfo = {
      name: "MidVox Bot",
      guilds: 0,
      users: 0,
      commands: 0,
      latency: "0ms"
    };
  }

  const stats = [
    { name: "Total Guilds", value: botInfo.guilds.toLocaleString(), icon: <ServerIcon className="h-5 w-5 text-primary" /> },
    { name: "Total Users", value: botInfo.users.toLocaleString(), icon: <Users className="h-5 w-5 text-primary" /> },
    { name: "Commands", value: botInfo.commands.toLocaleString(), icon: <Zap className="h-5 w-5 text-primary" /> },
    { name: "API Latency", value: botInfo.latency, icon: <Activity className="h-5 w-5 text-primary" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Status and live metrics for{" "}
            <span className="text-primary-light font-medium">{botInfo.name}</span>
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            <ShieldAlert className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard
            key={stat.name}
            name={stat.name}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[#111111] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-50 tracking-tight">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "Manage Servers", desc: "View and configure your guilds", icon: ServerIcon, href: "/dashboard/guilds" },
              { title: "Documentation", desc: "Learn how to use every module", icon: FileText, href: "/docs" },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group flex items-center gap-4 p-4 rounded-xl bg-[#0C0C0C] border border-[#1A1A1A] hover:border-amber-500/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-50 group-hover:text-primary-light transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 flex flex-col">
          <h2 className="text-base font-bold text-slate-50 mb-1 tracking-tight">
            Module Status
          </h2>
          <p className="text-xs text-neutral-500 mb-5">
            Global operational health
          </p>

          <div className="space-y-2.5">
            {[
              { name: 'Gateway', status: 'Optimal' },
              { name: 'Database', status: 'Synchronized' },
              { name: 'API', status: 'Operational' }
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3.5 rounded-lg bg-[#0C0C0C] border border-[#1A1A1A]"
              >
                <span className="text-xs font-medium text-neutral-300">
                  {service.name}
                </span>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] uppercase font-semibold text-emerald-500 tracking-widest">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-auto pt-5 w-full py-2.5 rounded-lg border border-neutral-700 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 hover:text-slate-50 hover:bg-[#1A1A1A]/60 transition-colors">
            System Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
