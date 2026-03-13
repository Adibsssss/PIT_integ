import React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export function Modal({ isOpen, onClose, children, className }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className={cn(
          "relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#0F1115] border border-white/10 p-6 text-left shadow-[0_0_50px_-10px_rgba(247,147,26,0.15)] transition-all",
          className,
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#94A3B8] hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {children}
      </div>
    </div>
  );
}
