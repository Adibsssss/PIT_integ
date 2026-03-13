import React from "react";
import { cn } from "../../lib/utils";

// 1. The Main Wrapper
export function Card({ className, interactive = false, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-[#0F1115] border border-white/10 rounded-2xl overflow-hidden",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-[#F7931A]/50 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// 2. The Header Section (Used for titles)
export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("p-8 pb-4 flex flex-col space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// 3. The Title Text
export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        "font-heading font-semibold text-2xl text-white",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

// 4. The Main Content Area
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-8 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

// 5. The Footer Area (Used for buttons at the bottom)
export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center p-8 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
