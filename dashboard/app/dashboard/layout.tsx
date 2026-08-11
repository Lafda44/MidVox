"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Server, ShieldCheck, Ticket, BarChart4, Settings,
  Menu, X, Bell, User, Search, ChevronRight, Sparkles, LogOut,
  LifeBuoy, ChevronDown, Terminal, Shield, Download, Zap
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { cn, isAdmin } from "@/lib/utils";
import { api } from "@/lib/api";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "MidVox";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [globalNotification, setGlobalNotification] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const authRedirectStarted = useRef(false);

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
    if (status !== "unauthenticated" || authRedirectStarted.current) return;

    authRedirectStarted.current = true;
    const callbackUrl = pathname === "/dashboard" ? "/dashboard/guilds" : pathname;
    void signIn("discord", { callbackUrl });
  }, [pathname, status]);

  useEffect(() => {
    if (status !== "authenticated") return;

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
      <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-11 w-11 rounded-[6px] bg-[#F59E0B] flex items-center justify-center shadow-[0_0_28px_rgba(245,158,11,0.35)]">
            <Terminal className="h-5 w-5 text-black" />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#555] animate-pulse">
            Authenticating
          </p>
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

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-[12.5px] font-medium font-mono transition-all duration-150",
          isActive
            ? "bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border-l-2 border-[#F59E0B] pl-[10px]"
            : "text-[#777] hover:bg-[#161616] hover:text-[#CCC] border-l-2 border-transparent pl-[10px]"
        )}
      >
        <item.icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-[#F59E0B]" : "text-[#555] group-hover:text-[#999]")} />
        {item.name}
        {isActive && <ChevronRight className="ml-auto h-3 w-3 text-[#F59E0B]/50" />}
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo header */}
      <div className="flex h-14 items-center px-4 border-b border-[#1A1A1A] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-[5px] bg-[#F59E0B] flex items-center justify-center shrink-0">
            <Terminal className="h-3.5 w-3.5 text-black" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#F5F5F5] leading-none tracking-tight font-mono">
              {BRAND}
            </p>
            <p className="text-[8px] font-mono uppercase tracking-[0.25em] text-[#F59E0B]/60 mt-1">
              Control Panel
            </p>
          </div>
        </div>
        <button
          className="ml-auto p-1.5 lg:hidden text-[#555] hover:text-white rounded-[4px] hover:bg-[#1A1A1A] transition-colors"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
        {mainSidebarItems.map((item: any) => {
          if (item.items) {
            return (
              <div key={item.name}>
                <p className="px-3 mb-1.5 text-[9px] font-mono font-semibold uppercase tracking-[0.25em] text-[#444]">
                  {item.name}
                </p>
                <div className="space-y-0.5">
                  {item.items.map((sub: any) => <NavLink key={sub.name} item={sub} />)}
                </div>
              </div>
            );
          }
          return <NavLink key={item.name} item={item} />;
        })}

        {backLinkItem && (
          <div className="pt-3 border-t border-[#1A1A1A]">
            <Link
              href={backLinkItem.href}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-[12.5px] font-mono font-medium text-[#666] hover:bg-[#161616] hover:text-[#CCC] transition-all"
            >
              <BackLinkIcon className="h-3.5 w-3.5 shrink-0 text-[#555] group-hover:text-[#999]" />
              {backLinkItem.name}
            </Link>
          </div>
        )}
      </nav>

      {/* User profile */}
      <div className="shrink-0 p-3 border-t border-[#1A1A1A]">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[5px] bg-[#131313] border border-[#1F1F1F]">
          <div className="relative h-8 w-8 rounded-[4px] overflow-hidden border border-[#2A2A2A] shrink-0">
            {session?.user?.image ? (
              <Image src={session.user.image!} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-[#1A1A1A] flex items-center justify-center">
                <User className="h-4 w-4 text-[#555]" />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-[#DDD] truncate leading-none">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#22C55E] mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#22C55E] inline-block" />
              Online
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-auto p-1.5 rounded-[4px] text-[#555] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-all"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#DDD]">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-60 flex flex-col border-r border-[#1A1A1A] bg-[#0F0F0F] transition-transform duration-200 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="lg:pl-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 flex items-center px-4 lg:px-6 border-b border-[#1A1A1A] bg-[rgba(12,12,12,0.95)] backdrop-blur-sm">
          <button
            className="p-2 lg:hidden text-[#555] hover:text-white rounded-[4px] hover:bg-[#1A1A1A] transition-colors mr-3"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-3.5 w-3.5 text-[#444]" />
            <input
              type="text"
              placeholder="search..."
              className="w-64 bg-[#131313] border border-[#1F1F1F] rounded-[4px] py-1.5 pl-9 pr-3 text-xs font-mono text-[#AAA] placeholder:text-[#444] focus:outline-none focus:border-[#F59E0B]/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-[#555] hover:text-white rounded-[4px] hover:bg-[#1A1A1A] transition-all"
              >
                <Bell className="h-4 w-4" />
                {globalNotification && (
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                )}
              </button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-72 bg-[#131313] border border-[#252525] rounded-[6px] shadow-2xl p-3 z-20"
                  >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#1F1F1F]">
                      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#555]">Broadcasts</p>
                      <button onClick={() => setGlobalNotification(null)} className="text-[9px] font-mono uppercase text-[#F59E0B]/60 hover:text-[#F59E0B] transition-colors">Clear</button>
                    </div>
                    {globalNotification ? (
                      <div className="bg-[rgba(245,158,11,0.05)] border border-[#F59E0B]/20 rounded-[4px] p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Sparkles className="h-3 w-3 text-[#F59E0B]" />
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#F59E0B]">System</span>
                        </div>
                        <p className="text-xs text-[#BBB] leading-relaxed">{globalNotification}</p>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center gap-2">
                        <Bell className="h-5 w-5 text-[#333]" />
                        <p className="text-xs font-mono text-[#555]">No active broadcasts</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-5 w-px bg-[#1F1F1F] hidden sm:block" />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-[4px] hover:bg-[#1A1A1A] transition-all"
              >
                <div className="relative h-7 w-7 rounded-[4px] overflow-hidden border border-[#2A2A2A]">
                  {session?.user?.image ? (
                    <Image src={session.user.image!} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-[#1A1A1A] flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-[#555]" />
                    </div>
                  )}
                </div>
                <span className="hidden sm:block text-xs font-mono font-semibold text-[#BBB]">
                  {session?.user?.name?.split(" ")[0] || "Admin"}
                </span>
                <ChevronDown className={cn("h-3 w-3 text-[#555] hidden sm:block transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-48 bg-[#131313] border border-[#252525] rounded-[6px] shadow-2xl p-1.5 z-20"
                  >
                    <div className="px-3 py-2 border-b border-[#1F1F1F] mb-1">
                      <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#555] mb-0.5">Signed in as</p>
                      <p className="text-xs font-semibold text-[#DDD] truncate">{session?.user?.name || "Administrator"}</p>
                    </div>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-mono font-medium text-[#777] hover:bg-[#1A1A1A] hover:text-[#CCC] transition-all">
                      <LifeBuoy className="h-3.5 w-3.5" />
                      Support
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-mono font-medium text-[#EF4444]/70 hover:bg-[rgba(239,68,68,0.08)] hover:text-[#EF4444] transition-all"
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="max-w-[1400px] mx-auto">{children}</div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
