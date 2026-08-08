/**
 * â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
 * â•‘                                                                  â•‘
 * â•‘   â–‘â–ˆâ–€â–€â–‘â–ˆâ–€â–ˆâ–‘â–ˆâ–€â–„â–‘â–ˆâ–€â–€â–‘â–ˆâ–‘â–ˆ   â–‘â–ˆâ–€â–„â–‘â–ˆâ–€â–€â–‘â–ˆâ–‘â–ˆâ–‘â–ˆâ–€â–€                     â•‘
 * â•‘   â–‘â–ˆâ–‘â–‘â–‘â–ˆâ–‘â–ˆâ–‘â–ˆâ–‘â–ˆâ–‘â–ˆâ–€â–€â–‘â–„â–€â–„   â–‘â–ˆâ–‘â–ˆâ–‘â–ˆâ–€â–€â–‘â–€â–„â–€â–‘â–€â–€â–ˆ                     â•‘
 * â•‘   â–‘â–€â–€â–€â–‘â–€â–€â–€â–‘â–€â–€â–‘â–‘â–€â–€â–€â–‘â–€â–‘â–€   â–‘â–€â–€â–‘â–‘â–€â–€â–€â–‘â–‘â–€â–‘â–‘â–€â–€â–€                     â•‘
 * â•‘                                                                  â•‘
 * â•‘           Â© 2026 CodeX Devs â€” All Rights Reserved               â•‘
 * â•‘                                                                  â•‘
 * â•‘   discord  â”€â”€  https://discord.gg/codexdev                      â•‘
 * â•‘   youtube  â”€â”€  https://youtube.com/@CodeXDevs                   â•‘
 * â•‘   github   â”€â”€  https://github.com/RayExo                        â•‘
 * â•‘                                                                  â•‘
 * â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */

import React from "react";
import { RefreshCcw } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="h-16 w-16 border-4 border-[#1A1A1A] rounded-full" />
        <RefreshCcw className="h-16 w-16 text-primary animate-spin absolute top-0 left-0" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-slate-50 font-bold text-lg">Initializing System</h3>
        <p className="text-neutral-500 text-sm animate-pulse">Fetching parameters from edge cortex...</p>
      </div>
    </div>
  );
}
