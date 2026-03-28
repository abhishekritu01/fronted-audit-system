"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpSchema, type OtpFormValues } from "../../types";
import Button from "../ui/Button";
import { authApi } from "../../lib/api";
import { useEffect, useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react";
import { cn } from "../../lib/utils";
import axios from "axios";

interface Props {
  email: string;
  userData: { firstName: string; lastName: string; email: string };
  onSuccess: () => void;
  onBack: () => void;
}

export default function Step2Otp({ email, userData, onSuccess, onBack }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });

  // Start countdown
  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCountdown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Sync digits to form value
  useEffect(() => {
    setValue("otp", digits.join(""));
  }, [digits, setValue]);

  const handleDigitChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...digits];
    updated[idx] = val;
    setDigits(updated);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const otpComplete = digits.every((d) => d !== "");

  const onSubmit = async () => {
    setServerError(null);
    const otp = digits.join("");
    try {
      await authApi.verifyOtp({ email, otp });
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Invalid OTP. Please try again.");
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  const handleResend = async () => {
    setResending(true);
    setServerError(null);
    setDigits(Array(6).fill(""));
    try {
      await authApi.sendOtp(userData);
      startCountdown();
      inputRefs.current[0]?.focus();
    } catch {
      setServerError("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-display">Security Verification</h2>
          <p className="text-sm text-slate-400">Enter the 6-digit code sent to your email</p>
        </div>
      </div>

      <div className="mb-6 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
        <p className="text-sm text-slate-300 text-center">
          Code sent to{" "}
          <span className="text-amber-400 font-medium">{email}</span>
        </p>
        <p className="text-xs text-slate-500 text-center mt-1">
          For testing, use: <span className="font-mono text-amber-400/70">123456</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* OTP Digit Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={cn(
                "w-11 h-14 sm:w-13 sm:h-16 text-center text-xl font-bold rounded-lg",
                "border bg-slate-800/80 text-white",
                "focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60",
                "transition-all duration-150",
                digit ? "border-amber-500/60 bg-amber-500/5" : "border-slate-700"
              )}
            />
          ))}
        </div>

        {/* Countdown / Resend */}
        <div className="text-center">
          {!canResend ? (
            <p className="text-sm text-slate-400">
              Resend code in{" "}
              <span className="text-amber-400 font-mono font-semibold tabular-nums">
                0:{countdown.toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 text-center">
            {serverError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Button type="button" variant="secondary" size="lg" onClick={onBack} className="sm:w-auto">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={!otpComplete}
            loading={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </form>
    </div>
  );
}
