import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerCardProps {
  id: string | number;
  name: string;
  iconUrl?: string | null;
  memberCount: number;
  isActive?: boolean;
  className?: string;
}

export const ServerCard = ({
  id,
  name,
  iconUrl,
  memberCount,
  isActive = true,
  className
}: ServerCardProps) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d1a] transition-all duration-300",
      "hover:border-indigo-500/40 hover:shadow-[0_0_30px_-8px_rgba(99,102,241,0.4)] hover:-translate-y-1",
      className
    )}>
      {/* top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* header row */}
        <div className="flex items-start justify-between">
          <div className="relative shrink-0">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={name}
                width={56}
                height={56}
                className="rounded-xl border border-white/10 group-hover:border-indigo-400/30 transition-colors duration-300"
              />
            ) : (
              <div className="h-14 w-14 rounded-xl border border-white/10 group-hover:border-indigo-400/30 transition-colors duration-300 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 flex items-center justify-center font-bold text-xl text-indigo-300">
                {initial}
              </div>
            )}
            {isActive && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0d0d1a] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            )}
          </div>

          <span className="text-[9px] font-mono font-semibold tracking-[0.18em] uppercase text-indigo-400/60 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md">
            {String(id).slice(0, 12)}…
          </span>
        </div>

        {/* name */}
        <div>
          <h3 className="text-[15px] font-semibold text-white/90 group-hover:text-white truncate tracking-tight transition-colors">
            {name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-slate-500">
            <Users className="h-3.5 w-3.5 text-indigo-400/60" />
            <span className="text-xs font-medium text-slate-400 tabular-nums">
              {memberCount.toLocaleString()} members
            </span>
          </div>
        </div>
      </div>

      {/* footer CTA */}
      <Link
        href={`/dashboard/guild/${id}`}
        className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.05] bg-white/[0.02] group-hover:bg-indigo-500/[0.07] transition-colors duration-300"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 group-hover:text-indigo-300 transition-colors">
          Manage Server
        </span>
        <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
};
