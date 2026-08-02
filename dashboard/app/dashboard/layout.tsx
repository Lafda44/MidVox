"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Server, ShieldCheck, Ticket, BarChart4, FileText, Settings,
  Menu, X, Bell, User, Search, ChevronRight, Sparkles, LogOut,
  LifeBuoy, ChevronDown, Bot, Shield, Download
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { cn, isAdmin } from "@/lib/utils";
import { api } from "@/lib/api";
import { AdminConfig } from "@/types/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [globalNotification, setGlobalNotification] = useState<string | null>(null);

  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (bellRef.current && !bellRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close sidebar on mobile when navigating
  React.useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      signIn("discord");
    }

    // Fetch global notification
    const fetchNotification = async () => {
      try {
        const config = await api.getAdminConfig();
        setGlobalNotification(config.global_notification);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotification();
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-black text-white italic text-xl">{process.env.NEXT_PUBLIC_BRAND_NAME_WORD || "ZX"}</span>
          </div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  const match = pathname.match(/\/dashboard\/guild\/([^\/]+)/);
  const currentGuildId = match ? match[1] : null;

  // Base sidebar items â€“ will be filtered if we are inside a guild
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
            { name: "Auto Role", href: `/dashboard/guild/${currentGuildId}/autorole`, icon: Search },
            { name: "Auto React", href: `/dashboard/guild/${currentGuildId}/autoreact`, icon: Settings },
            { name: "Reaction Roles", href: `/dashboard/guild/${currentGuildId}/reactionroles`, icon: Search },
            { name: "Join DM", href: `/dashboard/guild/${currentGuildId}/joindm`, icon: User },
            { name: "Invites", href: `/dashboard/guild/${currentGuildId}/invites`, icon: Search },
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
            { name: "Join to Create", href: `/dashboard/guild/${currentGuildId}/j2c`, icon: Menu },
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
            ? [{ name: "Admin Panel", href: "/dashboard/admin", icon: Shield },
               ]
            : []),
      ];

  // Separate the "Back to Servers" item when inside a guild
  let mainSidebarItems = allSidebarItems;
  let backLinkItem: any = null;

  if (currentGuildId) {
    mainSidebarItems = allSidebarItems.filter(
      (item) => !(item.name === "Back to Servers")
    );
    backLinkItem = allSidebarItems.find((item) => item.name === "Back to Servers");
  }

  const BackLinkIcon = backLinkItem?.icon || Server;

  const sidebarVariants = {
    hidden: { opacity: 0, x: -24 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.3, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="min-h-screen bg-[#080810] text-slate-200">
      {/* Subtle neon background glows + tech grid over dark mesh image */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-kenburns"
          style={{
            backgroundImage: "url('/bg-mesh.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.6) saturate(1.1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 100% at 50% 10%, rgba(5,5,11,0.68) 0%, rgba(5,5,11,0.96) 80%)",
          }}
        />
        <div className="absolute top-[-20%] left-1/2 h-[40%] w-[60%] -translate-x-1/2 bg-primary/[0.05] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[36%] w-[40%] bg-accent/[0.04] blur-[110px]" />
        <div className="absolute inset-0 cyber-grid-bg opacity-40" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out lg:translate-x-0 bg-[#07070f] border-r border-white/[0.07] flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Neon top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-accent" />
        {/* Header */}
        <div className="flex h-16 items-center px-5 border-b border-white/[0.07] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_0_18px_rgba(88,101,242,0.45)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold tracking-tight text-slate-50 leading-none">
                {process.env.NEXT_PUBLIC_BRAND_NAME || "ZyroX"}
              </h1>
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 mt-1">
                Dashboard
              </span>
            </div>
          </div>
          <button
            className="ml-auto p-2 lg:hidden text-slate-500 hover:text-slate-50 rounded-lg hover:bg-slate-800/60 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-5">
          {mainSidebarItems.map((item: any, index: number) => {
            if (item.items) {
              return (
                <motion.div
                  key={item.name}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={sidebarVariants}
                  className="space-y-1"
                >
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-600 mb-2">
                    {item.name}
                  </p>
                  <div className="space-y-0.5">
                    {item.items.map((subItem: any) => {
                      const isActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "group relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200",
                            isActive
                              ? "bg-primary/10 text-primary-light"
                              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="sidebar-active"
                              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary to-accent shadow-[0_0_10px_rgba(88,101,242,0.6)]"
                            />
                          )}
                          <subItem.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive ? "text-primary" : "text-slate-600 group-hover:text-slate-400"
                            )}
                          />
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={sidebarVariants}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-colors duration-200",
                    isActive
                      ? "bg-primary/10 text-primary-light"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary to-accent shadow-[0_0_10px_rgba(88,101,242,0.6)]"
                    />
                  )}
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-slate-600 group-hover:text-slate-400"
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                  )}
                </Link>
              </motion.div>
            );
          })}

          {backLinkItem && (
            <div className="pt-4 mt-4 border-t border-slate-800">
              <Link
                href={backLinkItem.href || "/dashboard/guilds"}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
              >
                <BackLinkIcon className="h-4 w-4 text-slate-600 group-hover:text-slate-400" />
                {backLinkItem.name}
              </Link>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-900 border border-slate-800">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-slate-700 overflow-hidden">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-primary/60" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-50 truncate">
                {session?.user?.name || "Administrator"}
              </p>
              <p className="text-[10px] font-medium uppercase text-slate-500 truncate tracking-wider">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10 bg-[#080810]">
        {/* Top Navbar */}
        <header className="relative h-16 sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.07] bg-[#080810]/80 backdrop-blur-xl px-4 lg:px-8">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <button
            className="p-2 lg:hidden text-slate-400 hover:bg-slate-800/60 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex items-center w-96 max-w-full relative">
            <Search className="absolute left-3 h-4 w-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-slate-400 hover:bg-slate-800/60 hover:text-slate-50 rounded-lg transition-all"
              >
                <Bell className="h-5 w-5" />
                {globalNotification && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary border-2 border-slate-950" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-slate-900/10 p-3 z-20"
                  >
                    <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2 px-1">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em]">
                        Broadcasts
                      </p>
                      <button
                        onClick={() => setGlobalNotification(null)}
                        className="text-[10px] font-medium text-primary/70 hover:text-primary transition-colors uppercase"
                      >
                        Clear
                      </button>
                    </div>

                    {globalNotification ? (
                      <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="text-[10px] font-semibold uppercase text-primary tracking-widest">
                            System Broadcast
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {globalNotification}
                        </p>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center justify-center text-center">
                        <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                          <Bell className="h-4 w-4 text-slate-600" />
                        </div>
                        <p className="text-xs font-medium text-slate-500">
                          No active broadcasts
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-slate-700">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="User Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-primary/60" />
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
                  <span className="text-xs font-semibold text-slate-200">
                    {session?.user?.name?.split(' ')[0] || "Admin"}
                  </span>
                  <span className="text-[9px] font-medium uppercase text-slate-600 tracking-widest">
                    Active
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-slate-600 transition-transform hidden sm:block",
                    isProfileOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-slate-900/10 p-1.5 z-20"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-800 mb-1">
                      <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-0.5">
                        Authenticated As
                      </p>
                      <p className="text-sm font-semibold text-slate-50 truncate">
                        {session?.user?.name || "Administrator"}
                      </p>
                    </div>

                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800/70 hover:text-slate-50 transition-all">
                      <LifeBuoy className="h-4 w-4 text-slate-600" />
                      Support
                    </button>

                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="max-w-[1400px] mx-auto">{children}</div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
