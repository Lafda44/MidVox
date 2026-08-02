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

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
