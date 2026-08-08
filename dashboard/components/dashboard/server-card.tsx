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
      "group relative flex flex-col overflow-hidden rounded-[6px] border border-[#1F1F1F] bg-[#131313] transition-all duration-200",
      "hover:border-[#F59E0B]/40 hover:shadow-[0_0_24px_-6px_rgba(245,158,11,0.25)] hover:-translate-y-0.5",
      className
    )}>
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* header row */}
        <div className="flex items-start justify-between">
          <div className="relative shrink-0">
            {iconUrl ? (
              <Image
                src={iconUrl}
                alt={name}
                width={52}
                height={52}
                className="rounded-[5px] border border-[#2A2A2A] group-hover:border-[#F59E0B]/30 transition-colors duration-200"
              />
            ) : (
              <div className="h-[52px] w-[52px] rounded-[5px] border border-[#2A2A2A] group-hover:border-[#F59E0B]/30 transition-colors duration-200 bg-[#1A1A1A] flex items-center justify-center font-bold text-xl font-mono text-[#F59E0B]">
                {initial}
              </div>
            )}
            {isActive && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#22C55E] border-2 border-[#131313]" />
            )}
          </div>

          <span className="text-[9px] font-mono font-semibold tracking-[0.15em] uppercase text-[#666] bg-[#1A1A1A] border border-[#252525] px-2 py-1 rounded-[3px]">
            ID {String(id).slice(0, 10)}…
          </span>
        </div>

        {/* name */}
        <div>
          <h3 className="text-[15px] font-semibold text-[#EEE] group-hover:text-white truncate tracking-tight transition-colors">
            {name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#F59E0B]/60" />
            <span className="text-xs font-mono text-[#888] tabular-nums">
              {memberCount.toLocaleString()} members
            </span>
          </div>
        </div>
      </div>

      {/* footer CTA */}
      <Link
        href={`/dashboard/guild/${id}`}
        className="flex items-center justify-between px-5 py-3 border-t border-[#1F1F1F] bg-[#0F0F0F] group-hover:bg-[rgba(245,158,11,0.05)] transition-colors duration-200"
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666] group-hover:text-[#F59E0B] transition-colors">
          Manage
        </span>
        <ArrowUpRight className="h-4 w-4 text-[#555] group-hover:text-[#F59E0B] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
};
