"use client";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
            {props.required && <span className="text-amber-400 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5",
            "text-slate-100 placeholder:text-slate-500 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500/70 focus:ring-red-500/40",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
