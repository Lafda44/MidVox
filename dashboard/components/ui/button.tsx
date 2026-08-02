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

"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
        outline:
          "border border-slate-700 bg-transparent hover:bg-slate-800/60 hover:text-slate-50 hover:border-slate-500",
        secondary:
          "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-slate-50 border border-slate-700",
        ghost: "hover:bg-slate-800/60 hover:text-slate-50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
