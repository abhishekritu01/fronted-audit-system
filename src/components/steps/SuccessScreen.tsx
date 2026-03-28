"use client";
import { CheckCircle2, Shield, Award, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  email: string;
  firstName: string;
  onRestart: () => void;
}

export default function SuccessScreen({ email, firstName, onRestart }: Props) {
  return (
    <div className="text-center animate-fade-in space-y-6 py-4">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-amber-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white font-display">
          Welcome aboard, {firstName}!
        </h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          Your auditor profile has been successfully created and verified.
        </p>
        <p className="text-amber-400/70 text-xs font-mono">{email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center">
          <Shield className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-xs text-slate-400">Identity Verified</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center">
          <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-xs text-slate-400">Profile Complete</p>
        </div>
      </div>

      <Button variant="secondary" size="md" onClick={onRestart} className="mx-auto">
        Register Another Auditor <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
