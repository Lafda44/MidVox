"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  name: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  className?: string;
}

function useCountUp(target: number, active: boolean, duration = 1.2) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 70, damping: 26, mass: 1 });

  useEffect(() => {
    if (!active) return;
    motionValue.set(target);
    const unsub = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = Math.round(v).toLocaleString();
      }
    });
    return unsub;
  }, [active, target, motionValue, spring]);

  return ref;
}

export const MetricCard = ({
  name,
  value,
  icon,
  description,
  trend,
  className
}: MetricCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const numericValue =
    typeof value === "number" ? value : Number(String(value).replace(/[^\d.]/g, ""));

  const displayRef = useCountUp(
    typeof value === "number" || numericValue > 0 ? numericValue : 0,
    inView
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_12px_32px_rgba(25,27,20,0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_16px_32px_rgba(25,27,20,0.08)]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--ink-muted)]">{name}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <p className="font-display text-2xl font-bold tabular-nums tracking-tight text-[var(--ink)]">
              {typeof value === "number" || numericValue > 0 ? (
                <span ref={displayRef}>0</span>
              ) : (
                value
              )}
            </p>
            {trend && (
              <span className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                trend.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-400"
              )}>
                {trend.isUp ? "+" : ""}{trend.value}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1.5 text-[11px] text-[var(--ink-muted)]">{description}</p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.08, rotate: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10"
        >
          {icon}        </motion.div>
      </div>
    </motion.div>
  );
};
