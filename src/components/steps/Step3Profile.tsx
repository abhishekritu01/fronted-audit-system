"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuditorProfileSchema,type AuditorProfileForm,AUDIT_SECTOR_MAP,JURISDICTIONS,CERTIFICATION_TYPES,} from "../../types";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { profileApi } from "../../lib/api";
import { useState } from "react";
import { Award, Plus, Trash2, ArrowLeft, CheckCircle2, Briefcase, Globe } from "lucide-react";
import { cn } from "../../lib/utils";
import axios from "axios";



interface Props {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function Step3Profile({ email, onSuccess, onBack }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AuditorProfileForm>({
    resolver: zodResolver(AuditorProfileSchema),
    defaultValues: {
      certifications: [{ type: "CA", licenseNumber: "", yearOfQualification: 0 }],
      primaryAuditSector: undefined,
      specializedAuditArea: "",
      jurisdictions: [],
      independenceDeclaration: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "certifications" });
  const primarySector = watch("primaryAuditSector");
  const selectedJurisdictions = watch("jurisdictions");
  const subSectors = primarySector ? AUDIT_SECTOR_MAP[primarySector] ?? [] : [];

  const toggleJurisdiction = (
    value: string,
    current: string[],
    onChange: (v: string[]) => void
  ) => {
    if (current.includes(value)) {
      onChange(current.filter((j) => j !== value));
    } else {
      onChange([...current, value]);
    }
  };

  const onSubmit = async (data: AuditorProfileForm) => {
    setServerError(null);
    try {
      await profileApi.complete({ ...data, email });
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Failed to save profile. Please try again.");
      } else {
        setServerError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-display">Auditor Profile</h2>
          <p className="text-sm text-slate-400">Complete your professional credentials</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>

        {/* Section A: Certifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              A. Professional Certifications
            </h3>
          </div>

          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="p-4 rounded-xl border border-slate-700/60 bg-slate-800/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Certification #{idx + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select
                    label="Type"
                    required
                    placeholder="Select type"
                    options={CERTIFICATION_TYPES.map((t) => ({ value: t, label: t }))}
                    error={errors.certifications?.[idx]?.type?.message}
                    {...register(`certifications.${idx}.type`)}
                  />
                  <Input
                    label="License Number"
                    placeholder="e.g. CA-2024-001"
                    required
                    error={errors.certifications?.[idx]?.licenseNumber?.message}
                    {...register(`certifications.${idx}.licenseNumber`)}
                  />
                  <Input
                    label="Year of Qualification"
                    type="number"
                    placeholder="e.g. 2018"
                    required
                    error={errors.certifications?.[idx]?.yearOfQualification?.message}
                    {...register(`certifications.${idx}.yearOfQualification`, { valueAsNumber: true })}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              append({ type: "CA", licenseNumber: "", yearOfQualification: undefined as unknown as number })
            }
          >
            <Plus className="w-3.5 h-3.5" /> Add Another Certification
          </Button>
          {errors.certifications?.root && (
            <p className="text-xs text-red-400">{errors.certifications.root.message}</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Section B: Specialization */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              B. Audit Specialization & Jurisdiction
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Primary Audit Sector"
              required
              placeholder="Select sector"
              options={Object.keys(AUDIT_SECTOR_MAP).map((s) => ({ value: s, label: s }))}
              error={errors.primaryAuditSector?.message}
              {...register("primaryAuditSector")}
            />
            <Select
              label="Specialized Audit Area"
              required
              placeholder={primarySector ? "Select area" : "Select a sector first"}
              disabled={!primarySector}
              options={subSectors.map((s) => ({ value: s, label: s }))}
              error={errors.specializedAuditArea?.message}
              {...register("specializedAuditArea")}
            />
          </div>

          {/* Jurisdiction Multi-select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Jurisdiction <span className="text-amber-400">*</span>
            </label>
            <Controller
              control={control}
              name="jurisdictions"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {JURISDICTIONS.map((j) => {
                    const selected = field.value?.includes(j);
                    return (
                      <button
                        key={j}
                        type="button"
                        onClick={() => toggleJurisdiction(j, field.value ?? [], field.onChange)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                          selected
                            ? "border-amber-500/60 bg-amber-500/10 text-amber-300"
                            : "border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500"
                        )}
                      >
                        {selected && <span className="mr-1">✓</span>}
                        {j}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.jurisdictions && (
              <p className="text-xs text-red-400">{errors.jurisdictions.message}</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Independence Declaration */}
        <Controller
          control={control}
          name="independenceDeclaration"
          render={({ field }) => (
            <label className="flex gap-3 cursor-pointer group">
              <div className="mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={field.value === true}
                  onChange={(e) => field.onChange(e.target.checked ? true : undefined)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150",
                    field.value === true
                      ? "border-amber-500 bg-amber-500"
                      : "border-slate-600 group-hover:border-slate-400"
                  )}
                >
                  {field.value === true && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-300 leading-snug">
                  I declare that I have{" "}
                  <span className="text-white font-medium">no conflicts of interest</span> and confirm
                  my independence from the entities to be audited.{" "}
                  <span className="text-amber-400">*</span>
                </p>
                {errors.independenceDeclaration && (
                  <p className="text-xs text-red-400 mt-1">{errors.independenceDeclaration.message}</p>
                )}
              </div>
            </label>
          )}
        />

        {serverError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Button type="button" variant="secondary" size="lg" onClick={onBack} className="sm:w-auto">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button type="submit" size="lg" loading={isSubmitting} className="flex-1">
            {isSubmitting ? "Completing Registration..." : "Complete Registration"}
          </Button>
        </div>
      </form>
    </div>
  );
}
