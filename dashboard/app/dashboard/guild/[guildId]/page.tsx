import React from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Hash,
  Layers3,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";

export const revalidate = 0;

const chartSeries = [
  {
    title: "Community activity",
    description: "Member and channel engagement overview",
    primary: "M0 144 C24 132 31 92 55 105 S88 155 110 117 S145 62 168 88 S205 145 231 103 S260 50 289 72 S322 136 352 91 S389 55 420 76 S455 126 500 65",
    secondary: "M0 158 C30 146 44 121 71 132 S110 165 137 139 S179 103 205 118 S249 161 277 127 S319 92 347 109 S389 151 418 119 S460 85 500 98",
    color: "#F59E0B",
    secondaryColor: "#3B82F6",
    icon: Users,
  },
  {
    title: "Message flow",
    description: "Recent bot interaction pattern",
    primary: "M0 117 C18 58 34 91 52 68 S85 128 105 96 S137 49 159 74 S192 137 218 102 S254 40 279 71 S313 132 340 83 S378 48 405 77 S451 126 500 53",
    color: "#F59E0B",
    icon: MessageSquare,
  },
  {
    title: "Protection pulse",
    description: "Moderation event visualization",
    primary: "M0 146 C32 145 39 112 65 117 S101 156 128 126 S163 87 191 108 S226 158 253 121 S291 79 320 105 S358 154 387 115 S432 76 458 100 S485 123 500 91",
    secondary: "M0 163 C27 155 44 146 68 151 S105 168 131 149 S169 134 194 145 S231 171 258 147 S301 125 326 140 S362 167 391 146 S436 125 463 139 S486 149 500 133",
    color: "#EF4444",
    secondaryColor: "#F59E0B",
    icon: ShieldCheck,
  },
  {
    title: "System response",
    description: "Bot service health visualization",
    primary: "M0 135 C29 127 43 99 69 111 S110 153 139 119 S175 57 204 81 S247 153 277 111 S315 73 343 92 S386 143 414 107 S461 63 500 84",
    color: "#22C55E",
    icon: Activity,
  },
];

function OverviewChart({ chart, index }: { chart: (typeof chartSeries)[number]; index: number }) {
  const Icon = chart.icon;
  const fillId = `chart-fill-${index}`;

  return (
    <section className="overflow-hidden rounded-lg border border-[#222222] bg-[#111111]">
      <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">{chart.title}</h2>
          <p className="mt-1 text-[10px] text-neutral-600">{chart.description}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#292929] bg-[#191919] text-neutral-500">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="relative h-52 px-4 pb-4 pt-2 sm:h-60">
        <div className="absolute inset-x-4 bottom-8 top-5 flex flex-col justify-between" aria-hidden>
          {[0, 1, 2, 3].map((line) => (
            <span key={line} className="block border-t border-dashed border-[#202020]" />
          ))}
        </div>
        <svg
          viewBox="0 0 500 180"
          preserveAspectRatio="none"
          className="relative h-[calc(100%-24px)] w-full overflow-visible"
          role="img"
          aria-label={`${chart.title} preview chart`}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chart.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={chart.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${chart.primary} L500 180 L0 180 Z`} fill={`url(#${fillId})`} />
          {chart.secondary && (
            <path d={chart.secondary} fill="none" stroke={chart.secondaryColor} strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity="0.75" />
          )}
          <path d={chart.primary} fill="none" stroke={chart.color} strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute inset-x-5 bottom-4 flex justify-between font-mono text-[8px] uppercase tracking-wider text-neutral-700">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </section>
  );
}

export default async function GuildOverviewPage({ params }: { params: { guildId: string } }) {
  const guild = await api.getGuildDetails(params.guildId);
  const stats = [
    { label: "Members", value: guild.member_count.toLocaleString(), icon: Users, change: "Live count", positive: true },
    { label: "Channels", value: guild.channel_count.toLocaleString(), icon: Hash, change: "Synced", positive: true },
    { label: "Roles", value: guild.role_count.toLocaleString(), icon: ShieldCheck, change: "Synced", positive: true },
    { label: "Modules", value: "20", icon: Layers3, change: "Available", positive: true },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(245,158,11,0.65)]" />
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-primary/70">Overview</span>
          </div>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Welcome back to <span className="text-primary">{guild.name}</span>
          </h1>
          <p className="mt-1 text-xs text-neutral-500">A complete overview of your server and bot activity.</p>
        </div>
        <button className="flex h-9 w-full items-center justify-between gap-6 rounded-md border border-[#252525] bg-[#151515] px-3 text-[10px] font-medium text-neutral-400 transition-colors hover:border-[#333] hover:text-neutral-200 sm:w-auto">
          Last 7 days
          <ArrowDownRight className="h-3.5 w-3.5 text-neutral-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="group rounded-lg border border-[#222222] bg-[#111111] p-4 transition-colors hover:border-[#303030]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium text-neutral-500">{stat.label}</p>
                <p className="mt-1.5 text-xl font-semibold tracking-tight text-neutral-100">{stat.value}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#292929] bg-[#191919] text-neutral-400 transition-colors group-hover:text-primary">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-[#1C1C1C] pt-3">
              <span className="flex items-center gap-1 rounded bg-emerald-500/[0.09] px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase text-emerald-500">
                <ArrowUpRight className="h-2.5 w-2.5" />
                {stat.change}
              </span>
              <span className="text-[9px] text-neutral-600">from Discord</span>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-sm font-semibold text-neutral-200">Analytics</h2>
          <p className="mt-1 text-[10px] text-neutral-600">Visual previews until historical analytics are connected.</p>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-wider text-neutral-600">
          <BarChart3 className="h-3.5 w-3.5 text-primary/70" />
          Preview
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {chartSeries.map((chart, index) => <OverviewChart key={chart.title} chart={chart} index={index} />)}
      </div>
    </div>
  );
}
