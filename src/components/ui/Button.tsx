"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses = {
  primary:
    "bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 disabled:opacity-50",
  secondary:
    "border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-50",
  ghost: "hover:bg-slate-800 text-slate-300 disabled:opacity-50",
  danger: "bg-red-600 hover:bg-red-500 text-white disabled:opacity-50",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3 text-base rounded-lg",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "transition-all duration-200 cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
          "disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
