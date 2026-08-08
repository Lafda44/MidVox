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

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Hash,
  Shield,
  ArrowLeft,
  ShieldAlert
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const revalidate = 0; // Never cache any guild dashboard page

import { Button } from "@/components/ui/button";
import { GuildTabs } from "@/components/guild-tabs";

interface GuildLayoutProps {
  children: React.ReactNode;
  params: { guildId: string };
}

export default async function GuildLayout({
  children,
  params,
}: GuildLayoutProps) {
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
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-red-500/20 rounded-[6px] bg-red-500/5 p-12 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-6 opacity-50" />
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-neutral-400 mt-2 max-w-md">{error || "This guild does not exist or you do not have permission to manage it."}</p>
        <Link href="/dashboard/guilds" className="mt-8">
          <Button variant="outline">Back to Servers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumb / Back button */}
      <Link href="/dashboard/guilds" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to all servers
      </Link>

      {/* Guild Header */}
      <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="relative">
            {guild.icon ? (
              <Image
                src={guild.icon}
                alt={guild.name}
                width={96}
                height={96}
                className="rounded-xl border-2 border-neutral-700"
              />
            ) : (
              <div className="h-24 w-24 bg-primary rounded-xl flex items-center justify-center text-3xl font-bold text-white border-2 border-neutral-700">
                {guild.name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg border-2 border-[#111111]" title="Active">
              <div className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{guild.name}</h1>
                <span className="px-2.5 py-1 bg-[#0C0C0C] rounded-md text-[10px] uppercase font-medium text-neutral-500 border border-[#1A1A1A]">
                  ID: {guildId}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mt-1">Server Owner Dashboard</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { label: "Members", value: guild.member_count, icon: Users, color: "text-blue-400" },
                { label: "Roles", value: guild.role_count, icon: Shield, color: "text-emerald-400" },
                { label: "Channels", value: guild.channel_count, icon: Hash, color: "text-primary-light" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 bg-[#0C0C0C] px-4 py-2.5 rounded-lg border border-[#1A1A1A]">
                  <div className={cn("p-1.5 rounded-md bg-[#111111]", item.color)}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-medium text-neutral-500 tracking-wider leading-none mb-1">{item.label}</p>
                    <p className="text-base font-bold text-white leading-none">{item.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <Link href={`/dashboard/guild/${guildId}`} className="w-full">
             <Button className="w-full">
               Refresh
             </Button>
            </Link>
             <Link href={`/dashboard/guild/${guildId}/settings`} className="w-full">
              <Button variant="secondary" className="w-full">
                Server Settings
              </Button>
             </Link>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <GuildTabs guildId={guildId} />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}
