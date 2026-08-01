import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Hash, ChevronRight, ArrowUpRight } from "lucide-react";
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
  return (
    <div className={cn(
      "group bg-slate-900 border border-slate-800 rounded-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col overflow-hidden",
      className
    )}>
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-5">
          <div className="relative">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={name}
                width={64}
                height={64}
                className="rounded-xl border-2 border-slate-700 group-hover:border-primary/40 transition-colors"
              />
            ) : (
              <div className="h-16 w-16 bg-primary/15 rounded-xl flex items-center justify-center border-2 border-slate-700 text-primary font-bold text-2xl group-hover:border-primary/40 transition-colors">
                {name.charAt(0)}
              </div>
            )}
            {isActive && (
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online" />
            )}
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-[9px] uppercase font-semibold text-slate-600 tracking-[0.2em] mb-1">
              ID
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 truncate max-w-[120px]">
              {id}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white truncate group-hover:text-primary-light transition-colors tracking-tight">
            {name}
          </h3>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-slate-200 tabular-nums">
                {memberCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Hash className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                Managed
              </span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`/dashboard/guild/${id}`}
        className="group/link flex items-center justify-between px-6 py-3.5 border-t border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
      >
        <span>Manage Server</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
      </Link>
    </div>
  );
};
