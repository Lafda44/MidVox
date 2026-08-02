import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  children,
  icon: Icon,
  className
}: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8", className)}>
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 mt-1 font-normal">
              {description}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};
