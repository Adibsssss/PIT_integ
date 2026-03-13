import React from "react";
import { cn } from "../../lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "default",
  children,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-body font-semibold tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6)]",
    outline:
      "bg-transparent border-2 border-white/20 text-white hover:border-white hover:bg-white/10",
    ghost: "bg-transparent text-white hover:bg-white/10 hover:text-[#F7931A]",
  };

  const sizes = {
    default: "h-11 px-6 text-sm",
    sm: "h-9 px-4 text-xs",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
