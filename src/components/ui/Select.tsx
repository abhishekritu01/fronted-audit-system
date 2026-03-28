"use client";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
            {label}
            {props.required && <span className="text-amber-400 ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5",
            "text-slate-100 text-sm appearance-none",
            "focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/60",
            "transition-all duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error && "border-red-500/70",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
export default Select;
