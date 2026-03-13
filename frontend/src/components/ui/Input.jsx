import React from "react";
import { cn } from "../../lib/utils";

export function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full bg-black/50 border-b-2 border-white/20 h-12 px-4 py-2",
        "text-white text-sm font-mono placeholder:text-white/30",
        "focus-visible:border-[#F7931A] focus-visible:shadow-[0_10px_20px_-10px_rgba(247,147,26,0.3)]",
        "focus-visible:outline-none transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}
