import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Server, Settings, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

interface GuildLayoutProps {
  children: React.ReactNode;
  params: { guildId: string };
}

export default async function GuildLayout({ children, params }: GuildLayoutProps) {
  const guildId = params.guildId;
  let guild;
  let error = null;

  try {
    guild = await api.getGuildDetails(guildId);
  } catch (err: any) {
    console.error("Failed to fetch guild details:", err);
    error = err.message || "Failed to load guild data.";
  }

  if (error || !guild) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-12 text-center">
        <ShieldAlert className="mb-5 h-12 w-12 text-red-500/60" />
        <h2 className="text-xl font-semibold text-white">Access denied</h2>
        <p className="mt-2 max-w-md text-sm text-neutral-500">
          {error || "This server does not exist or you do not have permission to manage it."}
        </p>
        <Link href="/dashboard/guilds" className="mt-6">
          <Button variant="outline">Back to servers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-6 fade-in duration-500">
      <div className="flex min-h-10 items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4">
        <div className="flex min-w-0 items-center gap-2 text-xs">
          <Link
            href="/dashboard/guilds"
            className="flex items-center gap-2 font-medium text-neutral-500 transition-colors hover:text-neutral-200"
          >
            <Server className="h-3.5 w-3.5" />
            Servers
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-neutral-700" />
          <div className="flex min-w-0 items-center gap-2 font-semibold text-neutral-200">
            {guild.icon ? (
              <Image
                src={guild.icon}
                alt=""
                width={22}
                height={22}
                className="h-[22px] w-[22px] rounded-md border border-[#2A2A2A]"
              />
            ) : (
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-primary text-[10px] font-bold text-black">
                {guild.name.charAt(0)}
              </span>
            )}
            <span className="truncate">{guild.name}</span>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.07] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-500 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
        </div>

        <Link
          href={`/dashboard/guild/${guildId}/settings`}
          className="flex shrink-0 items-center gap-2 rounded-md border border-[#252525] bg-[#131313] px-3 py-2 text-[11px] font-semibold text-neutral-400 transition-colors hover:border-[#333] hover:text-white"
        >
          <Settings className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Server settings</span>
        </Link>
      </div>

      <div className="min-h-[500px]">{children}</div>
    </div>
  );
}
