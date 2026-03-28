"use client";
import { useForm } from "react-hook-form";
import { type UserIdentification } from "../../types";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { authApi } from "../../lib/api";
import { useState } from "react";
import { User, Mail, ArrowRight } from "lucide-react";
import axios from "axios";

interface Props {
  defaultValues?: Partial<UserIdentification>;
  onSuccess: (data: UserIdentification) => void;
}

export default function Step1Identity({ defaultValues, onSuccess }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserIdentification>({
    defaultValues: defaultValues || {},
  });

  const onSubmit = async (data: UserIdentification) => {
    setServerError(null);
    try {
      await authApi.sendOtp(data);
      onSuccess(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <User className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-display">User Identification</h2>
          <p className="text-sm text-slate-400">Enter your personal details to begin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="e.g. John"
            required
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            placeholder="e.g. Smith"
            required
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            placeholder="john.smith@example.com"
            required
            error={errors.email?.message}
            {...register("email")}
          />
          <Mail className="absolute right-3 top-9 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        {serverError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Sending OTP..." : "Send OTP & Continue"}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </Button>
          <p className="text-xs text-slate-500 text-center mt-3">
            A 6-digit verification code will be sent to your email
          </p>
        </div>
      </form>
    </div>
  );
}
