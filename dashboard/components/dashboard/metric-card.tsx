import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  className?: string;
}

export const MetricCard = ({
  name,
  value,
  icon: Icon,
  description,
  trend,
  className
}: MetricCardProps) => {
  return (
    <div className={cn(
      "bg-slate-900 border border-slate-800 p-5 rounded-xl group hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase text-slate-500 tracking-widest">{name}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <p className="text-2xl font-bold text-white tracking-tight tabular-nums">{value}</p>
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
            <p className="text-[11px] text-slate-500 mt-1.5">{description}</p>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};
