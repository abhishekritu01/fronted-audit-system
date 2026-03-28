"use client";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description: string;
}

const STEPS: Step[] = [
  { label: "Identity", description: "Personal details" },
  { label: "Verify", description: "OTP confirmation" },
  { label: "Profile", description: "Auditor credentials" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isCompleted && "bg-amber-500 text-slate-950",
                  isActive && "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20",
                  !isCompleted && !isActive && "bg-slate-800 text-slate-500 border border-slate-700"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-semibold",
                    isActive ? "text-amber-400" : isCompleted ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-600 hidden sm:block">{step.description}</p>
              </div>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-16 sm:w-24 h-px mx-2 mb-5 transition-all duration-500",
                  stepNum < currentStep ? "bg-amber-500" : "bg-slate-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
