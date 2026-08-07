"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Server, ShieldCheck, Ticket, BarChart4, FileText, Settings,
  Menu, X, Bell, User, Search, ChevronRight, Sparkles, LogOut,
  LifeBuoy, ChevronDown, Bot, Shield, Download, Zap
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { cn, isAdmin } from "@/lib/utils";
import { api } from "@/lib/api";
import { AdminConfig } from "@/types/api";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [globalNotification, setGlobalNotification] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (bellRef.current && !bellRef.current.contains(target)) setIsNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status === "unauthenticated") signIn("discord");
    const fetchNotification = async () => {
      try {
        const config = await api.getAdminConfig();
        setGlobalNotification(config.global_notification);
      } catch {}
    };
    fetchNotification();
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#070710] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 opacity-20 blur-xl" />
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.5)]">
              <Bot className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-white/80">
              {process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox"}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-600 animate-pulse">
              Authenticating…
            </p>
          </div>
        </div>
      </div>
    );
  }

  const match = pathname.match(/\/dashboard\/guild\/([^/]+)/);
  const currentGuildId = match ? match[1] : null;

  const allSidebarItems = currentGuildId
    ? [
        { name: "Overview", href: `/dashboard/guild/${currentGuildId}`, icon: LayoutDashboard },
        {
          name: "Security",
          items: [
            { name: "Anti-Nuke", href: `/dashboard/guild/${currentGuildId}/antinuke`, icon: ShieldCheck },
            { name: "Automod", href: `/dashboard/guild/${currentGuildId}/automod`, icon: ShieldCheck },
            { name: "Verification", href: `/dashboard/guild/${currentGuildId}/verification`, icon: User },
          ],
        },
        {
          name: "Engagement",
          items: [
            { name: "Welcome", href: `/dashboard/guild/${currentGuildId}/welcome`, icon: Bell },
            { name: "Leveling", href: `/dashboard/guild/${currentGuildId}/leveling`, icon: BarChart4 },
            { name: "Vanity Roles", href: `/dashboard/guild/${currentGuildId}/vanityroles`, icon: Sparkles },
            { name: "Auto Role", href: `/dashboard/guild/${currentGuildId}/autorole`, icon: User },
            { name: "Auto React", href: `/dashboard/guild/${currentGuildId}/autoreact`, icon: Zap },
            { name: "Reaction Roles", href: `/dashboard/guild/${currentGuildId}/reactionroles`, icon: Zap },
            { name: "Join DM", href: `/dashboard/guild/${currentGuildId}/joindm`, icon: User },
            { name: "Invites", href: `/dashboard/guild/${currentGuildId}/invites`, icon: Server },
            { name: "Tracking", href: `/dashboard/guild/${currentGuildId}/tracking`, icon: BarChart4 },
          ],
        },
        {
          name: "Media",
          items: [
            { name: "Insta Downloader", href: `/dashboard/guild/${currentGuildId}/instadl`, icon: Download },
          ],
        },
        {
          name: "Utility",
          items: [
            { name: "Tickets", href: `/dashboard/guild/${currentGuildId}/tickets`, icon: Ticket },
            { name: "Join to Create", href: `/dashboard/guild/${currentGuildId}/j2c`, icon: Settings },
            { name: "Custom Roles", href: `/dashboard/guild/${currentGuildId}/customroles`, icon: ShieldCheck },
            { name: "Voice Role", href: `/dashboard/guild/${currentGuildId}/invcrole`, icon: Settings },
          ],
        },
        { name: "Settings", href: `/dashboard/guild/${currentGuildId}/settings`, icon: Settings },
        { name: "Back to Servers", href: "/dashboard/guilds", icon: Server },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Servers", href: "/dashboard/guilds", icon: Server },
        ...(isAdmin(session?.user?.id)
          ? [{ name: "Admin Panel", href: "/dashboard/admin", icon: Shield }]
          : []),
      ];

  let mainSidebarItems = allSidebarItems;
  let backLinkItem: any = null;
  if (currentGuildId) {
    mainSidebarItems = allSidebarItems.filter((item) => item.name !== "Back to Servers");
    backLinkItem = allSidebarItems.find((item) => item.name === "Back to Servers");
  }
  const BackLinkIcon = backLinkItem?.icon || Server;

  const sidebarVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: (i: number) => ({
      opacity: 1, x: 0,
      transition: { delay: i * 0.025, duration: 0.35, ease: EASE },
    }),
  };

  const SidebarContent = () => (
    <>
      {/* Logo header */}
      <div className="flex h-16 items-center px-4 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 shrink-0">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 opacity-30 blur-md" />
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-[0_0_14px_rgba(99,102,241,0.5)]">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none tracking-tight">
              {process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox"}
            </p>
            <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-indigo-400/60 mt-0.5">
              Dashboard
            </p>
          </div>
        </div>
        <button
          className="ml-auto p-1.5 lg:hidden text-slate-600 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
        {mainSidebarItems.map((item: any, index: number) => {
          if (item.items) {
            return (
              <motion.div key={item.name} custom={index} initial="hidden" animate="visible" variants={sidebarVariants}>
                <p className="px-2.5 mb-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-700">
                  {item.name}
                </p>
                <div className="space-y-0.5">
                  {item.items.map((sub: any) => {
                    const isActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={cn(
                          "group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium transition-all duration-200",
                          isActive
                            ? "bg-indigo-500/10 text-indigo-300"
                            : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-pill"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]"
                          />
                        )}
                        <sub.icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-indigo-400" : "text-slate-700 group-hover:text-slate-500")} />
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <motion.div key={item.name} custom={index} initial="hidden" animate="visible" variants={sidebarVariants}>
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-semibold transition-all duration-200",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]"
                  />
                )}
                <item.icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-indigo-400" : "text-slate-700 group-hover:text-slate-500")} />
                {item.name}
                {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-indigo-500/60" />}
              </Link>
            </motion.div>
          );
        })}

        {backLinkItem && (
          <div className="pt-3 border-t border-white/[0.05]">
            <Link
              href={backLinkItem.href}
              className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-semibold text-slate-600 hover:bg-white/[0.04] hover:text-slate-300 transition-all"
            >
              <BackLinkIcon className="h-3.5 w-3.5 shrink-0 text-slate-700 group-hover:text-slate-500" />
              {backLinkItem.name}
            </Link>
          </div>
        )}
      </nav>

      {/* User profile */}
      <div className="shrink-0 p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 shrink-0">
            {session?.user?.image ? (
              <Image src={session.user.image!} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-indigo-600/20 flex items-center justify-center">
                <User className="h-4 w-4 text-indigo-400/60" />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white/80 truncate leading-none">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-slate-600 mt-0.5">
              Active
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-auto p-1.5 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#070710] text-slate-200">
      {/* Fixed background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/bg-mesh.svg')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.45) saturate(0.9)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 100% at 50% 0%, rgba(5,5,16,0.6) 0%, rgba(5,5,16,0.97) 75%)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        <div className="absolute top-[-15%] left-[20%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.05] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] h-[400px] w-[400px] rounded-full bg-violet-600/[0.04] blur-[110px]" />
        <div className="absolute inset-0 cyber-grid-bg opacity-[0.18]" />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-60 flex flex-col border-r border-white/[0.06] bg-[#07070f]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent pointer-events-none" />
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="lg:pl-60 flex flex-col min-h-screen relative z-10">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 flex items-center px-4 lg:px-6 border-b border-white/[0.06] bg-[#07070f]/80 backdrop-blur-xl">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

          <button
            className="p-2 lg:hidden text-slate-600 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors mr-3"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Breadcrumb / search */}
          <div className="hidden md:flex items-center gap-2 relative">
            <Search className="absolute left-3 h-3.5 w-3.5 text-slate-700" />
            <input
              type="text"
              placeholder="Quick search…"
              className="w-64 bg-white/[0.03] border border-white/[0.06] rounded-lg py-1.5 pl-9 pr-3 text-xs text-slate-400 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-slate-600 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
              >
                <Bell className="h-4 w-4" />
                {globalNotification && (
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                )}
              </button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-[#0d0d1c] border border-white/[0.08] rounded-xl shadow-2xl p-3 z-20"
                  >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.05]">
                      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600">Broadcasts</p>
                      <button onClick={() => setGlobalNotification(null)} className="text-[9px] font-mono uppercase text-indigo-500/60 hover:text-indigo-400 transition-colors">Clear</button>
                    </div>
                    {globalNotification ? (
                      <div className="bg-indigo-500/[0.07] border border-indigo-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Sparkles className="h-3 w-3 text-indigo-400" />
                          <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400">System Broadcast</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{globalNotification}</p>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center gap-2">
                        <Bell className="h-5 w-5 text-slate-700" />
                        <p className="text-xs text-slate-600">No active broadcasts</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-5 w-px bg-white/[0.06] hidden sm:block" />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.07] transition-all"
              >
                <div className="h-7 w-7 rounded-full overflow-hidden border border-white/10">
                  {session?.user?.image ? (
                    <Image src={session.user.image!} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-indigo-600/20 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-indigo-400/50" />
                    </div>
                  )}
                </div>
                <span className="hidden sm:block text-xs font-semibold text-slate-300">
                  {session?.user?.name?.split(" ")[0] || "Admin"}
                </span>
                <ChevronDown className={cn("h-3 w-3 text-slate-600 hidden sm:block transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-[#0d0d1c] border border-white/[0.08] rounded-xl shadow-2xl p-1.5 z-20"
                  >
                    <div className="px-3 py-2 border-b border-white/[0.05] mb-1">
                      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600 mb-0.5">Signed in as</p>
                      <p className="text-xs font-semibold text-white/80 truncate">{session?.user?.name || "Administrator"}</p>
                    </div>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-white/[0.04] hover:text-slate-200 transition-all">
                      <LifeBuoy className="h-3.5 w-3.5" />
                      Support
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500/70 hover:bg-red-500/[0.08] hover:text-red-400 transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div className="max-w-[1400px] mx-auto">{children}</div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
