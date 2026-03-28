"use client";
import { useState } from "react";
import StepIndicator from "../components/ui/StepIndicator";
import Step1Identity from "../components/steps/Step1Identity";
import Step2Otp from "../components/steps/Step2Otp";
import Step3Profile from "../components/steps/Step3Profile";
import SuccessScreen from "../components/steps/SuccessScreen";
import type { UserIdentification } from "../types";
import { Scale } from "lucide-react";

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserIdentification | null>(null);

  const handleStep1Success = (data: UserIdentification) => {
    setUserData(data);
    setStep(2);
  };

  const handleStep2Success = () => {
    setStep(3);
  };

  const handleStep3Success = () => {
    setStep(4);
  };

  const handleRestart = () => {
    setUserData(null);
    setStep(1);
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-600/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-slate-900/50 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium tracking-wide uppercase">
              Audit Financial Information System
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display leading-tight">
            Auditor Registration
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Complete your professional onboarding in 3 simple steps
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-8">
          {step < 4 && <StepIndicator currentStep={step} />}

          {step === 1 && (
            <Step1Identity
              defaultValues={userData ?? undefined}
              onSuccess={handleStep1Success}
            />
          )}

          {step === 2 && userData && (
            <Step2Otp
              email={userData.email}
              userData={userData}
              onSuccess={handleStep2Success}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && userData && (
            <Step3Profile
              email={userData.email}
              onSuccess={handleStep3Success}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && userData && (
            <SuccessScreen
              email={userData.email}
              firstName={userData.firstName}
              onRestart={handleRestart}
            />
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Secure · Compliant · Professional
        </p>
      </div>
    </main>
  );
}
