"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ShieldCheck, ChevronRight, Hash, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function GuildsPage() {
  const { data: session, status } = useSession();
  const [botGuilds, setBotGuilds] = useState<any[]>([]);
  const [userGuilds, setUserGuilds] = useState<any[]>([]);
  const [userDiscordError, setUserDiscordError] = useState<string | null>(null);
  const [botError, setBotError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
    if (status !== "authenticated") return;

    const fetchData = async () => {
      setLoading(true);
      setBotError(null);
      setUserDiscordError(null);

      try {
        const guilds = await api.listGuilds();
        setBotGuilds(guilds);

        // Try to fetch user's Discord guilds for admin filter
        if (session?.accessToken) {
          try {
            const res = await fetch("https://discord.com/api/users/@me/guilds", {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            });
            if (res.ok) {
              const discordGuilds = await res.json();
              setUserGuilds(discordGuilds);
            } else {
              setUserDiscordError("Discord API returned " + res.status);
              console.warn("Discord API returned", res.status, "- falling back to show all bot guilds");
            }
          } catch (e) {
            setUserDiscordError("Discord API fetch failed");
            console.warn("Discord API fetch failed - falling back to show all bot guilds", e);
          }
        } else {
          setUserDiscordError("No access token in session");
          console.warn("No accessToken in session - showing all bot guilds without Discord filter");
        }
      } catch (err: any) {
        console.error("Failed to fetch bot guilds:", err);
        setBotError(err.message || "Failed to load bot servers.");
      }

      setLoading(false);
    };

    fetchData();
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCcw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const MANAGE_GUILD = BigInt(0x20);
  const ADMINISTRATOR = BigInt(0x8);
  const adminUserGuilds = userGuilds.filter((g: any) => {
    try {
      const perms = BigInt(g.permissions);
      return (perms & ADMINISTRATOR) === ADMINISTRATOR || (perms & MANAGE_GUILD) === MANAGE_GUILD || g.owner === true;
    } catch {
      return g.owner === true;
    }
  });

  const adminGuildIds = new Set(adminUserGuilds.map((g: any) => String(g.id)));
  const managedGuilds = botGuilds.filter((g: any) => adminGuildIds.has(String(g.id)));
  // Fallback: if Discord filter yielded nothing but we have bot guilds, show them anyway
  const guilds = managedGuilds.length > 0 ? managedGuilds : botGuilds;
  const error = botError;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Servers</h1>
          <p className="text-slate-400 mt-2">
            Select a server to manage its unique configuration and modules.
          </p>
        </div>
        <div className="text-sm font-medium px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-300">
          Showing <span className="text-white">{guilds.length}</span> active guilds
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center">
          <ShieldCheck className="h-12 w-12 text-red-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-white font-bold text-lg">Connection Error</h3>
          <p className="text-slate-400 mt-2">{error}</p>
          <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>Retry Connection</Button>
        </div>
      ) : guilds.length === 0 ? (
        <div className="bg-slate-800/30 border border-slate-800 border-dashed p-16 rounded-3xl text-center">
          <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-white font-bold text-xl">No Servers Found</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto">
            The bot hasn&apos;t joined any servers yet.
          </p>
        </div>
      ) : (
        <>
          {userDiscordError && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-yellow-500 shrink-0" />
              <p className="text-sm text-slate-300">
                Could not verify your Discord permissions — showing all guilds the bot is in.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {guilds.map((guild: any, i: number) => (
            <motion.div
              key={guild.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
              className="bg-slate-900 border border-slate-800 rounded-xl group hover:border-primary/40 transition-all duration-300 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="relative">
                    {guild.icon_url ? (
                      <Image src={guild.icon_url} alt={guild.name} width={56} height={56} className="rounded-xl border-2 border-slate-700 transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="h-14 w-14 bg-primary/15 rounded-xl flex items-center justify-center border-2 border-slate-700 text-primary font-bold text-xl transition-transform group-hover:scale-105">
                        {guild.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Bot Online" />
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[9px] uppercase font-semibold text-slate-600 tracking-widest mb-1">Guild ID</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 truncate max-w-[110px]">{guild.id}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-primary-light transition-colors">{guild.name}</h3>
                  <div className="flex items-center gap-3 mt-3 text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-300">{guild.member_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                      <Hash className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-800 group-hover:bg-slate-800/40 transition-colors">
                <Button className="w-full justify-between group/btn" variant="secondary" asChild>
                  <Link href={`/dashboard/guild/${guild.id}`}>
                    <span>Manage Server</span>
                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </>
      )}
    </div>
  );
}