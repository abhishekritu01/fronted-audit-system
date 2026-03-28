import { z } from "zod";

/**
 * User Identification
 */
export const UserIdentificationSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

/**
 * OTP Schema
 */
export const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Enter all 6 digits" })
    .regex(/^\d+$/, { message: "OTP must be numeric" }),
});

/**
 * Constants (use as const for enums)
 */
export const CERTIFICATION_TYPES = [
  "CA",
  "ACCA",
  "CPA",
  "CIA",
  "CISA",
] as const;

export const AUDIT_SECTORS = [
  "Financial Services",
  "Manufacturing",
  "Public Sector",
] as const;

/**
 * Certification Schema
 */
export const CertificationSchema = z.object({
  type: z.enum(CERTIFICATION_TYPES, {
    message: "Select a certification type",
  }),

  licenseNumber: z.string().min(1, {
    message: "License number is required",
  }),

  yearOfQualification: z.coerce
    .number<number>()
    .int()
    .min(1950, { message: "Year must be after 1950" })
    .max(new Date().getFullYear(), {
      message: `Year cannot exceed ${new Date().getFullYear()}`,
    }),
});

/**
 * Auditor Profile Schema
 */
export const AuditorProfileSchema = z.object({
  certifications: z
    .array(CertificationSchema)
    .min(1, { message: "Add at least one certification" }),

  primaryAuditSector: z.enum(AUDIT_SECTORS, {
    message: "Select a primary sector",
  }),

  specializedAuditArea: z.string().min(1, {
    message: "Select a specialized audit area",
  }),

  jurisdictions: z
    .array(z.string())
    .min(1, { message: "Select at least one jurisdiction" }),

  independenceDeclaration: z.literal(true, {
    message: "You must confirm independence",
  }),
});

/**
 * Types
 */
export type UserIdentification = z.infer<typeof UserIdentificationSchema>;
export type OtpFormValues = z.infer<typeof OtpSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type AuditorProfileForm = z.infer<typeof AuditorProfileSchema>;

/**
 * Constants
 */
export const AUDIT_SECTOR_MAP: Record<string, string[]> = {
  "Financial Services": ["Banking", "Insurance", "Asset Management"],
  Manufacturing: ["Automotive", "Consumer Goods", "Industrial Products"],
  "Public Sector": ["Healthcare", "Education", "Local Government"],
};

export const JURISDICTIONS = [
  "UK - IFRS",
  "US - GAAP",
  "India - ICAI",
  "EU - IFRS",
  "Australia - AASB",
  "Canada - ASPE",
] as const;
