import React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-white/5 border-white/10 text-[#94A3B8]",
    success: "bg-[#FFD600]/10 border-[#FFD600]/20 text-[#FFD600]", // Digital Gold
    warning: "bg-[#F7931A]/10 border-[#F7931A]/20 text-[#F7931A]", // Bitcoin Orange
    danger: "bg-[#EA580C]/10 border-[#EA580C]/20 text-[#EA580C]", // Burnt Orange
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    >
      {/* Optional pulsing node indicator based on variant */}
      {variant !== "default" && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              variants[variant].split(" ")[0],
            )}
          ></span>
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              variants[variant].split(" ")[2].replace("text-", "bg-"),
            )}
          ></span>
        </span>
      )}
      {children}
    </div>
  );
}
